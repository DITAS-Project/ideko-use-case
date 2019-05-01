package com.ditas


import java.io.{FileInputStream, IOException, InputStream}
import java.net.URL
import java.security.spec.RSAPublicKeySpec
import java.security.{KeyStore, PublicKey, SecureRandom, cert}
import java.util.logging.Logger

import com.auth0.jwk._
import com.ditas.configuration.ServerConfiguration
import com.ditas.ideko.QueryInfluxDBRequest.{QueryInfluxDBGrpc, QueryInfluxDBReply, QueryInfluxDBRequest}
import com.ditas.utils.UtilFunctions
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import com.paulgoldbaum.influxdbclient.InfluxDB
import io.grpc._
import javax.net.ssl._
import org.apache.commons.codec.binary.Base64
import org.apache.commons.io.IOUtils
import org.apache.http.conn.ssl.NoopHostnameVerifier
import pdi.jwt.Jwt
import pdi.jwt.exceptions.JwtValidationException

import scala.collection.JavaConverters._
import scala.collection.mutable
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContext, Future}


object IdekoDALInfluxdbServer {
  private val LOGGER = Logger.getLogger(getClass.getName)

  def main(args: Array[String]): Unit = {
    if (args.length < 1) {
      System.err.println("Usage: IdekoInfluxdbServer <configFile>")
      System.exit(1)
    }
    val configFile = UtilFunctions.loadServerConfig(args(0))
    debugMode = configFile.debugMode

    serverConfigFile = configFile
    port = configFile.port
    influxdbServer = configFile.influxdbServer
    influxdbPort = configFile.influxdbPort
    influxdbUsername = configFile.influxdbUsername
    influxdbPassword = configFile.influxdbPassword
    influxdbDBNameMap = configFile.influxdbDBNameMap.asScala
    waitDuration = configFile.waitDuration.seconds

    val server = new IdekoDALInfluxdbServer(ExecutionContext.global)
    server.start()
    server.blockUntilShutdown()
  }

  private var port = 50052 //default port
  private var debugMode = false
  private var influxdbServer = "localhost"
  private var influxdbPort = 8086
  private var influxdbUsername = "username"
  private var influxdbPassword = "password"
  private var influxdbDBNameMap = mutable.Map.empty[String, java.util.ArrayList[String]]
  private var waitDuration = 2.seconds // seconds
  private var serverConfigFile: ServerConfiguration = null
}



class IdekoDALInfluxdbServer(executionContext: ExecutionContext) {
  self =>
  private[this] var server: Server = null

  private[this] val queryInfluxDBImpl = new QueryInfluxDBImpl

  private def start(): Unit = {
    val builder = ServerBuilder.forPort(IdekoDALInfluxdbServer.port)
    builder.addService(QueryInfluxDBGrpc.
      bindService(queryInfluxDBImpl, executionContext))
    server = builder.build().start()

    IdekoDALInfluxdbServer.LOGGER.info("Server started, listening on " + IdekoDALInfluxdbServer.port)
    sys.addShutdownHook {
      System.err.println("*** shutting down gRPC server since JVM is shutting down")
      self.stop()
      System.err.println("*** server shut down")
    }
  }

  private def stop(): Unit = {
    queryInfluxDBImpl.close()
    if (server != null) {
      server.shutdown()
    }
  }


  private def blockUntilShutdown(): Unit = {
    if (server != null) {
      server.awaitTermination()
    }
  }

  private object QueryInfluxDBImpl {
    private val DB_REGEX = raw"\{\{db\}\}".r
    private val POLICY_REGEX = raw"\{\{policy\}\}".r
    private val AUTH_HEADER_PATTERN = "Bearer (.*)".r
  }


  private class QueryInfluxDBImpl extends QueryInfluxDBGrpc.QueryInfluxDB {
    private val influxDB = InfluxDB.connect(IdekoDALInfluxdbServer.influxdbServer, IdekoDALInfluxdbServer.influxdbPort,
      IdekoDALInfluxdbServer.influxdbUsername, IdekoDALInfluxdbServer.influxdbPassword, false, null)
    private val LOGGER = Logger.getLogger(getClass.getName)

