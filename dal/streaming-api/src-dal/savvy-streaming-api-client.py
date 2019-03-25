from __future__ import print_function
import logging

import grpc

import savvy_streaming_api_pb2
import savvy_streaming_api_pb2_grpc


def run():
    
    with grpc.insecure_channel('localhost:40001') as channel:
        stub = savvy_streaming_api_pb2_grpc.SavvyStreamingAPIStub(channel)
        response = stub.StreamMachine(savvy_streaming_api_pb2.StreamParameters(machineId='CMX_LQLS26'))
        
        for line in response:
            print (line.responseLine)
        #print("La API de Savvy ha respondido: " + response.responseLine)


if __name__ == '__main__':
    #logging.basicConfig()
    
    try:
        run()
    except KeyboardInterrupt:
        print('BYE')

