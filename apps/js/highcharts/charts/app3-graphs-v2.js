$(document).ready(function() {

	var baseConfig = {
		chart: {
			zoomType: 'x',
			    animation: false
		},
		xAxis: {
			type: 'datetime'
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
			// Probar esto bien
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
				fontFamily: 'Helvetica',
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
				name: 'Aggregated value',
				data: [],
				color: '#000000',
				marker: {radius: 3},
				lineWidth: 0,
				states: { hover: { enabled: false } }
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
				marker: {enabled: false},
				states: { hover: { enabled: false } }
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
				marker: {enabled: false},
				states: { hover: { enabled: false } }
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
				marker: {enabled: false},
				states: { hover: { enabled: false } }
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
				marker: {enabled: false},
				states: { hover: { enabled: false } }
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
				marker: {enabled: false},
				states: { hover: { enabled: false } }
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
				marker: {enabled: false},
				states: { hover: { enabled: false } }
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
				marker: {enabled: false},
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

	var chart = $("#" + id).highcharts();

	// Get the proper serie for the given serie_number
	var series = chart.series[serie_number];

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
}
