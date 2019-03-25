/**
* Calls the Diagnostic
*/

var Diagnostic = {

	ContentType: 'application/json',

	Call: function(url, pOKCallback)
	{
		var headers = {
		}

		this.makeCall(url, pOKCallback, headers);
		return;
	},

	makeCall: function(pUrl, pOKCallback, pHeaders)
	{
		var request = new XMLHttpRequest();

		request.open('GET', pUrl, true);

		// Set headers
		for (key in pHeaders)
		{
			request.setRequestHeader(key, pHeaders[key]);
		}

		request.onload = function()
		{

			if (typeof this.index == "undefined")
				this.index = 0;
			if (this.readyState >= 3 && this.status == 200)
			{
				var content = this.responseText;
				pOKCallback(JSON.parse(content));

			}
			else
			{
				console.log("Error loading page\n");
			}

		};

		request.onerror = function()
		{
			// There was a connection error of some sort
			console.log('onerror');
		};
		request.send();
	}
}

/*
// Ejemplo de llamada desde otros ficheros JS
DiagnosticController.diagnosticCall('https://jsonplaceholder.typicode.com/todos/1', function (pResult) {
	console.log(pResult);
});
*/
