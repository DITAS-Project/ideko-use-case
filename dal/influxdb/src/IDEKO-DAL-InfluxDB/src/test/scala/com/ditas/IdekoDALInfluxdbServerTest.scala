import java.util.logging.Logger

import com.ditas.ideko.DalMessageProperties.DalMessageProperties
import com.ditas.ideko.QueryInfluxDBRequest.{QueryInfluxDBGrpc, QueryInfluxDBReply, QueryInfluxDBRequest}
import io.grpc._

import scala.io.Source

object IdekoDALInfluxdbServerTest {
  private val LOGGER = Logger.getLogger(getClass.getName)
  val accessToken = Source.fromFile("/home/mayaa/Development/GitHub/DITAS/ehealth-spark-vdc-with-dal/DITASconfigFiles/config_files_for_demo/kc_access_token.txt").getLines().mkString

  def main(args: Array[String]): Unit = {
    val host = "localhost"
    val port = 50052
    val purpose = "maintenance"
    val query = "SELECT time, machine, \"value\" FROM \"{{db}}\".\"{{policy}}\".\"I_CMX_LQLS26_AW8HY7\" ORDER BY time DESC LIMIT 5"
    val machineId = "CMX_LQLS26"


    val channel =
      ManagedChannelBuilder
        .forAddress(host, port)
        .usePlaintext(true)
        .build()

    val blockingStub = QueryInfluxDBGrpc.blockingStub(channel)
    val asyncStub = QueryInfluxDBGrpc.stub(channel)

    val authorization = "Bearer " + accessToken
    val dalMessageProperties: DalMessageProperties =
      new DalMessageProperties (purpose = purpose, authorization = authorization)

    val request: QueryInfluxDBRequest = new QueryInfluxDBRequest(query, machineId, Option(dalMessageProperties))

    try {
      val response: QueryInfluxDBReply = blockingStub.query(request)
      print(s"Response: $response")
    } catch {
      case e: Exception => print(e.getMessage)
    }

  }





}