    private val JWKS_ENDPOINT = new URL("https://153.92.30.56:58080/auth/realms/288/protocol/openid-connect/certs")

    private val kid = "auytc2T_c-7Y9HQ-TB5QBMskPvXCYzXSfJ6rOiBKv-E"

    override def query(request: QueryInfluxDBRequest): Future[QueryInfluxDBReply] = {
      val machineId = request.machineId
      val queryObject = request.query
//      val purpose = req.dalMessageProperties.get.purpose

      if (request.dalMessageProperties.isEmpty || request.dalMessageProperties.get.authorization.isEmpty) {
        Future.failed(Status.ABORTED.augmentDescription("Missing authorization").asRuntimeException())
      } else if (queryObject.isEmpty) {
        Future.failed(Status.ABORTED.augmentDescription("Missing query").asRuntimeException())
      } else if (machineId.isEmpty) {
        Future.failed(Status.ABORTED.augmentDescription("Missing machine id").asRuntimeException())
      } else {
        val authorizationHeader: String = request.dalMessageProperties.get.authorization
        try {
          validateJwtToken(authorizationHeader)
        } catch {
          case e: Exception => {
            LOGGER.throwing(getClass.getName, "query", e);
            return Future.failed(Status.ABORTED.augmentDescription(e.getMessage).asRuntimeException())
          }
        }

        val (dbName, policy) = chooseMachine(machineId)
        (dbName, policy) match {
          case (Some(dbName), Some(policy)) => {
            val resultRecords = queryInfluxDB(queryObject, machineId, dbName, policy)
            val reply = new QueryInfluxDBReply(Seq(resultRecords))
            return Future.successful(reply)
          }
          case (None, None) => {
            return Future.failed(Status.ABORTED.augmentDescription("Machine id didn't match any dbName and policy").asRuntimeException())
          }
        }
      }
    }

    private def getSigningKeys(): (String, PublicKey) = {
      val jwks = getJwks(JWKS_ENDPOINT, false, "myKeystore")
      if (jwks("keys").isEmpty) {
        throw new JwtValidationException("No keys received from JWKS")
      }
      LOGGER.info(jwks.mkString(","))
      val key = jwks("keys")(0)
      if ((key("use") != "sig") ||
        (key("kty") != "RSA") ||
        key("kid").isEmpty ||
      key("n").isEmpty ||
        key("e").isEmpty) {
        throw new JwtValidationException("Incorrect keys received from JWKS")
      }
      val publicKey = getPEMFromRSA(key("n"), key("e"))
      val kid = key("kid")
      (kid, publicKey)
    }

    private def validateJwtToken(authorizationHeader: String) = {
      val token = for (m <- QueryInfluxDBImpl.AUTH_HEADER_PATTERN.findFirstMatchIn(authorizationHeader)) yield m.group(1)
      val signingKey = getSigningKeys()
      val kid = signingKey._1
      val publicKey = signingKey._2

//      val http = new UrlJwkProvider(JWKS_ENDPOINT)
//      val allJwkss = http.getAll
//      println(s"Num JWKSS: ${allJwkss.size()}")
//      val jwk = http.get(kid)

//      val provider = new GuavaCachedJwkProvider(http)
//      val jwk = provider.get(kid) //throws Exception when not found or can't get one

//      val algorithm = Algorithm.RSA256(keyProvider)


      Jwt.validate(token.getOrElse(""), publicKey)
    }

    private def queryInfluxDB(query: String, machineId: String, dbName: String, policy: String): String = {
      LOGGER.info(s"Query: {${query}}\nmachineId=${machineId}, dbName=${dbName}")
//      val databases = Await.result(influxDB.showDatabases(), IdekoDALInfluxdbServer.waitDuration)
//      println(databases.toList)
      val database = influxDB.selectDatabase(dbName)
      val dbExists = Await.result(database.exists(), IdekoDALInfluxdbServer.waitDuration) // => Future[Boolean]
      LOGGER.info(s"Does DB $dbName exist? $dbExists")

      val queryDBResolved = QueryInfluxDBImpl.DB_REGEX.replaceAllIn(query, dbName)
      LOGGER.info(s"Query with DB name resolved: ${queryDBResolved}")
      val queryPolicyResolved = QueryInfluxDBImpl.POLICY_REGEX.replaceAllIn(queryDBResolved, policy)
      LOGGER.info(s"Query with policy resolved: ${queryPolicyResolved}")
      val queryResult = Await.result(database.queryToJson(queryPolicyResolved), IdekoDALInfluxdbServer.waitDuration)
      LOGGER.info(s"Query result: ${queryResult}")
      queryResult
    }

