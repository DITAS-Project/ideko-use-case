$(window).ready(function()
{
	// Checks if the app local storage exist, otherwise, redirected to the login page
	var appStorageValue = window.localStorage.getItem('appStorage');
	if (!appStorageValue)
	{
		window.location.href = "app-login.html";
		return;
	}

	// Checks if the DITAS local storage exist, otherwise, redirected to the login page
	var ditasTokenValue = window.localStorage.getItem('ditasToken');
	if (!ditasTokenValue)
	{
		window.location.href = "ditas-login.html";
		return;
	}
});
