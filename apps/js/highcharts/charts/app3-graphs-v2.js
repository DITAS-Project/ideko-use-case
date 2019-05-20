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
  			name: 'Observations',
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

  //printGraph('z1-temperature-graph-m1',[{x: 1550051320298, y: 5}, {x: 1550051462000, y: 10}]);
  //printGraph('z2-temperature-graph-m1',[{x: 1550051320298, y: 10}, {x: 1550051462000, y: -5}]);
  //printGraph('z1-intensity-graph-m1',[{x: 1550051320298, y: 10}, {x: 1550051462000, y: 20}]);
  //printGraph('z2-intensity-graph-m1',[{x: 1550051320298, y: 10}, {x: 1550051462000, y: 20}]);


  /* #############################################################################
  ################################  MACHINE 2 ####################################
  ################################################################################ */
  $('#z1-temperature-graph-m2').highcharts($.extend(baseConfig));
  $('#z2-temperature-graph-m2').highcharts($.extend(baseConfig));
  $('#z1-intensity-graph-m2').highcharts($.extend(baseConfig));
  $('#z2-intensity-graph-m2').highcharts($.extend(baseConfig));

  //printGraph('z1-temperature-graph-m2',[{x: 1550051320298, y: 10}, {x: 1550051462000, y: 20}]);
  //printGraph('z2-temperature-graph-m2',[{x: 1550051320298, y: 10}, {x: 1550051462000, y: 20}]);
  //printGraph('z1-intensity-graph-m2',[{x: 1550051320298, y: 10}, {x: 1550051462000, y: 20}]);
  //printGraph('z2-intensity-graph-m2',[{x: 1550051320298, y: 10}, {x: 1550051462000, y: 20}]);

/*
  ################################################################################
  ################################  MACHINE 3 ####################################
  ################################################################################ */
  $('#z1-temperature-graph-m3').highcharts($.extend(baseConfig));
  $('#z2-temperature-graph-m3').highcharts($.extend(baseConfig));
  $('#z1-intensity-graph-m3').highcharts($.extend(baseConfig));
  $('#z2-intensity-graph-m3').highcharts($.extend(baseConfig));

 // printGraph('z1-temperature-graph-m3',[{x: 1550051320298, y: 10}, {x: 1550051462000, y: 20}]);
 // printGraph('z2-temperature-graph-m3',[{x: 1550051320298, y: 10}, {x: 1550051462000, y: 20}]);
 // printGraph('z1-intensity-graph-m3',[{x: 1550051320298, y: 10}, {x: 1550051462000, y: 20}]);
 // printGraph('z2-intensity-graph-m3',[{x: 1550051320298, y: 10}, {x: 1550051462000, y: 20}]);

  // TODO: No se por qué esto está aquí
  if (DiagnosticController.Z1AxisTemperature === null) { //or empty or whataver
 	 console.log("ES NULL");
      $('#z1-temperature-graph-m1').hide();
  }

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
