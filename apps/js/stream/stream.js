/**
* Calls the stream
*/

var Stream = {
	Call: function(pURL, pOKCallback)
	{
		// Get the token from the local storage
		var token = window.localStorage.getItem('ditasToken');

		// Request headers
		var headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token
		}

		this.makeCall(pURL, pOKCallback, headers);
		return;
	},

	makeCall: function(pUrl, pOKCallback, pHeaders)
	{
		var response = '';
		var isChunked = false;
		var request = new XMLHttpRequest();

		// Initialize the request and set the headers
		request.open('GET', pUrl, true);

		// Set the headers for the request
		for (key in pHeaders)
		{
			request.setRequestHeader(key, pHeaders[key]);
		}

		// Cuando se termina la conexión
		request.onload = function()
		{
			console.log("onload - Reconect again - Connection is down");
		};

		request.onreadystatechange = function()
		{
			if (typeof this.index == "undefined")
				this.index = 0;

			// Everthing's ok :)
			if (this.readyState >= 3 && this.status == 200)
			{
				var content = this.responseText;
				var uniqueResponse = content.substring(this.index);
				this.index += uniqueResponse.length;

				// We return the response is its length is more than 1 (we ignore the bits to maintain the conection open)
				if ((uniqueResponse) && (uniqueResponse.length > 1))
				{
					var responseString = '' + uniqueResponse;
					// Just in case, we replace the break lines
					var responseArray = responseString.replace("\r", "").replace("\n", "\r\n").split("\r\n")

					// Parse de response to a proper value and call the callback
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
				console.log("Launching stream!\n");
			}
		};

		request.onerror = function()
		{
			// There was a connection error of some sort
			console.log('ERROR: onerror');
			StreamController.reconnect(pUrl)
		};

		request.abort = function()
		{
			// Connection aborted
			console.log('ERROR: abort');
			StreamController.reconnect(pUrl)
		};

		request.send();
	},
}
