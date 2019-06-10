$(document).ready(function() {

	var baseConfig = {
		chart: {
			zoomType: false,
			animation: false
		},
		xAxis: {
			type: 'datetime',
			visible: false
		},
		yAxis:{
			// Quitar rayas horizontales del eje y
			gridLineWidth: 0,
			title: {
				text: null
			}
		},
		boost: {
  	      useGPUTranslations: true
  	    },
		time: {
			useUTC: false
		},
		tooltip: {
			enabled: false,
			headerFormat: '<b>{series.name}</b><br/>',
			pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
		},
		lang: {
			noData: "Machine with no data"
		},
		noData: {
			style: {
				fontWeight: 'bold',
				fontFamily: 'Calibri',
				fontSize: '35px',
				color: '#6AC259'
			}
		},
		plotOptions: {
			series: {
				lineWidth: 1,
					states: {
						inactive: {
							opacity: 1
					}
				},
				// Quitar el clic en la leyenda para ocultar
				events: {
					legendItemClick: function() {
					  return false;
					}
				}
			},
		},
		series: [
			{
				/*
				######################################################
				##################### 0 - PUNTITOS ###################
				###################################################### */
				type: 'scatter',
				name: 'aggregated value',
				data: [],
				color: '#000000',
				marker: {radius: 3},
				lineWidth: 0,
				showInLegend: false,
				states: { hover: { enabled: false } }
			},
			{
				/*
				######################################################
				########### 1 - ROJO ARRIBA - PLUS_SQRT20 ############
				###################################################### */
				type: 'line',
				name: 'avg + sqrt(20)*stdev',
				data: [],
				color: '#FF3333',
				marker: {enabled: false},
				showInLegend: false,
				states: { hover: { enabled: false } }
			},
			{
				/*
				######################################################
				############ 2 - ROJO ABAJO - MINUS_SQRT20 ###########
				###################################################### */
				type: 'line',
				name: 'avg - sqrt(20)*stdev ',
				data: [],
				color: '#FF3333',
				marker: {enabled: false},
				showInLegend: false,
				states: { hover: { enabled: false } }
			},
			{
				/*
				######################################################
				########## 3 - AMARILLO ARRIBA - PLUS_SQRT10 #########
				###################################################### */
				type: 'line',
				name: 'avg + sqrt(10)*stdev',
				data: [],
				color: '#FFC805',
				marker: {enabled: false},
				showInLegend: false,
				states: { hover: { enabled: false } }
			},
			{
				/*
				######################################################
				######### 4 - AMARILLO ABAJO - MINUS_SQRT10 ##########
				###################################################### */
				type: 'line',
				name: 'avg - sqrt(10)*stdev',
				data: [],
				color: '#FFC805',
				marker: {enabled: false},
				showInLegend: false,
				states: { hover: { enabled: false } }
			},
			{
				/*
				######################################################
				############# 5 - VERDE ARRIBA - PLUS_TWO ############
				###################################################### */
				type: 'line',
				name: 'avg + 2*stdev',
				data: [],
				color: '#4CA64C',
				marker: {enabled: false},
				showInLegend: false,
				states: { hover: { enabled: false } }
			},
			{
				/*
				######################################################
				############ 6 - VERDE ABAJO - MINUS_TWO #############
				###################################################### */
				type: 'line',
				name: 'avg - 2*stdev',
				data: [],
				color: '#4CA64C',
				marker: {enabled: false},
				showInLegend: false,
				states: { hover: { enabled: false } }
			},
			{
				/*
				######################################################
				################### 7 - AZUL - MEAN ##################
				###################################################### */
		        type: 'line',
		        name: 'average',
				data: [],
				color: '#2E2EFF',
				marker: {enabled: false},
				showInLegend: false,
				states: { hover: { enabled: false } }
		    }]
		}

	/* ########################  MACHINE 1 ######################## */
	$('#z1-temperature-graph-m1').highcharts($.extend(baseConfig));
	$('#z2-temperature-graph-m1').highcharts($.extend(baseConfig));
	$('#z1-intensity-graph-m1').highcharts($.extend(baseConfig));
	$('#z2-intensity-graph-m1').highcharts($.extend(baseConfig));

	/* ########################  MACHINE 2 ######################## */
	$('#z1-temperature-graph-m2').highcharts($.extend(baseConfig));
	$('#z2-temperature-graph-m2').highcharts($.extend(baseConfig));
	$('#z1-intensity-graph-m2').highcharts($.extend(baseConfig));
	$('#z2-intensity-graph-m2').highcharts($.extend(baseConfig));

	/* ########################  MACHINE 3 ######################## */
	$('#z1-temperature-graph-m3').highcharts($.extend(baseConfig));
	$('#z2-temperature-graph-m3').highcharts($.extend(baseConfig));
	$('#z1-intensity-graph-m3').highcharts($.extend(baseConfig));
	$('#z2-intensity-graph-m3').highcharts($.extend(baseConfig));
});

/**
* Adds data to an already existing graph
* @param id: div id to print the graph
* @param name: name of the variable
* @param serie_number: graph serie number
* @param value: value to add to the serie
* @param timestamp: timestamp to add to the serie
*/
function addDataToGraph (id, name, serie_number, value, timestamp)
{
	// It has to be x and y
	x = timestamp
	y = value

	// Get the chart via id of the chart
	var chart = $("#" + id).highcharts();

	// Get the proper serie for the given serie_number
	var series = chart.series[serie_number];

	// As it has value, we show the legend and the x axis line
	series.update({showInLegend: true,});
	chart.xAxis[0].update({visible: true});

	// Dots - Are printed with format [x,y]
	if (serie_number = 0) {
		series.addPoint([x, y]);
	// Bars - Are printed with format {x,y}
	} else {
		series.addPoint({x, y});
	}
	// Removes zoom
	chart.zoom();
}

/**
* Prints graphs and change the data name for a given name
* @param indicator_name: Indicator name
* @param timestamp: Timestamp
* @param avg: Average value
* @param std_dev: Standard derivation value
* @param observation: Observation value
* @param machineNumber: Machine number
*/
function calculateValue(indicator_name, timestamp, avg, std_dev, observation, machineNumber)
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
