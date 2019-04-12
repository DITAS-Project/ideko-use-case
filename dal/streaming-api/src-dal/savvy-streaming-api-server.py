# -*- coding: utf-8 -*-
from concurrent import futures
import time
import logging
import json
import requests
import sys

import grpc
import jwt
import json

from helpers.config import Config

import savvy_streaming_api_pb2
import savvy_streaming_api_pb2_grpc

# Whether the test mode is on (don't check for authorization)
testing = False

class SavvyStreamingAPI(savvy_streaming_api_pb2_grpc.SavvyStreamingAPIServicer):

    def JWT_is_valid(self, request, context, accepted_roles):
        """ Check if the JWT token (which is taken from the "auhorization" header) token is valid for an accepted role
            This is a implementation of the "Token validation" section of the ""[DITAS] VDC Access Control" document

            Returns:
                bool(True): If the token is valid
                bool(False): If the token is not valid
        """
        
        # Don't check for auth in testing mode
        if testing:
            print("DAL is in testing mode, omitting auth check")
            return True;

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

        # TODO - How do we get this one? How do we get the Blueprint ID (288)?
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
                    # Check if any user role (taken from the payload) is an accepted role
                    for accepted_role in decoded_jwt_payload["realm_access"]["roles"]:
                        if accepted_role in accepted_roles:
                            # He has access for this method!
                            return True
                except jwt.exceptions.DecodeError:
                    return False
        # Key not found on the keycloak server, or the token role is not an accepted one
        return False


    def StreamMachine(self, request, context):
        '''
        # TODO: Remove this coments and align properly after the "if"

        # Acepted roles for this function - This roles should match the ones created on Keycloak
        accepted_roles = ["ideko-operator", "spart-operator"]

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
    
    # Check for a --testing arg
    if '--testing' in sys.argv:
        print ('DAL started in test mode');
        testing = True
    else:
        print ('Dal is no in test mode, auth checks will be performed')
        
    serve()
