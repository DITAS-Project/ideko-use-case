/**
 * Controladora para recoger las variables del RestStreaming
 * Añadir aquí las variables que se quieran leer.
 */

var DiagnosticController =
{
	startDiagnosticCall: function (pURL, machineName)
	{
		Diagnostic.Call(pURL, function (pDiagnosticResponse)
		{

			if (machineName === "Kelly")
			{
				DiagnosticController.StatusM1 = pDiagnosticResponse.status;
				DiagnosticController.DateM1 = Date(pDiagnosticResponse.timestamp);
				DiagnosticController.CauseM1 = pDiagnosticResponse.cause.raw;
				DiagnosticController.MetricM1 = pDiagnosticResponse.cause.metric;
				DiagnosticController.ValueM1 = pDiagnosticResponse.cause.value + " " + pDiagnosticResponse.cause.unit;
				// TODO: Modify this to use APP3
				//if (pDiagnosticResponse.hasOwnProperty("signals")) DiagnosticController.Z1AxisTemperature = pDiagnosticResponse.signals.Z1AxisTemperature.slice(1, 3000);
				//if (pDiagnosticResponse.hasOwnProperty("signals")) DiagnosticController.Z2AxisTemperature = pDiagnosticResponse.signals.Z2AxisTemperature.slice(1, 3000);
				//if (pDiagnosticResponse.hasOwnProperty("signals")) DiagnosticController.Z1AxisIntensity = pDiagnosticResponse.signals.Z1AxisEngineIntensity.slice(1, 3000);
				//if (pDiagnosticResponse.hasOwnProperty("signals")) DiagnosticController.Z2AxisIntensity = pDiagnosticResponse.signals.Z2AxisEngineIntensity.slice(1, 3000);
			}

			if (machineName === "Slater")
			{
				DiagnosticController.StatusM2 = pDiagnosticResponse.status;
				DiagnosticController.DateM2 = Date(pDiagnosticResponse.timestamp);
				DiagnosticController.CauseM2 = pDiagnosticResponse.cause.raw;
				DiagnosticController.MetricM2 = pDiagnosticResponse.cause.metric;
				DiagnosticController.ValueM2 = pDiagnosticResponse.cause.value + " " + pDiagnosticResponse.cause.unit;
				// TODO: Modify this to use APP3
				//if (pDiagnosticResponse.hasOwnProperty("signals")) DiagnosticController.Z1AxisTemperature = pDiagnosticResponse.signals.Z1AxisTemperature.slice(1, 3000);
				//if (pDiagnosticResponse.hasOwnProperty("signals")) DiagnosticController.Z2AxisTemperature = pDiagnosticResponse.signals.Z2AxisTemperature.slice(1, 3000);
				//if (pDiagnosticResponse.hasOwnProperty("signals")) DiagnosticController.Z1AxisIntensity = pDiagnosticResponse.signals.Z1AxisEngineIntensity.slice(1, 3000);
				//if (pDiagnosticResponse.hasOwnProperty("signals")) DiagnosticController.Z2AxisIntensity = pDiagnosticResponse.signals.Z2AxisEngineIntensity.slice(1, 3000);
			}

			if (machineName === "Zack")
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
			}


		});
	}
}
