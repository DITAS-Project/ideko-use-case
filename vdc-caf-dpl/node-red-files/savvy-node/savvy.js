module.exports = function (RED) {
    "use strict";

    // Include de la utilidades para auth de las APIs de Savvy
    var SavvyAPIUtils = require("./api-utils");
    var ResponseManager = require("./response-mng");

	// Used for the Cloud API
    var https = require('https');

	// Used for the Local (RestStreaming)
	var http = require('http');

    // NOTE Las variables definidas aqúí son compartidas por diferentes instancias de nodos por lo que hay que tener mucho cuidado

    // Función registrada, se ejecuta al crear una instancia del nodo (al cargarlo en el ifaz web o al lanzar el flujo)
    // @param object - nodeCOnfig: objeto con la configuración del nodo (html)
    function savvyNode (nodeConfig) {
        // Create a RED node
        RED.nodes.createNode(this, nodeConfig);

        // Contiene la chunks de respuestas de la API que deben ser devueltos
		this.joinedChunks = undefined;

    	// Almacena la request que se está ejecutando en un momento dado. Al ser una variable global a nivel de nodo, se puede parar en cualquier momento desde cualquier punto
		this.request = null;

        // Almacena el ResponseManager específico para la request en curso
        this.responseManagerObj = null;

        // Store local copies of the node configuration (as defined in the .html)
		this.topic = nodeConfig.topic;
        this.endpoint = nodeConfig.endpoint;
        this.returntype = nodeConfig.returntype;
        this.apitype = nodeConfig.apitype;
        this.key = nodeConfig.key;
        this.secret = nodeConfig.secret;
        this.locationId = nodeConfig.locationId;
        this.machineId = nodeConfig.machineId;
        this.groupId = nodeConfig.groupId;
		this.indicatorId = nodeConfig.indicatorId;
		this.fromTs = nodeConfig.fromTs;
		this.toTs = nodeConfig.toTs;
		this.methodCloudv1 = nodeConfig.methodCloudv1;
		this.methodCloudv2 = nodeConfig.methodCloudv2;
		this.methodLocal = nodeConfig.methodLocal;
		this.productionLineId = nodeConfig.productionLineId;
		this.active = nodeConfig.active;
		this.isKey = nodeConfig.isKey;
		this.categoryId = nodeConfig.categoryId;
		this.severityId = nodeConfig.severityId;
		this.alarmId = nodeConfig.alarmId;
		this.human = nodeConfig.human;
		this.delimeter = nodeConfig.delimeter;
		this.aggregation = nodeConfig.aggregation;
		this.grain = nodeConfig.grain;
		this.defined = nodeConfig.defined;
		this.durationFrom = nodeConfig.durationFrom;
		this.durationTo = nodeConfig.durationTo;
		this.fileName = nodeConfig.fileName;

		// Inicialización de contexto
        this.context().set('requestOngoing', false); // Indica si hay una request en marcha
        this.context().set('streamIsRunning', false); // Indica si hay un stream corriendo o no
        this.context().set('reconnectWaitTime', 5); // 5 sec - Fijar un tiempo por defecto para reconexión
        this.context().set('expectedEnd', false); // Indicar que si se para un stream, en ppio es de forma inesperada
        this.context().set('reconnectTimes', 0); // Número de intentos de reconexión
        this.context().set('waitingToReconnect', false); // Indica si hay una espera en marcha para ejecutar un intento de conexión
        this.context().set('serverGoneTimeout', 45); // Cantidad de segundos que pueden pasar sin recibir una respuesta del servidor para asumir que el servidor se ha ido e intentar reconectar.
        this.context().set('serverGoneTimer', undefined); // Timer que monitoriza que el servidor está respondiendo tramas de control en peticiones stream
        this.context().set('waitingToReconnectTimer', undefined); // Timer que espera "reconnectWaitTime" segundos para ejecutar una reconexiónservergonetime


        // copy "this" object in case we need it in context of callbacks of other functions.
        var node = this;
        node.status({fill:"grey",shape:"dot",text:"Stopped"});

        // Instanciar un único manejador de respuestas stream
        node.responseManagerObj = new ResponseManager(node);

        // respond to inputs....
        this.on('input', function (inputMsg) {
			this.status({fill:"grey",shape:"ring",text:"Input received"});
			node.log("Input received, node running");

			// Check if a STOP message was send. A stop message must stop any live request
			if (inputMsg.stopRequest !== undefined && inputMsg.stopRequest)
			{
				node.log("Stop request received");
				// Stop any live request
				if (node.request != null && this.context().get('streamIsRunning') == true)
				{
                    this.context().set('expectedEnd', true); // Indicar que estamos parando el stream de forma controlada
    			    this.status({fill:"grey",shape:"ring",text:"Stopping..."});
					node.request.abort();
					node.request.end();
					node.log("Request stopped");
        			this.status({fill:"grey",shape:"dot",text:"Stopped"});
				}
				else {
					node.warn("There is not stream request to stop");
                    //this.status({fill:"gray",shape:"dot",text:"Stopped"});
				}
				return;
			}

            // No permitir request concurrentes
            if (node.context().get("requestOngoing") === true) {
                node.error("There is a request running. This node doesn't allow to run concurrent requests.", {});
                return;
            }

			// Override the node properties with those set in the message
			if (inputMsg.topic !== undefined) node.topic = inputMsg.topic;
			if (inputMsg.endpoint !== undefined) node.endpoint = inputMsg.endpoint;
			if (inputMsg.returntype !== undefined) node.returntype = inputMsg.returntype;
			if (inputMsg.apitype !== undefined) node.apitype = inputMsg.apitype;
			if (inputMsg.key !== undefined) node.key = inputMsg.key;
			if (inputMsg.secret !== undefined) node.secret = inputMsg.secret;
			if (inputMsg.locationId !== undefined) node.locationId = inputMsg.locationId;
			if (inputMsg.machineId !== undefined) node.machineId = inputMsg.machineId;
			if (inputMsg.groupId !== undefined) node.groupId = inputMsg.groupId;
			if (inputMsg.indicatorId !== undefined) node.indicatorId = inputMsg.indicatorId;
			if (inputMsg.fromTs !== undefined) node.fromTs = inputMsg.fromTs;
			if (inputMsg.toTs !== undefined) node.toTs = inputMsg.toTs;
			if (inputMsg.methodCloudv1 !== undefined) node.methodCloudv1 = inputMsg.methodCloudv1;
			if (inputMsg.methodCloudv2 !== undefined) node.methodCloudv2 = inputMsg.methodCloudv2;
			if (inputMsg.methodLocal !== undefined) node.methodLocal = inputMsg.methodLocal;
			if (inputMsg.productionLineId !== undefined) node.productionLineId = inputMsg.productionLineId;
			if (inputMsg.active !== undefined) node.active = inputMsg.active;
			if (inputMsg.isKey !== undefined) node.isKey = inputMsg.isKey;
			if (inputMsg.categoryId !== undefined) node.categoryId = inputMsg.categoryId;
			if (inputMsg.severityId !== undefined) node.severityId = inputMsg.severityId;
			if (inputMsg.alarmId !== undefined) node.alarmId = inputMsg.alarmId;
			if (inputMsg.human !== undefined) node.human = inputMsg.human;
			if (inputMsg.delimeter !== undefined) node.delimeter = inputMsg.delimeter;
			if (inputMsg.aggregation !== undefined) node.aggregation = inputMsg.aggregation;
			if (inputMsg.grain !== undefined) node.grain = inputMsg.grain;
			if (inputMsg.defined !== undefined) node.defined = inputMsg.defined;
			if (inputMsg.durationFrom !== undefined) node.durationFrom = inputMsg.durationFrom;
			if (inputMsg.durationTo !== undefined) node.durationTo = inputMsg.durationTo;
			if (inputMsg.fileName !== undefined) node.fileName = inputMsg.fileName;

            var endpointPath = SavvyAPIUtils.computeEndpointPath(node);

            // Almacenar el endpointPath en el contexto, para la gestión de reconvexiones
            node.context().set('endpointPath', endpointPath);

            // Callback del sendRequest. Cada onData se entra aquí. Se define así para poder ser añadida al contexto del nodo y llamada en las reconexiones
            var requestCallback = function (resString)
			{
                node.status({fill:"blue",shape:"dot",text:"Data received"});
				node.log("Callback sendRequest");

				switch(node.returntype)
				{
					case "utf-8":
						//node.log("Setting the payload as utf-8 string");
						inputMsg.payload = resString;
						break;
					case "json":
						//node.log("Setting the payload as JSON object");
						// NOTE posible error SyntaxError: Unexpected end of JSON input en JSON mal formado
						try {
						    inputMsg.payload = JSON.parse(resString);
                        } catch(err) {
							// Sabemos que cuando se para el stream puede dar este error
//node.error(resString);
						    node.error(err.stack);
						}
						break;
				}

				node.send(inputMsg);
				node.log("Done: data callback finished");
			};
            node.context().set('requestCallback', requestCallback);

            // Lanzar la petición
			node.log("Calling sendRequest");
			sendRequest(endpointPath, node, requestCallback);

		});

        // Capturar el cierre del nodo (node eliminado o evento -re-deploy) - Con esto paramos el stream si estuviera corriendo
        // Ver https://nodered.org/docs/creating-nodes/node-js (Closing the node)
        // Necesito done() porque e. request.end es asíncrono
        this.on("close", function (done) {
			this.log("Node: onClose fired");
            var node = this;

            // Peta si llamamo a cleanSergerGoneTimer por temas de asincronía supongo, así que lo hacemos explícitamente.
            clearTimeout(this.context().get('serverGoneTimer'));
            // Si hubiera una reconexión en espera, se para tb su timer
            clearTimeout(this.context().get('waitingToReconnectTimer'));

            if (node.context().get('streamIsRunning') == true)
            {
                node.context().set('expectedEnd', true); // Indicar que estamos parando el stream de forma controlada
                node.status({fill:"grey",shape:"ring",text:"Stopping..."});
                node.request.abort(); // request is a global variable
                node.request.end();
                // Pese a que está documentado no me funciona!! Así que opto por el timeout
                /*node.request.end(undefined, undefined, function () {
                    //this.status({fill:"grey",shape:"dot",text:"Stopped"});
                    done();
                }); // https://nodejs.org/api/http.html#http_request_end_data_encoding_callback
                */
                // Mientras no funcione el callback. Realmente puedo meter 1 o 2 segundos, porque el .end es muuuy rápido. Pero por si.
                setTimeout(function () {
                    // Como el request.abort lanza el onError si la request no estaba establecida (estado "Sending request..."), y el onError lanza timers de reconexión, necesitamos limpiar los timers aquí
                    clearTimeout(node.context().get('waitingToReconnectTimer'));
                    clearTimeout(node.context().get('serverGoneTimer'));
                    done();
                }, 2000);
            }
            else {
                this.status({fill:"blue",shape:"ring",text:"Stopped"});
                done();
            }
        });
    }

    /**
     * Ejecuta una request y llama al callback pasado con la respuesta
     */
    function sendRequest(path, node, callback)
    {
        node.context().set('expectedEnd', false); // Nueva petición, reinicializar esto. Si la petición se para no es de forma controlada.

        var libToUse = undefined; // Contendrá la librería (http / https) a usar en la llamada

        // Indicar que hay un stream corriendo si la petición es de ese tiempo
        node.context().set('requestOngoing', true);
		if (isStreamRequest(node)) node.context().set('streamIsRunning', true);

		var epoch = new Date().getTime();

		// Generar la autenticación para el header
        var auth = SavvyAPIUtils.generateAuthorization(path, epoch, node.key, node.secret);

		switch(node.apitype)
		{
			case "cloudv1":
			case "cloudv2":
				var options = {
					host: node.endpoint,
					path: path,
					method: "GET",
                    timeout: 15000,
					"headers": {
						"Content-Type": "text/plain; charset=UTF-8",
						"X-M2C-Sequence": epoch,
						"Authorization": auth
					}
				};

				// Uses HTTPS
                libToUse = https;
				break;

			case "local":
				var options = {
					host: node.endpoint,
					port: 7888,
					path: path,
					method: "GET",
                    timeout: 15000,
					"headers": {
						"Content-Type": "text/plain; charset=UTF-8"
					}
				};

				// Uses HTTP
                libToUse = http;
				break;
		}
        node.log("Request options generated");
        node.log("\tHost: " + node.endpoint);
        node.log("\tPath: " + path);
        node.log("Requesting...");
        node.status({fill:"grey",shape:"ring",text:"Sending request..."});

        // Ejecutar la request y almacenarla en el nodo para poder abortarla desde fuera
        node.request = libToUse.request(options, function (response)
        {

            //console.log(response.headers);
            // NOTE Si añaidmos esto dejamos de recibir un Buffer y recibimos un string codificado. Dejaríamos de necesitar el ''+chunk. No lo pongo porque no sé cómo puede afectar a todas las peticiones.
            // Sí he comprobado que #7 (en-windows-ondata-se-lanza-varais-veces) no se corrige con esto.
            // https://nodejs.org/api/stream.html#stream_readable_setencoding_encoding
            //response.setEncoding('utf8');
            response.on('data', function (chunk)
            {
//console.log("LENGTH: " + chunk.byteLength);
//console.log(chunk );
//console.log('=============================');
//return;
                handleResponseOnData (this, node, chunk, callback);
            });

            // We get to here if the request ends or the request is stopped
            // NOTA si la request se para, siempre se response una última vez. No pasa nada pero es raro.
            // NOTA si se desactiva la interoperabilidad también se entra aquí porque la paran de forma gracefully.
            response.on('end', function () {
                handleResponseOnEnd (node, callback);
            });

            response.on('error', function (e) {
                handleResponseOnError(e, node);
            });
        });

        // Este evento solo se emite una vez, ver https://nodejs.org/api/http.html#http_event_response y se lanza antes que el onData
        // NOTA: desde aquí no hay acceso al cuerpo de la respuesta, por lo que no podemos imprmir el error :-(
        /*request.on('response', function (res) {
            var statusCode = res.statusCode;
        });*/

        /**
         * Evento que captura errores en la petición y gestiona reintentos si se trata de peticiones stream.
         * Solo stream puesto que si un stream falla y se reintenta, los errores de los reintentos caen aquí mismo.
         */
        node.request.on('error', function (err)
        {
            node.context().set('streamIsRunning', false);
            node.context().set('requestOngoing', false);
            node.log("Request on error fired");

            // No estoy 100% seguro de que una request ya establecida no pueda soltar un error. Si lo hace, entramos aquí y hay que limpiar timers
            clearTimeout(node.context().get('serverGoneTimer'));

            // Si la petición es de tipo stream y ha fallado la request, reintentar.
            // ¿Cómo podemos llegar aquí?
            //  1.- Si el server cierra la conexión y el primer reintento desde response.on('end') falla
            //  2.- Si el primer intento en general falla, porque hemos puesto mal el endpoint, por ejemplo
			if (isStreamRequest(node))
            {
                node.status({fill:"red", shape:"ring", text: err.toString()});

                // Recoger del contexto los parámetros a pasar al sendRequest
                var endpointPath = node.context().get('endpointPath');
                var callback = node.context().get('requestCallback');
                // Gestionar reconexiones en request no establecidas es bastante tricky. Hay muchas casuísticas que controlar: clic en el botón, en modo espera, en mode sendRequest(), el deploy, etc. NOTA: parece que funciona. Simplemente en ocasiones al hacer deploy en un estado concreto los mensajes que aparecen en el nodo son confusos, pero parece que funciona. Aun así, lo desactivo.
                // ACT 03/01/2019 Sin esto no funciona NADA por: se corta la conexión porque es server no responde, el handleResponseOnEnd lanza la primera reconexión. Peta, entramos aquí en on('error') porque al no estar el server da ONNECTION REFUSED, y si aquí no se siguen las reconexipones todo el sistema queda inutilizado.
                // Solo intentar reconectar si hay no es la 1ra vez, es decir, si hubo una conexión activa y ha caído
                if (node.context().get('reconnectTimes') != 0) {
                    node.log ('No es el primer intento de conexión, se intenta reconectar.')
                    manageReconnection (endpointPath, node, callback);
                }
                else node.log ('Es el primer intento de conexión, no se intenta reconectar.')

                // Hacerla cacheable por nodo Catch
                node.error(err.toString(), {});
            }
            else
            {
                // Si no es tipo stream, simplemente fijar el error como estado y al debug
                node.status({fill:"red", shape:"ring", text: err.toString()});
                // Hacerla cacheable por nodo Catch
                node.error(err.toString(), {});
            }
        });

        node.request.end();
    }

    /**
     * Manje el evento onData de una request
     * Hace unas tareas comunes para las respuestas y posteriormetne llama al manejador propio de cada tipo de llamada
     * @param res Objeto respuesta completo
     * @param object The node
     * @param string Chunk de datos Recibidos
     * @param function Callback registrado en la request. Los stream necesita llama implicitamente, los normales no (lo llama el end)
     */
    function handleResponseOnData (res, node, chunk, requestCallback)
    {
        node.log("Response on DATA fired");

        // Resetear el tiempo de reconexión por si venimos de un intento de reconexión exitoso
        node.context().set('reconnectWaitTime', 5);
        node.context().set('reconnectTimes', 0);

        // Lo primero, controlar códigos de estado de la respuesta
        // Esto se procesa en cada chunk de datos o cada stream. Habrá un evento que lo ejecute una sola vez, buscarlo.
        // ACT: lo hay, request onResponse pero no hay acceso al cuerpo, no podemos imprimir el error
        var handleResult = handleStatusCode(res, chunk);
        if (handleResult.error === true)
		{
            node.context().set('expectedEnd', true); // Error de estado, se va a lanzar el END pero no reconectamos.
			// Lanzamos error cacheable por el nodo Catch https://iot.stackexchange.com/questions/3138/node-red-node-error-does-not-stop-flow-sometimesvar
            node.error('Received status ' + res.statusCode + ' - ' + handleResult.message, {});
            node.status({fill:"red", shape:"dot", text:res.statusCode + ' - ' + handleResult.message});
            return;
        }

		if (isStreamRequest(node))
		{
            // Lo primero, borrar el timer de espera de datos que trackea si la conexión con el server sigue viva
            clearTimeout(node.context().get('serverGoneTimer'));

            node.log("The callback is a stream, responding");

            // Llamar al manejador de respuestas en función del tipo de API
            if ((node.apitype == "cloudv1") || (node.apitype == "cloudv2")) {
                node.responseManagerObj.CloudStreamResponse(res, chunk, requestCallback);
            }
            else {
                node.responseManagerObj.LocalStreamResponse(res, chunk, requestCallback);
            }

            // Como que ya hemos manejado la respuesta y estamos esperando la siguiente
            node.status({fill:"blue",shape:"ring",text:"Waiting response..."});

            // Activar el timer de timeout de conexión de stream (track de conexiones mal cerradas por parte del server)
            // Lo activamos siempre que hay datos, hayamos caído o no en la excepción
            var serverGoneTimeout = node.context().get('serverGoneTimeout'); // Por def 45 sec
            var timer = setTimeout(function() {
                // Cerramos la conexión actual nosotros (server se ha ido) y reconnect
                node.warn('Han pasado ' + serverGoneTimeout + '" sin respuesta del servidor. Asumimos que se ha ido e intentamos abrir otra conexión.');
                node.context().set('expectedEnd', false); // Con esto al .end voy a intentar reconectar de forma automática
                node.request.abort();
                node.request.end();
                node.status({fill:"red",shape:"dot",text:"Server has gone away."});
            }, serverGoneTimeout * 1000);

            node.context().set('serverGoneTimer', timer);
		}
		else
		{
            // Si no es un stream, concatenar todos los posibles chunks y se response en el evento END más abajo
            // Esto pasará en llamadas a /data, donde la respuesta puede ser muy larga.
            // NOTE cuidado! Aquí nosotros hacemos join y no respondemos por chunks sino todo en uno. Podría petar? Deberíamos respetar los chunks y mandar un msj cada vez como hace su API?
            node.log("The callback is not a stream, joining chunks to respond on request end");

            // llamar al manejador de respuesta para que limpie el chunk.
            var chunkCleaned = node.responseManagerObj.CleanChunkResponse(chunk);

			// En la primera petición 'joinedChunks' es undefined, así que la primera vez simplemente deserializamos el chunk
            if (node.joinedChunks) node.joinedChunks += chunkCleaned;
			else node.joinedChunks = '' + chunkCleaned; // '' para pasar de buffer a string
		}
    }

    /**
     * Manejador general para fin de respuesta. Se usa para las request generadas tanto para el Cloud como para la API Local
     * @param object El nodo actual, para poder loguear o coger su configuración
     * @param function El callback al que responder con los datos, si es que es necesario responder
     */
    function handleResponseOnEnd (node, callback)
    {
    	node.log("Response on END fired");
    	node.context().set('streamIsRunning', false); // Sabemos que esto aquí es false siempre
        node.context().set('requestOngoing', false);

    	// Cerrar un posible Timer
        clearTimeout(node.context().get('serverGoneTimer'));
        clearTimeout(node.context().get('waitingToReconnectTimer'));

    	// Si es un stream, no llamamos al callback porque estamos simplemente parando la petición
    	// Solo se le llama en peticiones no stream, que es donde se mandan datos al finalizar la petición a la API
		if (!isStreamRequest(node))
    	{
    		node.log("Calling the callback with the response received");
            // Si joinedChunks no está definido no respondemos. Pasa cuando la petición ha devuelto un código de estado no 200
            if (node.joinedChunks) callback(node.joinedChunks);
            // Reinicializar joinedChunks ahora que ya se ha mandado
            node.joinedChunks = '';
    	}
    	else
    	{
    		// Entramos tb si la paramos con el botón!! o si llega un stopRequest al msg!!!. De ahí el control del expectedEnd
    		var ctx = node.context();
    		// Comprobar si es un término de conexión controlado (msg.stopRequest o click en el botón del nodo)
    		if (ctx.get('expectedEnd') === true)
    		{
    			node.log("Petición de tipo stream parada de forma controlada");
    		}
    		else
    		{
    			// Estando en una petición de tipo stream se ha llegado a un END de la request. No es posible a no
    			// ser que se haya parado la conexión por parte del servidor, y esto puede ser debido a dos cosas:
    			// 1.- Se desactiva manualmente la interoperabilidad
    			// 2.- Se actualiza la versión del soft de la caja, lo que para y rearranca los servicios de Savvy
    			// En ambos casos, se intentar reconectar
    			node.warn("Petición de tipo stream parada de forma inesperada");
    			node.warn('La petición de tipo stream ha llegado a su fin, probablemente por un corte del servidor, se intenta reconectar');
				var endpointPath = node.context().get('endpointPath');
    			manageReconnection(endpointPath, node, callback);
    		}
    	}
    }

    /**
     * Manejador general para errores de respuesta. Se usa para las request generadas tanto para el Cloud como para la API Local
     */
    function handleResponseOnError (err, node)
    {
    	node.log("Response on ERROR fired");

        // Por si las moscas
        clearTimeout(node.context().get('serverGoneTimer'));

        // Indicamos el error en el nodo y lo hacemos cacheable por nodo Catch
        node.status({fill:"red", shape:"ring", text:err.toString()});
        node.error("Response error: " + err.toString(), {});
    }

    /**
     * Comprueba, a partir de un objeto de respuests, si el código de estado es bueno
     * @param http.ServerResponse El objeto response entero
     * @param string El chunk de datos recibidos en la respuesta
     * @return object { error: bool, message: string };
     */
    function handleStatusCode (response, chunk)
    {
        if (response.statusCode != 200)
        {
            var responseObj = JSON.parse(chunk);
            return { error: true, message: responseObj.message };
        }
        return { error: false, message: '' };
    }

    /**
     * Gestión integral de reconexiones.
     *  Fija el stream a not-running
     *  Intenta la reconexión
     *  Aumenta el tiempo de reconexión para el siguiente intetrvalo
     *  Parar de intentar si se supera el máximo de reintentos (10)
     */
    function manageReconnection (endpointPath, node, callback)
    {
        node.context().set('streamIsRunning', false);
        node.context().set('requestOngoing', false);

        // Número máximo de reintentos? 10 intentos son sobre 13 minutos de reintentos
        if (node.context().get('reconnectTimes') == 10)
        {
            node.status({fill:"red", shape:"dot", text:"Stopped. 10 retries reached." });
            node.context().set('reconnectWaitTime', 5);
            node.context().set('waitingToReconnect', false);
            node.context().set('reconnectTimes', 0);
            clearTimeout(node.context().get('waitingToReconnectTimer'));
            return;
        }

        // Aumentar el número de reconexiones efectuadas
        node.context().set('reconnectTimes', node.context().get('reconnectTimes') + 1);

        // Recoger el tiempo a esperar para reconectar, que va aumentando si los intentos fallan
        var reconnectWaitTime = node.context().get('reconnectWaitTime');

        node.status({fill:"red",shape:"ring",text:"Reconnecting in " + reconnectWaitTime + " sec..."});

        // Intantar cada X segundos e ir aumentándolos si falla el intento. Aquí no hace falta aumentar los segundos
        // puesto que si fallan se aumentan en el evento que caputa el error: request.on('error')
        var timer = setTimeout( function() {
            node.warn('Timer waitingToReconnectTimer activo');
            sendRequest(endpointPath, node, callback);
        }, reconnectWaitTime * 1000);
        node.context().set('waitingToReconnectTimer', timer);
        node.context().set('waitingToReconnect', true);

        // Aumentar el tiempo de la siguiente reconexión
        node.context().set('reconnectWaitTime', node.context().get('reconnectWaitTime') + 5);
    }

	/**
	 * Comprueba si el target de cualquiera de los métodos es stream
	 */
	function isStreamRequest (node)
	{
		if ((node.methodCloudv1 == "stream") ||
            (node.methodCloudv2 == "stream") ||
            (node.methodLocal == "stream")) return true;
        return false;
	}

    // Register the node by name. This must be called before overriding any of the
    // Node functions.
    RED.nodes.registerType("savvy", savvyNode);

	// Retrieve input from the left button (Start/Stop button)
	// Ojo, esto maneja el clic sobre el botón propio del nodo pero no solo vale para arrancar un stream sino que para enviar un input normal.
	RED.httpAdmin.post("/savvy/:id", RED.auth.needsPermission("savvy.write"), function(req, res)
    {
		var node = RED.nodes.getNode(req.params.id);
        var ctx = node.context();
		if (node != null) {
			try {
				node.log("Clic en el botón del nodo");
				//node.log("Admin target es: " + node.target);
				node.log("Admin target es: " + (node.methodCloudv1 || '')  + (node.methodCloudv2 || '') + (node.methodLocal || ''));
				node.log("Stream running: " + ctx.get('streamIsRunning'));

                // Comprobar si hay una reconexión en marcha, si la hubiera se para el intento y se pone el nodo a stopped, para evitar comportamientos extraños
                if (ctx.get('waitingToReconnect') == true)
                {
                    node.warn('Se ha clicado en el nodo pero hay una reconexión en espera, se cancela.');
                    ctx.set('reconnectWaitTime', 5);
                    ctx.set('waitingToReconnect', false);
                    clearTimeout(ctx.get('waitingToReconnectTimer'));
                    node.status({fill:"grey", shape:"dot", text:'Stopped'});
                    return;
                }

				// Stop button
				//if(ctx.get('streamIsRunning') && (node.target === "stream"))
				if(ctx.get('streamIsRunning') && (isStreamRequest(node)))
				{
                    ctx.set('expectedEnd', true); // Indicar que estamos parando el stream de forma controlada
					node.log("Stopping the stream");
					// https://nodejs.org/api/http.html#http_http_request_options_callback
					// Stop the stream, The request will be stopped once the button has been clicked and the next response has been transmitted.
					node.request.abort();
					node.request.end();
                    node.status({fill:"grey",shape:"dot",text:"Stopped"});
					node.log("Stream stopped");

                    // Change the status flag
                    ctx.set('streamIsRunning', false);
                    ctx.set('requestOngoing', false);
				}
				// Start button
				else
				{
                    node.warn("No hay flujo de streaming que parar por lo que se envía una señal de entrada al nodo");
					node.receive();
				}
				res.sendStatus(200);
			} catch(err) {
				res.sendStatus(500);
				//adminconsole.log(RED._("savvy.failed", {error:err.toString()})); // Esto no tira (hecho por SINTEF)
                node.error(err.stack); // Añado esto en su lugar: https://nodered.org/docs/writing-functions#logging-events
			}
		} else {
			res.sendStatus(404);
		}
	});

}
