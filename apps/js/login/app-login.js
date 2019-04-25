// Checks the login is ok, and redirects to the 
var AppLogin = {
	checkLogin: function (appNumber)
	{
		// Get input values
		var inputUser = document.getElementById('username').value;
		var inputPassword = document.getElementById('password').value;
		
		// Get saved user and password
		var savedUser = AppConfiguration.AppUser;
		var savedPassword = AppConfiguration.AppPassword;
		
		// Hash input values
		var hashedInputUser = CryptoJS.SHA512(inputUser).toString(CryptoJS.enc.Hex);
		var hashedInputPassword = CryptoJS.SHA512(inputPassword).toString(CryptoJS.enc.Hex);
		
		// Check if match
		if (hashedInputPassword == savedPassword && hashedInputUser == savedUser)
		{
			window.localStorage.setItem("appStorage", "exist");
			window.location.href = "app" + appNumber + ".html";
		}
		else
		{
			document.getElementById("feedback").innerHTML = "Wrong user or password, please try again";
		}
	}
}