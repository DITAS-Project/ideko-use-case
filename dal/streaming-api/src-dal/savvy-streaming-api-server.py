# -*- coding: utf-8 -*-
from concurrent import futures
import time
import logging
import json
import requests

import grpc

from helpers.config import Config

import savvy_streaming_api_pb2
import savvy_streaming_api_pb2_grpc

class SavvyStreamingAPI(savvy_streaming_api_pb2_grpc.SavvyStreamingAPIServicer):

    def StreamMachine(self, request, context):
        
        machineId = request.machineId

        # TODO gestionar errores, grpc tiene una forma propia
        machine_box_ip = Config.read('MACHINES', machineId)
        print('Requested machine: ' + machineId)
        print('Box IP from config: ' + machine_box_ip)
        
        port = '7888'
        url_stream = 'http://' + machine_box_ip + ':' + port + '/stream?machines=' + machineId
        
        print('URL to be called: ' + url_stream)

        result_requests = requests.get(url_stream, stream = True, timeout = 15)
        for line in result_requests.iter_lines():
                # Remember The first line of the stream is only the status
                #if raw_result.find("status") < 0:
                print 'Sending response line'
                yield savvy_streaming_api_pb2.StreamResponse(responseLine=line)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    savvy_streaming_api_pb2_grpc.add_SavvyStreamingAPIServicer_to_server(SavvyStreamingAPI(), server)
    server.add_insecure_port('[::]:40001')
    server.start()
    print('Server started on port 40001')
    try:
        # Supongo que esto es un truco para que el server este corriendo maximo un dia
        while True:
            time.sleep(3600)
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == '__main__':
    #logging.basicConfig()
    serve()

