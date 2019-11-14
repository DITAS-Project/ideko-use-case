/**
 * Controladora para recoger las variables del RestStreaming
 * Añadir aquí las variables que se quieran leer.
 */

var StreamController =
{
	startStreaming: function (pURL)
	{
		Stream.Call(pURL, function (pStreamResponseLine)
		{
			if (pStreamResponseLine.hasOwnProperty("data"))
			{
				// Remove this line if you want to print all the stream response lines
				console.log(pStreamResponseLine.data)

		        // Machine 1 - Kelly
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.ExecutionStateM1id)) StreamController.ExecutionStateM1 = pStreamResponseLine.data[AppConfiguration.ExecutionStateM1id];
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.ControllerModeM1id)) StreamController.ControllerModeM1 = pStreamResponseLine.data[AppConfiguration.ControllerModeM1id];
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.ProgramNameM1id)) StreamController.ProgramNameM1 = pStreamResponseLine.data[AppConfiguration.ProgramNameM1id];
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.Z1AxisTemperatureM1id)) StreamController.Z1AxisTemperatureM1 = pStreamResponseLine.data[AppConfiguration.Z1AxisTemperatureM1id];
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.Z1AxisEngineIntensityM1id)) StreamController.Z1AxisEngineIntensityM1 = pStreamResponseLine.data[AppConfiguration.Z1AxisEngineIntensityM1id];
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.Z2AxisTemperatureM1id)) StreamController.Z2AxisTemperatureM1 = pStreamResponseLine.data[AppConfiguration.Z2AxisTemperatureM1id];
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.Z2AxisEngineIntensityM1id)) StreamController.Z2AxisEngineIntensityM1 = pStreamResponseLine.data[AppConfiguration.Z2AxisEngineIntensityM1id];

		        // Machine 2 - Slater
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.ExecutionStateM2id)) StreamController.ExecutionStateM2 = pStreamResponseLine.data[AppConfiguration.ExecutionStateM2id];
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.ControllerModeM2id)) StreamController.ControllerModeM2 = pStreamResponseLine.data[AppConfiguration.ControllerModeM2id];
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.ProgramNameM2id)) StreamController.ProgramNameM2 = pStreamResponseLine.data[AppConfiguration.ProgramNameM2id];
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.Z1AxisTemperatureM2id)) StreamController.Z1AxisTemperatureM2 = pStreamResponseLine.data[AppConfiguration.Z1AxisTemperatureM2id];
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.Z1AxisEngineIntensityM2id)) StreamController.Z1AxisEngineIntensityM2 = pStreamResponseLine.data[AppConfiguration.Z1AxisEngineIntensityM2id];
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.Z2AxisTemperatureM2id)) StreamController.Z2AxisTemperatureM2 = pStreamResponseLine.data[AppConfiguration.Z2AxisTemperatureM2id];
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.Z2AxisEngineIntensityM2id)) StreamController.Z2AxisEngineIntensityM2 = pStreamResponseLine.data[AppConfiguration.Z2AxisEngineIntensityM2id];

		        // Machine 3 - Zack
				if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.ExecutionStateM3id)) StreamController.ExecutionStateM3 = pStreamResponseLine.data[AppConfiguration.ExecutionStateM3id];
				if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.ControllerModeM3id)) StreamController.ControllerModeM3 = pStreamResponseLine.data[AppConfiguration.ControllerModeM3id];
				if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.ProgramNameM3id)) StreamController.ProgramNameM3 = pStreamResponseLine.data[AppConfiguration.ProgramNameM3id];
				if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.Z1AxisTemperatureM3id)) StreamController.Z1AxisTemperatureM3 = pStreamResponseLine.data[AppConfiguration.Z1AxisTemperatureM3id];
				if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.Z1AxisEngineIntensityM3id)) StreamController.Z1AxisEngineIntensityM3 = pStreamResponseLine.data[AppConfiguration.Z1AxisEngineIntensityM3id];
				if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.Z2AxisTemperatureM3id)) StreamController.Z2AxisTemperatureM3 = pStreamResponseLine.data[AppConfiguration.Z2AxisTemperatureM3id];
				if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.Z2AxisEngineIntensityM3id)) StreamController.Z2AxisEngineIntensityM3 = pStreamResponseLine.data[AppConfiguration.Z2AxisEngineIntensityM3id];
			}
		});
	},

	// Reconnects to the given URL
	reconnect: function(pUrl)
	{
		console.log("Stream connection aborted, reconnecting to: " + pUrl);
		StreamController.startStreaming(pUrl);
	},
}
