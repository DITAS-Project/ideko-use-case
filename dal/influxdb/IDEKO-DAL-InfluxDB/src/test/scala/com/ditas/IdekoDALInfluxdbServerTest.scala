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

    val authorization = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJhdXl0YzJUX2MtN1k5SFEtVEI1UUJNc2tQdlhDWXpYU2ZKNnJPaUJLdi1FIn0.eyJqdGkiOiI4MTZmN2IwNS1kNjhlLTRiNDktYjE1MC1mODBhMmYxNmY1NmYiLCJleHAiOjE1NTY3NjU4NjQsIm5iZiI6MCwiaWF0IjoxNTU2NzI5ODY0LCJpc3MiOiJodHRwczovLzE1My45Mi4zMC41Njo1ODA4MC9hdXRoL3JlYWxtcy8yODgiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiZjYxYTgwNDEtYWVhNy00YTlhLTg5ODUtYzllMmJhODhlNmU3IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoidmRjX2NsaWVudCIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6ImIyYzBhODU2LTUwZmItNDJkMC1hMjcyLWEyYTQzNzVmODlmNyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVtby1yb2xlIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoiZGVtb3VzZXIifQ.kdw_LAsZMDJBOCqbDLNZQX-qYMi494DNCsUZccQRKG8f6cLI6rSfNbWMEv8T27jpB4IrZj1nfrz96aXkRtN7KvH2KGxHvhJb83xcpDvG0r-6nSaOCqW-y5zhbXBPvlEx-C5KgiX_TgIYDUEjtRtSYcPQ7QUIkwQpFJg5mU7hVeGxajNbDJXPNb0Pj4_nyfzNwNwVYy55sAet59bS4D0J4j02aIlTtNkVJrP1XDDRENZ6OT7tsibH5nouz69suAhCcYmKF8Vns0MfG6xcwLkZoyGtjaV3QtOz6K1IWjNEcl9vNK6XNmqr7xJMiKq7B1KjWUPdz61zsdJXFsx4gFmd0Q"
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