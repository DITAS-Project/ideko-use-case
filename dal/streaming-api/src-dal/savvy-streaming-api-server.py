# -*- coding: utf-8 -*-
from concurrent import futures
import time
import logging
import json
import requests

import grpc
import jwt
import json

from helpers.config import Config

import savvy_streaming_api_pb2
import savvy_streaming_api_pb2_grpc

class SavvyStreamingAPI(savvy_streaming_api_pb2_grpc.SavvyStreamingAPIServicer):

    '''
    def JWT_is_valid(self, request, context, accepted_roles):

        # Get the metadata
        metadata = dict(context.invocation_metadata())

        # The JWT token comes from {"authorization": "Bearer xxxx.yyyyy.zzzz"}, so we only get the last part ("xxxx.yyyyy.zzzz")
        jwt_token = metadata["authorization"].split(" ")[1]

        # Check if it has three parts separated by dots
        if len(jwt_token.split(".")) != 3: return False

        # Get the key_id from the header of the JWT
        key_id = jwt.get_unverified_header(jwt_token)["kid"]

        # Get the algorithm from the header of the JWT
        algorithm = jwt.get_unverified_header(jwt_token)["alg"]

        # TODO - How do we get this one?
        # Generate the URL to get the public key
        available_keys_url = "https://153.92.30.56:58080/auth/realms/288/protocol/openid-connect/certs"
        # available_keys_url = request.params['??']

        # Get the keys from the keycloak server
        r = requests.get(available_keys_url, verify=False)
        available_keys_from_keycloak = json.loads(r.text)

        # For each key of the keycloak server
        for key_of_keycloak in available_keys_from_keycloak["keys"]:
            # Check if it matches the kid got from the JWT header
            if key_of_keycloak["kid"] == key_id:
                # Found key!
                secret = key_of_keycloak["n"]
                try:
                    # Decode de JWT with the provided secret
                    decoded_jwt_payload = jwt.decode(jwt_token, secret, algorithms=[algorithm])
                    # Check if the user role (taken from the content) is an accepted role (is this neccesary?)
                    if decoded_jwt_payload["real_access"]["role_name"] in accepted_roles:
                        # For this method, he has access
                        return True
                    # That role has no access to this method
                    else:
                        return False
                except jwt.exceptions.DecodeError:
                    return False

                # Decoded, everything's ok
                return True

        # Key not found on the keycloak server
        return False
    '''

    def StreamMachine(self, request, context):
        '''
        # Acepted roles for this user
        accepted_roles = ["administrator", "operator"]
        # Check if the JWT token is valid before doing anything
        if self.JWT_is_valid(request, context, accepted_roles):
        '''
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
                print('Sending response line')
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
