/**
 * Copyright 2019 IBM
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 * 
 * This is being developed for the DITAS Project: https://www.ditas-project.eu/
 */
package com.ditas


import java.util.logging.Logger

import com.ditas.configuration.{PrivacyConfiguration, ServerConfiguration}
import com.ditas.ideko.QueryInfluxDBRequest.{QueryInfluxDBGrpc, QueryInfluxDBReply, QueryInfluxDBRequest}
import com.ditas.utils.{JwtValidator, YamlConfiguration}
import com.paulgoldbaum.influxdbclient.InfluxDB
import io.grpc._

import scala.collection.JavaConverters._
import scala.collection.mutable.ArrayBuffer
import scala.collection.{JavaConverters, mutable}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContext, Future}


object IdekoDALInfluxdbServer {
  private val LOGGER = Logger.getLogger(getClass.getName)

  def initializeDBNameMap(configDbNameMap: mutable.Map[String, java.util.ArrayList[Any]]): mutable.Map[String, Machine] = {
    configDbNameMap.map({
      case (machineId, machineConfig) =>
        machineId -> Machine(machineConfig.get(0).asInstanceOf[String]/*dbName*/,
          machineConfig.get(1).asInstanceOf[String]/*dbPolicy*/,
          machineConfig.get(2).asInstanceOf[String]/*influxdbServer*/,
          machineConfig.get(3).asInstanceOf[Integer]/*influxdbPort*/,
          machineConfig.get(4).asInstanceOf[String]/*influxdbUsername*/,
          machineConfig.get(5).asInstanceOf[String]/*influxdbPassword*/
        )})
  }

  def main(args: Array[String]): Unit = {
    if (args.length < 1) {
      System.err.println("Usage: IdekoInfluxdbServer <serverConfigFile> [privacyConfigFile]")
      System.exit(1)
    }
    val configFile = YamlConfiguration.loadConfiguration[ServerConfiguration](args(0))
    if (args.length > 1) {
      validRoles = JavaConverters.asScalaBuffer(YamlConfiguration.loadConfiguration[PrivacyConfiguration](args(1)).validRoles)
    }
    debugMode = configFile.debugMode

    serverConfigFile = configFile
    port = configFile.port
    influxdbDBNameConfigMap = initializeDBNameMap(configFile.influxdbDBNameMap.asScala)
    influxDBConnection = new InfluxDBConnection(influxdbDBNameConfigMap)
    waitDuration = configFile.waitDuration.seconds

    val server = new IdekoDALInfluxdbServer(ExecutionContext.global)
    server.start()
    server.blockUntilShutdown()
  }


  class InfluxDBConnection(influxdbDBNameConfigMap: mutable.Map[String, Machine]) {
    var connectionMap: mutable.Map[String, InfluxDB] =
      influxdbDBNameConfigMap.map({
        case (machineId, machineConfig) =>
          machineId -> InfluxDB.connect(machineConfig.influxdbServer, machineConfig.influxdbPort, machineConfig.influxdbUsername,
            machineConfig.influxdbPassword, false, null)
      })

    def getInstance(machineId: String): Option[InfluxDB] = {
      connectionMap.get(machineId)
    }

    def closeAll() = {
      for ((machineId, influxDB) <- connectionMap) influxDB.close()
    }
  }
  private var port = 50052 //default port
  private var debugMode = false
  private var influxdbDBNameConfigMap: mutable.Map[String, Machine] = _
  private var influxDBConnection: InfluxDBConnection = _
  private var waitDuration = 2.seconds // seconds
  private var serverConfigFile: ServerConfiguration = null

  private var validRoles: mutable.Buffer[String] = ArrayBuffer("*")
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
  }


  private class QueryInfluxDBImpl extends QueryInfluxDBGrpc.QueryInfluxDB {
    private val LOGGER = Logger.getLogger(getClass.getName)
    private val jwtValidation = new JwtValidator(IdekoDALInfluxdbServer.serverConfigFile)

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
          jwtValidation.validateJwtToken(authorizationHeader, IdekoDALInfluxdbServer.serverConfigFile.jwtServerTimeout, IdekoDALInfluxdbServer.validRoles)
        } catch {
          case e: Exception => {
            LOGGER.throwing(getClass.getName, "query", e);
            return Future.failed(Status.ABORTED.augmentDescription(e.getMessage).asRuntimeException())
          }
        }

        val dbMachine = chooseMachine(machineId)
        dbMachine match {
          case Some(dbMachine) => {
            val resultRecords = queryInfluxDB(queryObject, machineId, dbMachine)
            val reply = new QueryInfluxDBReply(Seq(resultRecords))
            return Future.successful(reply)
          }
          case None => {
            return Future.failed(Status.ABORTED.augmentDescription("Machine id didn't match any dbName and policy").asRuntimeException())
          }
        }
      }
    }



    private def queryInfluxDB(query: String, machineId: String, dbMachine: Machine): String = {
      val dbName = dbMachine.dbName
      LOGGER.info(s"Query: {${query}}\nmachineId=${machineId}, dbName=${dbName}")
//      val databases = Await.result(influxDB.showDatabases(), IdekoDALInfluxdbServer.waitDuration)
//      println(databases.toList)
      val influxDB = IdekoDALInfluxdbServer.influxDBConnection.getInstance(machineId)
      influxDB match {
        case None => LOGGER.warning("Trying to query non-existent machine: " + machineId); throw new Exception("No connection for machineId: " + machineId)
        case Some(influxDBConn) =>
          val database = influxDBConn.selectDatabase(dbName)
          val dbExists = Await.result(database.exists(), IdekoDALInfluxdbServer.waitDuration) // => Future[Boolean]
          LOGGER.info(s"Does DB $dbName exist? $dbExists")

          val queryDBResolved = QueryInfluxDBImpl.DB_REGEX.replaceAllIn(query, dbName)
          LOGGER.info(s"Query with DB name resolved: ${queryDBResolved}")
          val queryPolicyResolved = QueryInfluxDBImpl.POLICY_REGEX.replaceAllIn(queryDBResolved, dbMachine.dbPolicy)
          LOGGER.info(s"Query with policy resolved: ${queryPolicyResolved}")
          val queryResult = Await.result(database.queryToJson(queryPolicyResolved), IdekoDALInfluxdbServer.waitDuration)
          LOGGER.info(s"Query result: ${queryResult}")
          queryResult
      }
    }

    def close() = {
      IdekoDALInfluxdbServer.influxDBConnection.closeAll()
    }

    private def chooseMachine(machineId: String): (Option[Machine]) = {
      val dbNameMap = IdekoDALInfluxdbServer.influxdbDBNameConfigMap
      val dbMachine = dbNameMap get machineId
      dbMachine
    }
  }

}

case class Machine (dbName: String, dbPolicy: String, influxdbServer: String, influxdbPort: Integer, influxdbUsername: String, influxdbPassword: String)



