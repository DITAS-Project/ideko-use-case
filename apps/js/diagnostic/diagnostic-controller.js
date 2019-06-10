/**
 * Controladora para recoger las variables de las llamadas GetSimplifiedDiagnostic y GetFullDiagnostic
 */

var DiagnosticController =
{
	startDiagnosticCall: function (pURL, machineName)
	{
		Diagnostic.Call(pURL, function (pDiagnosticResponse)
		{
			if (machineName === "Kelly")
			{
console.log(pDiagnosticResponse);
				DiagnosticController.StatusM1 = pDiagnosticResponse.status;
				DiagnosticController.DateM1 = Date(pDiagnosticResponse.timestamp);
				DiagnosticController.CauseM1 = pDiagnosticResponse.cause.raw;
				DiagnosticController.MetricM1 = pDiagnosticResponse.cause.metric;
				DiagnosticController.ValueM1 = parseFloat(pDiagnosticResponse.cause.value).toFixed(2);

				if (pDiagnosticResponse.hasOwnProperty("signals") && pDiagnosticResponse.signals != null)
				{
					// Get the timestamp
					timestamp = pDiagnosticResponse.timestamp;

					// For each indicator, calculate its value
					for (const [indicator_name, value] of Object.entries(pDiagnosticResponse.signals))
					{
					  calculateValue(indicator_name, timestamp, parseFloat(value.avg), parseFloat(value.std_dev), parseFloat(value.observation), 1)
					}
				}
			}

			if (machineName === "Slater")
			{
console.log(pDiagnosticResponse);
				DiagnosticController.StatusM2 = pDiagnosticResponse.status;
				DiagnosticController.DateM2 = Date(pDiagnosticResponse.timestamp);
				DiagnosticController.CauseM2 = pDiagnosticResponse.cause.raw;
				DiagnosticController.MetricM2 = pDiagnosticResponse.cause.metric;
				DiagnosticController.ValueM2 = parseFloat(pDiagnosticResponse.cause.value).toFixed(2);

				if (pDiagnosticResponse.hasOwnProperty("signals") && pDiagnosticResponse.signals != null)
				{
					// Get the timestamp
					timestamp = pDiagnosticResponse.timestamp;

					// For each indicator, calculate its value
					for (const [indicator_name, value] of Object.entries(pDiagnosticResponse.signals))
					{
					  calculateValue(indicator_name, timestamp, parseFloat(value.avg), parseFloat(value.std_dev), parseFloat(value.observation), 2)
					}
				}
			}

			if (machineName === "Zack")
			{
console.log(pDiagnosticResponse);
				DiagnosticController.StatusM3 = pDiagnosticResponse.status;
				DiagnosticController.DateM3 = Date(pDiagnosticResponse.timestamp);
				DiagnosticController.CauseM3 = pDiagnosticResponse.cause.raw;
				DiagnosticController.MetricM3 = pDiagnosticResponse.cause.metric;
				DiagnosticController.ValueM3 = parseFloat(pDiagnosticResponse.cause.value).toFixed(2);

				if (pDiagnosticResponse.hasOwnProperty("signals") && pDiagnosticResponse.signals != null)
				{
					// Get the timestamp
					timestamp = pDiagnosticResponse.timestamp;

					// For each indicator, calculate its value
					for (const [indicator_name, value] of Object.entries(pDiagnosticResponse.signals))
					{
					  calculateValue(indicator_name, timestamp, parseFloat(value.avg), parseFloat(value.std_dev), parseFloat(value.observation), 3)
					}
				}
			}
		});
	}
}
