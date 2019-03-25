/**
* Calls the stream
*/

var Stream = {
	Method: 'GET',
	ContentType: 'application/json',

	// Dominio
	Segment: '', // Se debe fijar dede fuera

	Call: function(pURL, pOKCallback)
	{
		// Array con los parámetros de la firma
		var signParameters = [Stream.Method,
			Stream.ContentType,
			Stream.Resource
		];

		var headers = {
			'Content-Type': Stream.ContentType,
			'Access-Control-Allow-Origin': '*',
		}

		this.makeCall(pURL, pOKCallback, headers);
		return;
	},

	makeCall: function(pUrl, pOKCallback, pHeaders)
	{
		var response = '';
		var isChunked = false;
		var request = new XMLHttpRequest();

		// Recogemos la URL
		request.open('GET', pUrl, true);


		// Fijar cabeceras tras abir el recurso
		for (key in pHeaders)
		{
			request.setRequestHeader(key, pHeaders[key]);
		}

		// Cuando se termina la conexión
		request.onload = function()
		{
			console.log("onload - Volver a reconectarnos - Ha caido la conexion - Volvemos a la pagina de inicio");
		};

		request.onreadystatechange = function()
		{
			if (typeof this.index == "undefined")
				this.index = 0;


			if (this.readyState >= 3 && this.status == 200)
			{
				var content = this.responseText;
				var uniqueResponse = content.substring(this.index);

				//console.log('Respuesta: ' +  uniqueResponse);
				//console.log("content.length: " + uniqueResponse.length + ' - ' + new Date());

				this.index += uniqueResponse.length;

				// Devolvemos la respuesta si su longitud es mayor que 1 ya que manda tramas de bit de conexión abierta
				if ((uniqueResponse) && (uniqueResponse.length > 1))
				{
					var responseString = '' + uniqueResponse;
					// Nos curamos en salud en diferentes formatos de saltos de línea
					var responseArray = responseString.replace("\r", "").replace("\n", "\r\n").split("\r\n")
					//console.log(responseArray.length);
					responseArray.forEach(function(el)
					{
						if (el)
						{
							try
							{
								var data = JSON.parse(el);
							}
							catch (err)
							{
								var data = '';
							}
							pOKCallback(data)
						}
						else
						{
							pOKCallback('');
						}
					});
					//var data = JSON.parse(uniqueResponse);
					//pOKCallback(data);
				}
				//else pOKCallback('');
			}
			else
			{
				console.log("Stream error. If you just lunched the stream this is normal, stream should start right after this message\n");
			}

		};

		request.onerror = function()
		{
			// There was a connection error of some sort
			console.log('onerror');
		};

		request.send();
	},
}
