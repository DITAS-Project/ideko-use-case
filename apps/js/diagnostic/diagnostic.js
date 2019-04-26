/**
* Calls the Diagnostic
*/

var Diagnostic = {
	Call: function(url, pOKCallback)
	{
		// Get the token from the local storage
		var token = window.localStorage.getItem('ditasToken');

		// Set the headers
		var headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token
		}

		this.makeCall(url, pOKCallback, headers);
		return;
	},

	makeCall: function(pUrl, pOKCallback, pHeaders)
	{
		var request = new XMLHttpRequest();
		request.open('GET', pUrl, true);

		// Set the headers for the request
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
