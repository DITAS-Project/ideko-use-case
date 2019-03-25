# -*- coding: utf-8 -*-
from SavvySDK import SavvySDKRestStreaming
from concurrent import futures
import time
import logging
import json

import grpc

import savvy_streaming_api_pb2
import savvy_streaming_api_pb2_grpc

_ONE_DAY_IN_SECONDS = 60 * 60 * 24


class SavvyStreamingAPI(savvy_streaming_api_pb2_grpc.SavvyStreamingAPIServicer):

    def StreamMachine(self, request, context):
        # Elemplo que se que funciona
        clientlocal = SavvySDKRestStreaming("172.16.32.215")
        
        # TODO gestionar errores, grpc tiene una forma propia
        #yield savvy_streaming_api_pb2.StreamResponse(responseLine="si")
        
        clientlocal.stream('CNK_X1Z8SG', self.streamCallback)

        while True:
            time.sleep(_ONE_DAY_IN_SECONDS)

        #indicatorsObj = clientlocal.indicators()
        #indicatorsString = json.dumps(indicatorsObj)
        
        #print ("Respondiendo: " + indicatorsString)
        
        #for x in range(300):
            #res = "Respuesta" + ':' + str(x)
            #print(res)
            #yield savvy_streaming_api_pb2.StreamResponse(responseLine=res)

        #return savvy_streaming_api_pb2.StreamResponse(responseLine=indicatorsString)

    def streamCallback(responseJSONObj):
            print (responseJSONObj)
            lineString = json.dumps(responseJSONObj)
            yield savvy_streaming_api_pb2.StreamResponse(responseLine=lineString)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    savvy_streaming_api_pb2_grpc.add_SavvyStreamingAPIServicer_to_server(SavvyStreamingAPI(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    try:
        # Supongo que esto es un truco para que el server este corriendo maximo un dia
        while True:
            time.sleep(_ONE_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == '__main__':
    #logging.basicConfig()
    serve()

