$(document).ready(function() {

  var baseConfig = {
      chart: {
          type: 'area',
		  zoomType: 'x',
          animation: Highcharts.svg, // don't animate in old IE
          marginRight: 10,
          events: {
              load: function () {
                  var ind1serie = this.series[0];
              }
          }
      },
	  boost: {
	      useGPUTranslations: true
	    },
      time: {
          useUTC: false
      },

      title: {
  		// Titulo de arriba
          text: ''
      },
      xAxis: {
          type: 'datetime',
          tickPixelInterval: 150
      },
      yAxis: {
          title: {
  			// Titulo del eje vertical
              text: ''
          },
		  max: 220,
          plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
          }]
      },
      tooltip: {
          headerFormat: '<b>{series.name}</b><br/>',
          pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}',
      },
      legend: {
          enabled: true
      },
      exporting: {
          enabled: false
      },
  	credits: {
  		enabled: false
  	},
	plotOptions:{
		series:{
			 //turboThreshold:50000,
			 lineWidth: 0.2,
			 fillOpacity: 0.5,
		},
		area: {
			marker: {
				enabled: false
			}
		}
	},
	lang: {
		noData: "Machine with no anomalies"
	},
	noData: {
		style: {
			fontWeight: 'bold',
			 fontFamily: 'Helvetica',
			fontSize: '35px',
			color: '#6AC259'
		}
	},

	series: [

  		{
          showInLegend: false,
		  states: {
			hover: {
				enabled: false
			}
		},
		data: []
			/*
		  (function () {
              var data = [],
                  time = (new Date()).getTime(),
                  i;
              for (i = -10; i <= 0; i += 1) {
                  data.push({
                      x: time + i * 1000,
                      y: Math.random()
                  });
              }
              console.log(data);
              return data;
          }())
*/
  		}

  	]

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

  if(DiagnosticController.Z1AxisTemperature === null){ //or empty or whataver
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
*/
function printGraphDueToAnomaly()
{
	printGraph('z1-temperature-graph-m3', "Z1 temperature", DiagnosticController.Z1AxisTemperature);
	printGraph('z2-temperature-graph-m3', "Z2 temperature", DiagnosticController.Z2AxisTemperature);
	printGraph('z1-intensity-graph-m3', "Z1 intensity", DiagnosticController.Z1AxisIntensity);
	printGraph('z2-intensity-graph-m3', "Z2 intensity", DiagnosticController.Z2AxisIntensity);
}

/**
* Machine status is ok, we dont show any data
*/
function removeGraph()
{
	printGraph('z1-temperature-graph-m3', []);
}
