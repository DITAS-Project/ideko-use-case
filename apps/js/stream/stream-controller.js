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
			//console.log(pStreamResponseLine);

			if (pStreamResponseLine.hasOwnProperty("data"))
			{
				/*
		        // MACHINE 1
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.ExecutionStateM1id)) StreamController.ExecutionStateM1 = pStreamResponseLine.data.I_XXC_MBXSLL_AW8HY7;
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.StreamControllerModeM1id)) StreamController.StreamControllerModeM1 = pStreamResponseLine.data.I_XXC_MBXSLL_FS38ZU;
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.ProgramNameM1id)) StreamController.ProgramNameM1 = pStreamResponseLine.data.I_XXC_MBXSLL_UKZVHZ;
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.Z1AxisTemperatureM1id)) StreamController.Z1AxisTemperatureM1 = pStreamResponseLine.data.I_XXC_MBXSLL_66SZ4X;
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.Z1AxisEngineIntensityM1id)) StreamController.Z1AxisEngineIntensityM1 = pStreamResponseLine.data.I_XXC_MBXSLL_V3TRK1;
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.Z2AxisTemperatureM1id)) StreamController.Z2AxisTemperatureM1 = pStreamResponseLine.data.I_XXC_MBXSLL_ARKS8V;
		        if (pStreamResponseLine.data.hasOwnProperty(AppConfiguration.Z2AxisEngineIntensityM1id)) StreamController.Z2AxisEngineIntensityM1 = pStreamResponseLine.data.I_XXC_MBXSLL_68SBRS;

		        // MACHINE 2 - TODO: Poner en las demás también que pille dle AppConfiguration
		        if (pStreamResponseLine.data.hasOwnProperty("I_CMS_LJ3Z4P_AW8HY7")) StreamController.ExecutionStateM2 = pStreamResponseLine.data.I_CMS_LJ3Z4P_AW8HY7;
		        if (pStreamResponseLine.data.hasOwnProperty("I_CMS_LJ3Z4P_FS38ZU")) StreamController.StreamControllerModeM2 = pStreamResponseLine.data.I_CMS_LJ3Z4P_FS38ZU;
		        if (pStreamResponseLine.data.hasOwnProperty("I_CMS_LJ3Z4P_UKZVHZ")) StreamController.ProgramNameM2 = pStreamResponseLine.data.I_CMS_LJ3Z4P_UKZVHZ;
		        if (pStreamResponseLine.data.hasOwnProperty("I_CMS_LJ3Z4P_66SZ4X")) StreamController.Z1AxisTemperatureM2 = pStreamResponseLine.data.I_CMS_LJ3Z4P_66SZ4X;
		        if (pStreamResponseLine.data.hasOwnProperty("I_CMS_LJ3Z4P_V3TRK1")) StreamController.Z1AxisEngineIntensityM2 = pStreamResponseLine.data.I_CMS_LJ3Z4P_V3TRK1;
		        if (pStreamResponseLine.data.hasOwnProperty("I_CMS_LJ3Z4P_ARKS8V")) StreamController.Z2AxisTemperatureM2 = pStreamResponseLine.data.I_CMS_LJ3Z4P_ARKS8V;
		        if (pStreamResponseLine.data.hasOwnProperty("I_CMS_LJ3Z4P_68SBRS")) StreamController.Z2AxisEngineIntensityM2 = pStreamResponseLine.data.I_CMS_LJ3Z4P_68SBRS;
*/
		        // MACHINE 3
				//console.log("StreamResponse.data: " + JSON.stringify(pStreamResponseLine.data));
		        if (pStreamResponseLine.data.hasOwnProperty("I_CMX_LQLS26_AW8HY7")) StreamController.ExecutionStateM3 = pStreamResponseLine.data.I_CMX_LQLS26_AW8HY7;
		        if (pStreamResponseLine.data.hasOwnProperty("I_CMX_LQLS26_FS38ZU")) StreamController.ControllerModeM3 = pStreamResponseLine.data.I_CMX_LQLS26_FS38ZU;
		        if (pStreamResponseLine.data.hasOwnProperty("I_CMX_LQLS26_UKZVHZ")) StreamController.ProgramNameM3 = pStreamResponseLine.data.I_CMX_LQLS26_UKZVHZ;
		        if (pStreamResponseLine.data.hasOwnProperty("I_CMX_LQLS26_66SZ4X")) StreamController.Z1AxisTemperatureM3 = pStreamResponseLine.data.I_CMX_LQLS26_66SZ4X;
		        if (pStreamResponseLine.data.hasOwnProperty("I_CMX_LQLS26_V3TRK1")) StreamController.Z1AxisEngineIntensityM3 = pStreamResponseLine.data.I_CMX_LQLS26_V3TRK1;
		        if (pStreamResponseLine.data.hasOwnProperty("I_CMX_LQLS26_ARKS8V")) StreamController.Z2AxisTemperatureM3 = pStreamResponseLine.data.I_CMX_LQLS26_ARKS8V;
		        if (pStreamResponseLine.data.hasOwnProperty("I_CMX_LQLS26_68SBRS")) StreamController.Z2AxisEngineIntensityM3 = pStreamResponseLine.data.I_CMX_LQLS26_68SBRS;

			}

		});
	}
}
