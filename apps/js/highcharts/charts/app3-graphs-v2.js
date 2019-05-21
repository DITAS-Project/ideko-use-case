$(document).ready(function() {

  var baseConfig = {
	  chart: {
  	  zoomType: 'x'
    },
      xAxis: {
          min: -0.5,
          max: 5.5
      },
  	xAxis: {
          type: 'datetime'
      },
  	time: {
  		useUTC: false
  	},
  	tooltip: {
  		headerFormat: '<b>{series.name}</b><br/>',
  		pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
  	},
      title: {
          text: 'Gráfico combinado'
      },
      series: [
  		{
  			/*
  			######################################################
  			##################### 0 - PUNTITOS ###################
  			###################################################### */
  			type: 'scatter',
  			name: 'Aggregated value',
  			data: [],
  			color: '#000000',
  			marker: {
  				radius: 4
  			}
  		},
  		{
  			/*
  			######################################################
  			########### 1 - ROJO ARRIBA - PLUS_SQRT20 ############
  			###################################################### */
  			type: 'line',
  			name: '(rojo-arriba) avg + sqrt(20)*stdev',
  			data: [],
  			color: '#FF3333',
  		},
  		{
  			/*
  			######################################################
  			############ 2 - ROJO ABAJO - MINUS_SQRT20 ###########
  			###################################################### */
  			type: 'line',
  			name: '(rojo-abajo) avg - sqrt(20)*stdev ',
  			data: [],
  			color: '#FF3333',
  		},
  		{
  			/*
  			######################################################
  			########## 3 - AMARILLO ARRIBA - PLUS_SQRT10 #########
  			###################################################### */
  			type: 'line',
  			name: '(amarillo-arriba) avg + sqrt(10)*stdev',
  			data: [],
  			color: '#FFC805',
  		},
  		{
  			/*
  			######################################################
  			######### 4 - AMARILLO ABAJO - MINUS_SQRT10 ##########
  			###################################################### */
  			type: 'line',
  			name: '(amarillo-abajo) avg - sqrt(10)*stdev',
  			data: [],
  			color: '#FFC805',
  		},
  		{
  			/*
  			######################################################
  			############# 5 - VERDE ARRIBA - PLUS_TWO ############
  			###################################################### */
  			type: 'line',
  			name: '(verde-arriba) avg + 2*stdev',
  			data: [],
  			color: '#4CA64C',
  		},
  		{
  			/*
  			######################################################
  			############ 6 - VERDE ABAJO - MINUS_TWO #############
  			###################################################### */
  			type: 'line',
  			name: '(verde-abajo) avg - 2*stdev',
  			data: [],
  			color: '#4CA64C',
  		},
  		{
  			/*
  			######################################################
  			################### 7 - AZUL - MEAN ##################
  			###################################################### */
  	        type: 'line',
  	        name: '(azul) - avg)',
  			data: [],
  			color: '#2E2EFF',
  	    }]
}

  /* #############################################################################
  ################################  MACHINE 1 ####################################
  ################################################################################ */
  $('#z1-temperature-graph-m1').highcharts($.extend(baseConfig));
  $('#z2-temperature-graph-m1').highcharts($.extend(baseConfig));
  $('#z1-intensity-graph-m1').highcharts($.extend(baseConfig));
  $('#z2-intensity-graph-m1').highcharts($.extend(baseConfig));

	/*
	// New 2019
	// Si se quiere controlar el printaje de aquí, cada segundo printar los resultados
	setInterval(function(){
		printMachineNewGraph(1)
	}, 1000);
	*/

  /* #############################################################################
  ################################  MACHINE 2 ####################################
  ################################################################################ */
  $('#z1-temperature-graph-m2').highcharts($.extend(baseConfig));
  $('#z2-temperature-graph-m2').highcharts($.extend(baseConfig));
  $('#z1-intensity-graph-m2').highcharts($.extend(baseConfig));
  $('#z2-intensity-graph-m2').highcharts($.extend(baseConfig));

	/*
	// New 2019
	setInterval(function(){
		printMachineNewGraph(2)
	}, 1000);
	*/

  /* #############################################################################
  ################################  MACHINE 3 ####################################
  ################################################################################ */
  $('#z1-temperature-graph-m3').highcharts($.extend(baseConfig));
  $('#z2-temperature-graph-m3').highcharts($.extend(baseConfig));
  $('#z1-intensity-graph-m3').highcharts($.extend(baseConfig));
  $('#z2-intensity-graph-m3').highcharts($.extend(baseConfig));

	/*
	// New 2019
	setInterval(function(){
		printMachineNewGraph(3)
	}, 1000);
	*/
});

