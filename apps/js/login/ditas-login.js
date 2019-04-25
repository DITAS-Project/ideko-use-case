// Check on load if the app login has made beforehand, otherwise, redirect
$(window).ready(function()
	{
		var appStorageValue = window.localStorage.getItem('appStorage');
		if (!appStorageValue)
		{
			window.location.href = "app-login.html";
			return;
		}
});

// Checks the login and returns the Keycloak token
var DitasLogin = {
	checkLogin: function (appNumber)
	{		
		// Get input values		
		var username = document.getElementById("username").value;
		var password = document.getElementById("password").value;
		
		// Create the request and set the proper header
		var req = new XMLHttpRequest();  
		req.open("POST", AppConfiguration.KeycloakURL + "/auth/realms/" + AppConfiguration. KeycloakRealm + "/protocol/openid-connect/token");  
		req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		
		// Set the params and send the request
		var params = 'username=' + username + '&password=' + password + '&client_id=' + AppConfiguration.KeycloackClientID + '&grant_type=password';
		req.send(params); 

		// Get response
		req.onreadystatechange = function() {
			if (req.readyState == 4) {
				// OK - 200, loged into Keycloak and token obtained
				if (req.status == 200) {
					var token = JSON.parse(req.responseText)
						console.log("OK! Access token is: " + token.access_token)
						window.localStorage.setItem("ditasToken", token.access_token);
						window.location.href = "app" + appNumber + ".html";
				// BAD - Login error
				} else {
					document.getElementById("feedback").innerHTML = "Wrong user or password, please try again";
				}
			}
		};
	}
}