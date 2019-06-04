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
				DiagnosticController.ValueM1 = pDiagnosticResponse.cause.value;

				// Old graphs
				/*
				if (pDiagnosticResponse.hasOwnProperty("signals")
				{
					DiagnosticController.Z1AxisTemperatureM1 = pDiagnosticResponse.signals.Z1AxisTemperature.slice(1, 3000);
					DiagnosticController.Z2AxisTemperatureM1 = pDiagnosticResponse.signals.Z2AxisTemperature.slice(1, 3000);
					DiagnosticController.Z1AxisIntensityM1 = pDiagnosticResponse.signals.Z1AxisEngineIntensity.slice(1, 3000);
					DiagnosticController.Z2AxisIntensityM1 = pDiagnosticResponse.signals.Z2AxisEngineIntensity.slice(1, 3000);
				}
				*/

				// TODO: Set proper name for "CALCULATIONS"
				// NOTA: Si cada vez que se llama se tiene que pintar, se puede poner el pintar aquí.
				// 		 Sería trasladar aquí el código de "setInterval(function(){" del fichero 'app3-graphs-v2.js'
				//       Si no se hace así, se tendría que controlar el número de máquina en 'app3-grapgs-v2.js'
				if (pDiagnosticResponse.hasOwnProperty("signals"))
				{

					DiagnosticController.TIMESTAMP_M1 = pDiagnosticResponse.timestamp;

					pDiagnosticResponse.signals.forEach(function(element) {

					  console.log(element);
					  DiagnosticController.PLUS_SQRT20_M1 = pDiagnosticResponse.signals.avg + (Math.sqrt(20) * pDiagnosticResponse.signals.std_dev);
					});

					DiagnosticController.PLUS_SQRT20_M1 = pDiagnosticResponse.signals.avg + (Math.sqrt(20) * pDiagnosticResponse.signals.std_dev);
					DiagnosticController.MINUS_SQRT20_M1 = pDiagnosticResponse.signals.avg - (Math.sqrt(20) * pDiagnosticResponse.signals.std_dev);
					DiagnosticController.PLUS_SQRT10_M1 = pDiagnosticResponse.signals.avg + (Math.sqrt(10) * pDiagnosticResponse.signals.std_dev);
					DiagnosticController.MINUS_SQRT10_M1 = pDiagnosticResponse.signals.avg - (Math.sqrt(10) * pDiagnosticResponse.signals.std_dev);
					DiagnosticController.PLUS_TWO_M1 = pDiagnosticResponse.signals.avg + (2 * pDiagnosticResponse.signals.std_dev);
					DiagnosticController.MINUS_TWO_M1 = pDiagnosticResponse.signals.avg - (2 * pDiagnosticResponse.signals.std_dev);
					DiagnosticController.MEAN_M1 = pDiagnosticResponse.signals.avg;
					DiagnosticController.AGGREGATED_M1 = pDiagnosticResponse.signals.observations;
				}
				//if (pDiagnosticResponse.hasOwnProperty("cause")) DiagnosticController.INDICATOR_M1  = pDiagnosticResponse.cause.metric;

			}

			if (machineName === "Slater")
			{
				DiagnosticController.StatusM2 = pDiagnosticResponse.status;
				DiagnosticController.DateM2 = Date(pDiagnosticResponse.timestamp);
				DiagnosticController.CauseM2 = pDiagnosticResponse.cause.raw;
				DiagnosticController.MetricM2 = pDiagnosticResponse.cause.metric;
				DiagnosticController.ValueM2 = pDiagnosticResponse.cause.value;

				// Old graphs
				if (pDiagnosticResponse.hasOwnProperty("signals"))
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
console.log("RESPUESTA!");
console.log(pDiagnosticResponse);
				DiagnosticController.StatusM3 = pDiagnosticResponse.status;
				DiagnosticController.DateM3 = Date(pDiagnosticResponse.timestamp);
				DiagnosticController.CauseM3 = pDiagnosticResponse.cause.raw;
				DiagnosticController.MetricM3 = pDiagnosticResponse.cause.metric;
				DiagnosticController.ValueM3 = parseFloat(pDiagnosticResponse.cause.value).toFixed(2);

				if (pDiagnosticResponse.hasOwnProperty("signals"))
				{
					// Get the timestamp
					timestamp = pDiagnosticResponse.timestamp;

					// For each indicator, calculate its value
					for (const [indicator_name, value] of Object.entries(pDiagnosticResponse.signals))
					{
					  DiagnosticController.calculateValue(indicator_name, timestamp, parseFloat(value.avg), parseFloat(value.std_dev), parseFloat(value.observation), 3)
					}
				}
			}
		});
	},

	/**
	* Prints graphs and change the data name for a given name
	* @param indicator_name: Indicator name
	* @param timestamp: Timestamp
	* @param avg: Average value
	* @param std_dev: Standard derivation value
	* @param observation: Observation value
	* @param machineNumber: Machine number
	*/
	calculateValue: function (indicator_name, timestamp, avg, std_dev, observation, machineNumber)
	{
		// Make the proper calculations
		plus_sqrt20 = avg + (Math.sqrt(20) * std_dev);
		minus_sqrt20 = avg - (Math.sqrt(20) * std_dev);
		plus_sqrt10 = avg + (Math.sqrt(10) * std_dev);
		minus_sqrt10 = avg - (Math.sqrt(10) * std_dev);
		plus_two = avg + (2 * std_dev);
		minus_two = avg - (2 * std_dev);
		mean = avg;
		aggregated = observation;

		// Add data to the current graph
		// Z1 Temperature
		if (indicator_name === "Z1AxisTemperature_mean")
		{
			addDataToGraph('z1-temperature-graph-m' + machineNumber, 'Z1 temperature', 0, aggregated, timestamp);
			addDataToGraph('z1-temperature-graph-m' + machineNumber, 'Z1 temperature', 1, plus_sqrt20, timestamp);
			addDataToGraph('z1-temperature-graph-m' + machineNumber, 'Z1 temperature', 2, minus_sqrt20, timestamp);
			addDataToGraph('z1-temperature-graph-m' + machineNumber, 'Z1 temperature', 3, plus_sqrt10, timestamp);
			addDataToGraph('z1-temperature-graph-m' + machineNumber, 'Z1 temperature', 4, minus_sqrt10, timestamp);
			addDataToGraph('z1-temperature-graph-m' + machineNumber, 'Z1 temperature', 5, plus_two, timestamp);
			addDataToGraph('z1-temperature-graph-m' + machineNumber, 'Z1 temperature', 6, minus_two, timestamp);
			addDataToGraph('z1-temperature-graph-m' + machineNumber, 'Z1 temperature', 7, mean, timestamp);
		}

		// Z2 Temperature
		else if (indicator_name === "Z2AxisTemperature_mean")
		{
			addDataToGraph('z2-temperature-graph-m' + machineNumber, 'Z2 temperature', 0, aggregated, timestamp);
			addDataToGraph('z2-temperature-graph-m' + machineNumber, 'Z2 temperature', 1, plus_sqrt20, timestamp);
			addDataToGraph('z2-temperature-graph-m' + machineNumber, 'Z2 temperature', 2, minus_sqrt20, timestamp);
			addDataToGraph('z2-temperature-graph-m' + machineNumber, 'Z2 temperature', 3, plus_sqrt10, timestamp);
			addDataToGraph('z2-temperature-graph-m' + machineNumber, 'Z2 temperature', 4, minus_sqrt10, timestamp);
			addDataToGraph('z2-temperature-graph-m' + machineNumber, 'Z2 temperature', 5, plus_two, timestamp);
			addDataToGraph('z2-temperature-graph-m' + machineNumber, 'Z2 temperature', 6, minus_two, timestamp);
			addDataToGraph('z2-temperature-graph-m' + machineNumber, 'Z2 temperature', 7, mean, timestamp);
		}
		// Z1 intensity
		else if (indicator_name === "Z1AxisEngineIntensity_mean")
		{
			addDataToGraph('z1-intensity-graph-m' + machineNumber, 'Z1 intensity', 0, aggregated, timestamp);
			addDataToGraph('z1-intensity-graph-m' + machineNumber, 'Z1 intensity', 1, plus_sqrt20, timestamp);
			addDataToGraph('z1-intensity-graph-m' + machineNumber, 'Z1 intensity', 2, minus_sqrt20, timestamp);
			addDataToGraph('z1-intensity-graph-m' + machineNumber, 'Z1 intensity', 3, plus_sqrt10, timestamp);
			addDataToGraph('z1-intensity-graph-m' + machineNumber, 'Z1 intensity', 4, minus_sqrt10, timestamp);
			addDataToGraph('z1-intensity-graph-m' + machineNumber, 'Z1 intensity', 5, plus_two, timestamp);
			addDataToGraph('z1-intensity-graph-m' + machineNumber, 'Z1 intensity', 6, minus_two, timestamp);
			addDataToGraph('z1-intensity-graph-m' + machineNumber, 'Z1 intensity', 7, mean, timestamp);
		}
		// Z2 intensity
		else if (indicator_name === "Z2AxisEngineIntensity_mean")
		{
			addDataToGraph('z2-intensity-graph-m' + machineNumber, 'Z2 intensity', 0, aggregated, timestamp);
			addDataToGraph('z2-intensity-graph-m' + machineNumber, 'Z2 intensity', 1, plus_sqrt20, timestamp);
			addDataToGraph('z2-intensity-graph-m' + machineNumber, 'Z2 intensity', 2, minus_sqrt20, timestamp);
			addDataToGraph('z2-intensity-graph-m' + machineNumber, 'Z2 intensity', 3, plus_sqrt10, timestamp);
			addDataToGraph('z2-intensity-graph-m' + machineNumber, 'Z2 intensity', 4, minus_sqrt10, timestamp);
			addDataToGraph('z2-intensity-graph-m' + machineNumber, 'Z2 intensity', 5, plus_two, timestamp);
			addDataToGraph('z2-intensity-graph-m' + machineNumber, 'Z2 intensity', 6, minus_two, timestamp);
			addDataToGraph('z2-intensity-graph-m' + machineNumber, 'Z2 intensity', 7, mean, timestamp);
		}
	}
}