/**
* Prints graphs and change the data name for a given name
* @param id: div id to print the graph
* @param name: name of the variable
* @param data: data to post
*/
function printGraph(id, name, data)
{
	var chart = $("#" + id).highcharts();
	var series = chart.series[0];
	series.setData(data);

	// Change series name
	chart.series[0].update({name:name}, false);

	// Removes zoom
	chart.zoom();

	// Redraws chart
	chart.redraw();
}

/**
* Anomally has happen, we print the graphs
* @param machineNumber: number of the machine (1, 2 or 3)
*/
function printGraphDueToAnomaly(machineNumber)
{
	// For each graph (4 for each machine), we print the points
	printGraph('z1-temperature-graph-m' + machineNumber, "Z1 temperature", eval("DiagnosticController.Z1AxisTemperatureM" + machineNumber));
	printGraph('z2-temperature-graph-m' + machineNumber, "Z2 temperature", eval("DiagnosticController.Z2AxisTemperatureM" + machineNumber));
	printGraph('z1-intensity-graph-m' + machineNumber, "Z1 intensity", eval("DiagnosticController.Z1AxisIntensityM" + machineNumber));
	printGraph('z2-intensity-graph-m' + machineNumber, "Z2 intensity", eval("DiagnosticController.Z2AxisIntensityM" + machineNumber));
}


/**
* Machine status is ok, we dont show any data
* @param machineNumber: number of the machine (1, 2 or 3)
*/
function removeGraph(machineNumber)
{
	// For each graph (4 for each machine), we send empty data to remove the graph content
	printGraph('z1-temperature-graph-m' + machineNumber, []);
	printGraph('z2-temperature-graph-m' + machineNumber, []);
	printGraph('z1-intensity-graph-m' + machineNumber, []);
	printGraph('z2-intensity-graph-m' + machineNumber, []);
}

/*
################################################################################################################################################
################################################################################################################################################
######################################################## NEW CODE WITH NEW GRAPHS ##############################################################
################################################################################################################################################
################################################################################################################################################
*/

/**
* Prints graphs and change the data name for a given name
* @param id: div id to print the graph
* @param name: name of the variable
* @param serie_number: graph serie number
* @param value: value to add to the serie
* @param timestamp: timestamp to add to the serie

*/
function addDataToGraph (id, name, serie_number, value, timestamp)
{
	var chart = $("#" + id).highcharts();

	// Get the proper serie for the given serie_number
	var series = chart.series[serie_number];

	// Dots - Are printed with format [x,y]
	if (serie_number = 0) {
		series.addPoint([timestamp, value]);
	// Bars - Are printed with format {x,y}
	} else {
		series.addPoint({timestamp, value});
	}

	// Change series name
	// TODO: Check if this works with the new chart configuration
	chart.series[serie_number].update({name:name}, false);

	// Removes zoom
	chart.zoom();

	// TODO: I think this is not neccesary
	//chart.redraw();
}

// TODO: setData([]) to each machine
function cleanGraph(id, machineNumber)
{
	var chart = $("#" + id).highcharts();
	var series = chart.series[0];
	series.setData(data);

	// 0, 1, 2, 3, 4, 5, 6, 7
	for (number in [...Array(8).keys()])
	{
		var series = chart.series[number];
		series.setData([parseInt(number)]);
	}

	// Removes zoom
	chart.zoom();

	// TODO: I think this is not neccesary
	//chart.redraw();
}

// TODO: Still check how to do this - machineNumber?
// Renombar esta funcón a 'printMachineNewGraph(machineNumner)'.
// El timer de aquí abajo iría arriba por cada máquina
// 		function printMachineNewGraph(machineNumner) {
setInterval(function(){

	// Get values from parameters
	timestamp = eval("DiagnosticController.TIMESTAMP_M" + machineNumber)
	indicator = eval("DiagnosticController.INDICATOR_M" + machineNumber)
	aggregated = eval("DiagnosticController.AGGREGATED_M" + machineNumber)
	plus_sqrt20 = eval("DiagnosticController.PLUS_SQRT20_M" + machineNumber)
	minus_sqrt20 = eval("DiagnosticController.MINUS_SQRT20_M" + machineNumber)
	plus_sqrt10 = eval("DiagnosticController.PLUS_SQRT10_M" + machineNumber)
	minus_sqrt10 = eval("DiagnosticController.MINUS_SQRT10_M" + machineNumber)
	plus_two = eval("DiagnosticController.PLUS_TWO_M" + machineNumber)
	minus_two = eval("DiagnosticController.MINUS_TWO_M" + machineNumber)
	mean = eval("DiagnosticController.MEAN_M" + machineNumber)

	// Z1 Temperature
	if (indicator === "Z1AxisTemperature")
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
	else if (indicator === "Z2AxisTemperature")
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
	else if (indicator === "Z1AxisIntensity")
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
	else if (indicator === "Z2AxisIntensity")
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
}, 1000);
