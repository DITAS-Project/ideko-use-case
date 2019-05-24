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

				// Old graphs
				if (pDiagnosticResponse.hasOwnProperty("signals")
				{
					DiagnosticController.Z1AxisTemperatureM1 = pDiagnosticResponse.signals.Z1AxisTemperature.slice(1, 3000);
					DiagnosticController.Z2AxisTemperatureM1 = pDiagnosticResponse.signals.Z2AxisTemperature.slice(1, 3000);
					DiagnosticController.Z1AxisIntensityM1 = pDiagnosticResponse.signals.Z1AxisEngineIntensity.slice(1, 3000);
					DiagnosticController.Z2AxisIntensityM1 = pDiagnosticResponse.signals.Z2AxisEngineIntensity.slice(1, 3000);
				}
				/*
				// TODO: Set proper name for "CALCULATIONS"
				// NOTA: Si cada vez que se llama se tiene que pintar, se puede poner el pintar aquí.
				// 		 Sería trasladar aquí el código de "setInterval(function(){" del fichero 'app3-graphs-v2.js'
				//       Si no se hace así, se tendría que controlar el número de máquina en 'app3-grapgs-v2.js'
				if (pDiagnosticResponse.hasOwnProperty("CALCULATIONS"))
				{
					DiagnosticController.TIMESTAMP_M1 = pDiagnosticResponse.timestamp;
					DiagnosticController.PLUS_SQRT20_M1 = pDiagnosticResponse.CALCULATIONS.avg + (Math.sqrt(20) * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.MINUS_SQRT20_M1 = pDiagnosticResponse.CALCULATIONS.avg - (Math.sqrt(20) * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.PLUS_SQRT10_M1 = pDiagnosticResponse.CALCULATIONS.avg + (Math.sqrt(10) * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.MINUS_SQRT10_M1 = pDiagnosticResponse.CALCULATIONS.avg - (Math.sqrt(10) * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.PLUS_TWO_M1 = pDiagnosticResponse.CALCULATIONS.avg + (2 * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.MINUS_TWO_M1 = pDiagnosticResponse.CALCULATIONS.avg - (2 * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.MEAN_M1 = pDiagnosticResponse.CALCULATIONS.avg;
					DiagnosticController.AGGREGATED_M1 = pDiagnosticResponse.CALCULATIONS.observations;
				}
				if (pDiagnosticResponse.hasOwnProperty("cause")) DiagnosticController.INDICATOR_M1  = pDiagnosticResponse.cause.metric;
				*/
			}

			if (machineName === "Slater")
			{
				DiagnosticController.StatusM2 = pDiagnosticResponse.status;
				DiagnosticController.DateM2 = Date(pDiagnosticResponse.timestamp);
				DiagnosticController.CauseM2 = pDiagnosticResponse.cause.raw;
				DiagnosticController.MetricM2 = pDiagnosticResponse.cause.metric;
				DiagnosticController.ValueM2 = pDiagnosticResponse.cause.value + " " + pDiagnosticResponse.cause.unit;

				// Old graphs
				if (pDiagnosticResponse.hasOwnProperty("signals")
				{
					DiagnosticController.Z1AxisTemperatureM2 = pDiagnosticResponse.signals.Z1AxisTemperature.slice(1, 3000);
					DiagnosticController.Z2AxisTemperatureM2 = pDiagnosticResponse.signals.Z2AxisTemperature.slice(1, 3000);
					DiagnosticController.Z1AxisIntensityM2 = pDiagnosticResponse.signals.Z1AxisEngineIntensity.slice(1, 3000);
					DiagnosticController.Z2AxisIntensityM2 = pDiagnosticResponse.signals.Z2AxisEngineIntensity.slice(1, 3000);
				}
				/*
				// TODO: Set proper name for "CALCULATIONS"
				if (pDiagnosticResponse.hasOwnProperty("CALCULATIONS"))
				{
					DiagnosticController.TIMESTAMP_M2 = pDiagnosticResponse.timestamp;
					DiagnosticController.PLUS_SQRT20_M2 = pDiagnosticResponse.CALCULATIONS.avg + (Math.sqrt(20) * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.MINUS_SQRT20_M2 = pDiagnosticResponse.CALCULATIONS.avg - (Math.sqrt(20) * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.PLUS_SQRT10_M2 = pDiagnosticResponse.CALCULATIONS.avg + (Math.sqrt(10) * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.MINUS_SQRT10_M2 = pDiagnosticResponse.CALCULATIONS.avg - (Math.sqrt(10) * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.PLUS_TWO_M2 = pDiagnosticResponse.CALCULATIONS.avg + (2 * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.MINUS_TWO_M2 = pDiagnosticResponse.CALCULATIONS.avg - (2 * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.MEAN_M2 = pDiagnosticResponse.CALCULATIONS.avg;
					DiagnosticController.AGGREGATED_M2 = pDiagnosticResponse.CALCULATIONS.observations;
				}
				if (pDiagnosticResponse.hasOwnProperty("cause")) DiagnosticController.INDICATOR_M2  = pDiagnosticResponse.cause.metric;
				*/
			}

			if (machineName === "Zack")
			{
				DiagnosticController.StatusM3 = pDiagnosticResponse.status;
				DiagnosticController.DateM3 = Date(pDiagnosticResponse.timestamp);
				DiagnosticController.CauseM3 = pDiagnosticResponse.cause.raw;
				DiagnosticController.MetricM3 = pDiagnosticResponse.cause.metric;
				DiagnosticController.ValueM3 = pDiagnosticResponse.cause.value + " " + pDiagnosticResponse.cause.unit;

				// Old graphs
				if (pDiagnosticResponse.hasOwnProperty("signals"))
				{
					DiagnosticController.Z1AxisTemperatureM3 = pDiagnosticResponse.signals.Z1AxisTemperature.slice(1, 3000);
					DiagnosticController.Z2AxisTemperatureM3 = pDiagnosticResponse.signals.Z2AxisTemperature.slice(1, 3000);
					DiagnosticController.Z1AxisIntensityM3 = pDiagnosticResponse.signals.Z1AxisEngineIntensity.slice(1, 3000);
					DiagnosticController.Z2AxisIntensityM3 = pDiagnosticResponse.signals.Z2AxisEngineIntensity.slice(1, 3000);
				}
				/*
				// TODO: Set proper name for "CALCULATIONS"
				if (pDiagnosticResponse.hasOwnProperty("CALCULATIONS"))
				{
					DiagnosticController.TIMESTAMP_M3 = pDiagnosticResponse.timestamp;
					DiagnosticController.PLUS_SQRT20_M3 = pDiagnosticResponse.CALCULATIONS.avg + (Math.sqrt(20) * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.MINUS_SQRT20_M3 = pDiagnosticResponse.CALCULATIONS.avg - (Math.sqrt(20) * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.PLUS_SQRT10_M3 = pDiagnosticResponse.CALCULATIONS.avg + (Math.sqrt(10) * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.MINUS_SQRT10_M3 = pDiagnosticResponse.CALCULATIONS.avg - (Math.sqrt(10) * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.PLUS_TWO_M3 = pDiagnosticResponse.CALCULATIONS.avg + (2 * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.MINUS_TWO_M3 = pDiagnosticResponse.CALCULATIONS.avg - (2 * pDiagnosticResponse.CALCULATIONS.std_dev);
					DiagnosticController.MEAN_M3 = pDiagnosticResponse.CALCULATIONS.avg;
					DiagnosticController.AGGREGATED_M3 = pDiagnosticResponse.CALCULATIONS.observations;
				}
				if (pDiagnosticResponse.hasOwnProperty("cause")) DiagnosticController.INDICATOR_M3  = pDiagnosticResponse.cause.metric;
				*/
			}
		});
	}
}
