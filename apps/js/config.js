var AppConfiguration = {

  // admin - ditas
  AppUser: "c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec",
  AppPassword: "260179d083fc875f132b1be295913e26070c76f677609796b73f09ae3f0dc7f8073a999e26a189a87e362a960b6b1288817a452b4ae697d3971327a589615bfb",

  // DAL endpoints:
  GetSimplifiedDiagnosticURL: "http://212.8.121.134:30000/caf/GetSimplifiedDiagnostic",
  GetFullDiagnosticURL: "http://212.8.121.134:30000/caf/GetFullDiagnostic",
  GetStreamingDataURL: "http://212.8.121.134:30000/caf/GetStreamingData",

  // Keycloak
  KeycloakURL: "https://153.92.30.56:58080",
  KeycloakRealm : "288",
  KeycloackClientID : "vdc_client",

  // Machine ID to call
  machineIds: {
      Kelly: 'XXC_MBXSLL',
      Slater: 'CMS_LJ3Z4P',
      Zack: 'CMX_LQLS26'
  },

  // Call and print GetFullDiagnostic
  CallAndPrintDiagnosticValuesInterval: 30000,

  // Interval to get the values from GetStreamingData
  GetStreamValuesInterval: 2000,

  // Execution state ID mapping
  ExecutionState: {
	  "interrupted" : 1,
	  "stopped" : 2,
	  "in progress" : 3,
	  "waiting" : 4,
	  "aborted" : 5
  },

  // Controller mode ID mapping
  ControllerMode: {
	  "JOG": 0,
	  "MDI": 1,
	  "AUTO": 2
  },

  // Ids for Machine 1
  ExecutionStateM1id : "I_XXC_MBXSLL_AW8HY7",
  ControllerModeM1id : "I_XXC_MBXSLL_FS38ZU",
  ProgramNameM1id : "I_XXC_MBXSLL_UKZVHZ",
  Z1AxisTemperatureM1id : "I_XXC_MBXSLL_66SZ4X",
  Z1AxisEngineIntensityM1id : "I_XXC_MBXSLL_V3TRK1",
  Z2AxisTemperatureM1id : "I_XXC_MBXSLL_ARKS8V",
  Z2AxisEngineIntensityM1id : "I_XXC_MBXSLL_68SBRS",

  // Ids for Machine 2
  ExecutionStateM2id : "I_CMS_LJ3Z4P_AW8HY7",
  ControllerModeM2id : "I_CMS_LJ3Z4P_FS38ZU",
  ProgramNameM2id : "I_CMS_LJ3Z4P_UKZVHZ",
  Z1AxisTemperatureM2id : "I_CMS_LJ3Z4P_66SZ4X",
  Z1AxisEngineIntensityM2id : "I_CMS_LJ3Z4P_V3TRK1",
  Z2AxisTemperatureM2id : "I_CMS_LJ3Z4P_ARKS8V",
  Z2AxisEngineIntensityM2id : "I_CMS_LJ3Z4P_68SBRS",

  // Ids for Machine 3
  ExecutionStateM3id : "I_CMX_LQLS26_AW8HY7",
  ControllerModeM3id : "I_CMX_LQLS26_FS38ZU",
  ProgramNameM3id : "I_CMX_LQLS26_UKZVHZ",
  Z1AxisTemperatureM3id : "I_CMX_LQLS26_66SZ4X",
  Z1AxisEngineIntensityM3id : "I_CMX_LQLS26_V3TRK1",
  Z2AxisTemperatureM3id : "I_CMX_LQLS26_ARKS8V",
  Z2AxisEngineIntensityM3id : "I_CMX_LQLS26_68SBRS"
}
