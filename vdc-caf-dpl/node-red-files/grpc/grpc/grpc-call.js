module.exports = function (RED) {
    "use strict";
    let grpc = require("grpc");

    function gRpcCallNode(config) {
        try {
            var node = this;
            RED.nodes.createNode(node, config);

            // Get the gRPC server from the server config Node
            var serverNode = RED.nodes.getNode(config.server)
            node.on("input", function (msg) {
                // overring config with msg content
                config.service = config.service || msg.service;
                config.method = config.method || msg.method;
                
                try {
                    const REMOTE_SERVER = serverNode.server + ":" + serverNode.port;
console.log(REMOTE_SERVER);
                    //Create gRPC client
                    var proto =  serverNode.proto;
                    if (serverNode.protoPackage) {
                        proto = serverNode.proto[serverNode.protoPackage];
                    }
                    if (!proto[config.service]) {
                        node.status({fill:"red",shape:"dot",text: "Service " + config.service + " not in proto file"});
                    } else if (!proto[config.service].service[config.method]) {
                        node.status({fill:"red",shape:"dot",text: "Method --" + config.method + "-- not in proto file for service " +  config.service });
                    } else {
                        node.status({});
                        node.client = new proto[config.service](
                            REMOTE_SERVER,
                            grpc.credentials.createInsecure()
                        );
                    }

                    if (node.client) {
                        if (!node.client[config.method]) {
                            node.status({fill:"red",shape:"dot",text: "Method >>" + config.method + "<< not in proto file"});
                        } else {
console.log('Hay cliente y hay metodo');
                            node.status({});
                            if (proto[config.service].service[config.method].responseStream) {
console.log('Entramos en responsStream');
// Aitor si hay canal ya sucesivos intentos fallan
node.channel = null;
				node
                                if (!node.channel) {
console.log('No hay canal');
                                    node.channel = node.client[config.method](msg.payload);
                                    node.channel.on("data", function (data) {
                                        msg.payload = data;
                                        node.send(msg);
                                    });
    
                                    node.channel.on("error",function (error) {
console.log('Error en el canal: ' + error);
					node.status({fill:"red",shape:"dot",text: "Error de canal: " + error});
                                        msg.error = error;
                                        node.send(msg);
                                    });
                                }
				else {
					console.log('Ya hay canal de antes y no esta implementado mas');
				}
                            } else {
console.log("Llamando al metodo...");
                                node.client[config.method](msg.payload, function(error, data) {
				    node.status({fill:"red",shape:"dot",text: "Err al llamar al metodo: " + error});
                                    msg.payload = data;
                                    msg.error = error;
                                    node.send(msg);
                                })
                            }
                        }
                    }

                } catch (err) {
                    node.log("onInput" + err);
                    console.log(err);
                }

            });

            node.on("error", function (error) {
                node.error("gRpcCallNode Error - " + error);
                console.log(error);
            });

            node.on("close", function (done) {
                if (node.client) {
                    grpc.closeClient(node.client)
                    delete node.client;
                    delete node.channel
                }
                done();
            });
        } catch (err) {
            node.error("gRpcCallNode" + err);
            console.log(err);
        }
    }

    RED.nodes.registerType("grpc-call", gRpcCallNode);
};