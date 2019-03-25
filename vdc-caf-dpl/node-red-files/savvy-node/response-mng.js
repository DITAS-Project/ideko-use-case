class ResponseManager
{
	constructor(node) {
		this.node = node;
		// Almacenará el chunk a enviar hasta que deba ser enviado
		this.tmpStore = '';
	}

	// Método simple que no deja pasar las líneas con número de bytes y solamente aquellas con datos
	CleanChunkResponse (chunk)
	{
		var ret = '';

		// Partir el chunk en líneas
		var chunkString = '' + chunk;
		var chunkLines = chunkString.replace("\r", "").replace("\n", "\r\n").split("\r\n");

		// ER para coprobar si la línea es un número
		var re = new RegExp('^[0-9]+$');

		// Añadir solo que contienen datos
		chunkLines.forEach(function(line)
		{
			// Añadir la línea para ser devuelta si no es el número que indica la cantidad de bytes a leer
	        if (!re.test(line)) ret += line;
		});

		return ret;
	}

	// NOTE: ver #7 https://bitbucket.org/idekotics/node-red-contrib-savvy-apis/issues/7
	// No conseguimos reproducir un fallo potencial pero creemos que puede ocurrir
	CloudStreamResponse (res, chunk, callback)
	{
		var node = this.node;

		// The '' + chunk is added to convert the buffer into a string, and
        var chunkedData = '' + chunk;
		node.debug("CloudStreamResponse recibe: " + chunkedData);
        var chunkParts = chunkedData.split("\r\n");
        var responseString = "";

        // The first line can be: 1.- The number of bytes to read in the nextline; 2.- An JSON with an error message
        var re = new RegExp('^[0-9]+$');
        if (re.test(chunkParts[0])) // If the line is a number, get the next line if it is not a heartbeat
        {
            if (chunkParts[0] == "0") { // heartbeat
				node.log("Recibido Heartbeat");
                responseString = "";
			}
            else {
				//node.log("Recibido cantidad de bytes a leer: " + chunkParts[0]);
                responseString = chunkParts[1];
			}
        }
        else
        {
			//node.log("Recibido DATOS, no número");
            // It is not a number, strange, print the error
            responseString = chunkParts[0];
        }
        callback(responseString);
	}

	// NOTE: ver #7 https://bitbucket.org/idekotics/node-red-contrib-savvy-apis/issues/7
	// Este método implementa un mecanismo para evitar que se produzca un fallo al lanzarse el evento ondata
	// varias veces con fragmentos de la misma trama de datos
	LocalStreamResponse (res, chunk, callback)
	{
		var node = this.node;
		// The '' + chunk is added to convert the buffer into a string
		var responseString = '' + chunk;
		node.debug("LocalStreamResponse recibe: " + responseString);

		//var responseArray = responseString.replace("\r", "").replace("\n", "\r\n").split("\r\n");
		// NOTE Estrategia del siguiente cacho de código.
		// No podemos dar por hecho (ver #7) que cada onData trae fragmentos completos de datos hsata el /r/n, por
		// lo que implementamos nosotros el mecanismo:
		// Mientras no haya breakline, meter caracteres al tmpStore. En cuanto haya breakline, devolver tmpStore y seguir hasta el final del string. Si no se encuentra bl, da igual, la siguiente vuelta lo terminará.

		// Unificar saltos de línea porque creemos que la trama de control se separa por /n y el resto por /r/n
		var responseString = responseString.replace("\r", "").replace("\n", "\r\n");

		for (var i = 0; i < responseString.length; i++)
		{
			var char = responseString.charAt(i);

			// Si no es un breakline, meter el char al tmpStore
			if (char != "\r") {
				// No metemos el /n en el store. Pasa en el siguiente loop tras detectar /r/n y enviar los datos
				if (char == "\n") continue;
				//console.log("A store:" + responseString.charAt(i));
				this.tmpStore += responseString.charAt(i);
			}
			else {
				// Si estamos antes un /r/n, devolver el tmpStore, vaciarlo y continuar
				if (responseString.charAt(i + 1) == "\n") {
					// Comprobar que hay datos, si no los hay puede ser una trama de control
					if (this.tmpStore) {
						callback(this.tmpStore);
						this.tmpStore = '';
					}
					else {
						node.log("Recibidos datos vacíos, no se llama al callback");
						node.status({fill:"blue",shape:"ring",text:"Received empty data"});
					}
				}
			}
		}
		return;
	}
}

module.exports = ResponseManager;