    def close() = {
      influxDB.close()
    }

    private def chooseMachine(machineId: String): (Option[String], Option[String]) = {
      val dbNameMap = IdekoDALInfluxdbServer.influxdbDBNameMap
      val dbPair = dbNameMap get machineId
      dbPair match {
        case Some(dbPair) => return (Some(dbPair.get(0)), Some(dbPair.get(1)))
        case None => return (None, None)
      }
    }
  }

  private def getJwks(url: URL, checkCertificate: Boolean, keyStoreFileName: String): Map[String, List[Map[String, String]]] = { // Map[String, AnyRef]
    var inputStream: Option[InputStream] = None
    try {
      val c = url.openConnection.asInstanceOf[HttpsURLConnection]
      // activating or not the certificate checking
      if (checkCertificate) {
        // import keystore
        val keyStorePassword: String = "jksPassword" // the password you used whit the command keytool
        val ks = KeyStore.getInstance(KeyStore.getDefaultType)
        val keyStorePath = getClass.getClassLoader.getResource(keyStoreFileName)
        val inputStream = new FileInputStream(keyStorePath.getPath)
        ks.load(inputStream, keyStorePassword.toCharArray)
        IOUtils.closeQuietly(inputStream)
        // create trust manager from keystore
        val tmf = TrustManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm)
        tmf.init(ks)
        val trustManager = tmf.getTrustManagers
        // associate trust manager with the httpClient
        val sslContext = SSLContext.getInstance("TLS")
        sslContext.init(Array(), trustManager, null)
        c.setSSLSocketFactory(sslContext.getSocketFactory)

      } else {
        IdekoDALInfluxdbServer.LOGGER.warning("Warning ! Https connections will be done without checking certificate. Do not use in production.")
        val sslContext: SSLContext = {
          val permissiveTrustManager: TrustManager = new X509TrustManager() {
            override def checkClientTrusted(x509Certificates: Array[cert.X509Certificate], s: String): Unit = {}

            override def checkServerTrusted(x509Certificates: Array[cert.X509Certificate], s: String): Unit = {}

            override def getAcceptedIssuers: Array[cert.X509Certificate] = Array.empty
          }
          val ctx = SSLContext.getInstance("TLS")
          ctx.init(Array.empty, Array(permissiveTrustManager), new SecureRandom())
          ctx
        }
        val hostnameVerifier = NoopHostnameVerifier.INSTANCE
        c.setSSLSocketFactory(sslContext.getSocketFactory)
        c.setHostnameVerifier(hostnameVerifier)
      }

      c.setConnectTimeout(IdekoDALInfluxdbServer.serverConfigFile.jwtServerTimeout)
      c.setReadTimeout(IdekoDALInfluxdbServer.serverConfigFile.jwtServerTimeout)
      inputStream = Option(c.getInputStream)

      val content = scala.io.Source.fromInputStream(inputStream.get).getLines.mkString

      val mapper = new ObjectMapper()
      mapper.registerModule(DefaultScalaModule)
      val valuesMap = mapper.readValue(content, classOf[Map[String, List[Map[String, String]]]])

      return valuesMap
    } catch {
      case e: IOException =>
        throw new SigningKeyNotFoundException("Cannot obtain jwks from url " + url.toString, e)
    } finally {
        if (inputStream.isDefined) {
          inputStream.get.close()
        }
    }
  }

  private def getPEMFromRSA(modulusStr: String, exponentStr: String): PublicKey = {
    val modulus = BigInt(1, Base64.decodeBase64(modulusStr))
    val exponent = BigInt(1, Base64.decodeBase64(exponentStr))

    val publicKeySpec = new RSAPublicKeySpec(modulus.bigInteger, exponent.bigInteger)
    val publicKey = java.security.KeyFactory.getInstance("RSA").generatePublic(publicKeySpec)
    publicKey
  }
}





