// Removes the tokens and redirects to app login page
var Logout = {
	logout: function ()
	{
		window.localStorage.removeItem('appStorage');
		window.localStorage.removeItem('ditasToken');
		window.location.href = "app-login.html";
	}
}
