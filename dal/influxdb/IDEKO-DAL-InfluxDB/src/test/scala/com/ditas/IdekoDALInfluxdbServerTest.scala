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

    val authorization = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJhdXl0YzJUX2MtN1k5SFEtVEI1UUJNc2tQdlhDWXpYU2ZKNnJPaUJLdi1FIn0.eyJqdGkiOiI5NDI2NzEwMy05MWE5LTQ2Y2UtOTk4ZC1mNmYwNWQwYjk3YzEiLCJleHAiOjE1NTYxNzc0NDgsIm5iZiI6MCwiaWF0IjoxNTU2MTc3MTQ4LCJpc3MiOiJodHRwczovLzE1My45Mi4zMC41Njo1ODA4MC9hdXRoL3JlYWxtcy8yODgiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiZjYxYTgwNDEtYWVhNy00YTlhLTg5ODUtYzllMmJhODhlNmU3IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoidmRjX2NsaWVudCIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6ImEzNTg5MjU3LTYzYzQtNDc0Yy05NjM4LWI1MmEzZmQzNTlmYSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVtby1yb2xlIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoiZGVtb3VzZXIifQ.T9MkkwzRFObM5vEj6W4vFeg7nHuZ3wgauCYor3Eu6eLRx1qf-qHA8mnN5mv2FoAuA5qIbwau6G-tlCi47k-1KjsoLQpmiDuMNLCPTvE6uAkC9q7U5WxKBhSdEn4GEiFx5uTo7ttp-L2zj83M4QN0p6pdnRcob7UcYbjmyom-tT9NChdRMV3IM8zjPxGYCex3u1nUSb-uNPjyZ3jFsKIxliEaqs30KvzC_rYIFWnNCGcD8LEvHYiaaWICfgwjBQUrxi40pWYzx4q0ethVaEmAFpAP6lqg7qVVNkzeCDyUwYy0dnZvyKk4_2wC7CO5Tmx7W1HjWhDW5vLhVkSl3ZHgIA"
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