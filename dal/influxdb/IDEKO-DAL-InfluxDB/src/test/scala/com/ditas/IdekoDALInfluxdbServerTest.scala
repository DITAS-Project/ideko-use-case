import java.util.logging.Logger

import com.ditas.ideko.DalMessageProperties.DalMessageProperties
import com.ditas.ideko.QueryInfluxDBRequest.{QueryInfluxDBGrpc, QueryInfluxDBReply, QueryInfluxDBRequest}
import io.grpc._

object IdekoDALInfluxdbServerTest {


  private val LOGGER = Logger.getLogger(getClass.getName)

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


    val dalMessageProperties: DalMessageProperties =
      new DalMessageProperties (purpose)

    val request: QueryInfluxDBRequest = new QueryInfluxDBRequest(query, machineId, Option(dalMessageProperties))

    val response: QueryInfluxDBReply = blockingStub.query(request)
    print(s"Response: $response")

  }





}