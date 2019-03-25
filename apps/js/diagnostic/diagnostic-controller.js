/**
 * Controladora para recoger las variables del RestStreaming
 * Añadir aquí las variables que se quieran leer.
 */

var DiagnosticController =
{
	startDiagnosticCall: function (pURL)
	{
		Diagnostic.Call(pURL, function (pDiagnosticResponse)
		{
			DiagnosticController.StatusM3 = pDiagnosticResponse.status;
			DiagnosticController.DateM3 = Date(pDiagnosticResponse.timestamp);
			DiagnosticController.CauseM3 = pDiagnosticResponse.cause.raw;
			DiagnosticController.MetricM3 = pDiagnosticResponse.cause.metric;
			DiagnosticController.ValueM3 = pDiagnosticResponse.cause.value + " " + pDiagnosticResponse.cause.unit;
			if (pDiagnosticResponse.hasOwnProperty("signals")) DiagnosticController.Z1AxisTemperature = pDiagnosticResponse.signals.Z1AxisTemperature.slice(1, 3000);
			if (pDiagnosticResponse.hasOwnProperty("signals")) DiagnosticController.Z2AxisTemperature = pDiagnosticResponse.signals.Z2AxisTemperature.slice(1, 3000);
			if (pDiagnosticResponse.hasOwnProperty("signals")) DiagnosticController.Z1AxisIntensity = pDiagnosticResponse.signals.Z1AxisEngineIntensity.slice(1, 3000);
			if (pDiagnosticResponse.hasOwnProperty("signals")) DiagnosticController.Z2AxisIntensity = pDiagnosticResponse.signals.Z2AxisEngineIntensity.slice(1, 3000);
		});
	}
}
