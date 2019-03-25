$(document).ready(function() {

  var baseConfig = {
    title: {
      text: '',
      align: 'left',
      margin: 0,
    },
    chart: {
      type: 'bar',
      /*
      events: {
        load: function() {
            var series = this.series[1];
            setInterval(function() {
              newRandomValue = Math.random()*100;
                  series.setData([{
                      y: newRandomValue
                    }]);
            }, 1000);
         }
      },
      */
      height: 20,
      backgroundColor: null,
      margin: [0, 0, 0, 0],
      credits: false,
      tooltip: false,
      legend: false,
    },
	boost: {
			useGPUTranslations: true
		},
    credits: {
          enabled: false
    },
    navigation: {
      buttonOptions: {
        enabled: false
      }
    },
    xAxis: {
      visible: false,
    },
    yAxis: {
      visible: false,
      min: 0,
      max: 30,
    },
    plotOptions: {
      series: {
          borderRadius: 5
      }
  },
    series: [{
      data: [100],
      grouping: false,
      animation: false,
      enableMouseTracking: false,
      showInLegend: false,
      color: '#e5e5e5',
      pointWidth: 30,
      borderWidth: 0,
      borderRadiusTopLeft: '4px',
      borderRadiusTopRight: '4px',
      borderRadiusBottomLeft: '4px',
      borderRadiusBottomRight: '4px',
      dataLabels: {
        className: 'highlight',
        format: '150 / 600',
        enabled: false, // Muestra el valor al final
        align: 'right',
        style: {
          color: 'white',
          textOutline: false,
        }
      }
    }, {
      enableMouseTracking: false,
      data: [0], // Dato inicial
      borderRadiusBottomLeft: '4px',
      borderRadiusBottomRight: '4px',
      color: '#6ff0ce',
      borderWidth: 0,
      pointWidth: 25,
      animation: {
        duration: 250,
      },
	  dataLabels: {
        enabled: true, // Muestra el valor al principio
        inside: true,
        align: 'left',
        format: '{point.y}',
        style: {
          color: '#5A5752',
		  fontSize: "9px",
          textOutline: false,
        }
      }
    }]
  };

    /* #############################################################################
    ################################  MACHINE 1 ####################################
    ################################################################################ */

    $('#z1-intensity-bar-m1').highcharts($.extend(baseConfig));
    $('#z1-temperature-bar-m1').highcharts($.extend(baseConfig));
    $('#z2-intensity-bar-m1').highcharts($.extend(baseConfig));
    $('#z2-temperature-bar-m1').highcharts($.extend(baseConfig));

	printBars('z1-temperature-bar-m1', "Z1AxisTemperatureM1");
	printBars('z2-temperature-bar-m1',"Z2AxisTemperatureM1");
	printBars('z1-intensity-bar-m1',"Z1AxisEngineIntensityM1");
	printBars('z2-intensity-bar-m1',"Z2AxisEngineIntensityM1");

    /*
    // Set Z1 intensity bar data
    var z1IntensityChartm1 = $("#z1-intensity-bar-m1").highcharts();
    var z1IntensitySeriesm1 = z1IntensityChartm1.series[1];
    z1IntensitySeriesm1.setData([{y: 5}]);
    */

	document.getElementById("controller-mode-m1").innerHTML = "&nbsp";
	document.getElementById("execution-state-m1").innerHTML = "&nbsp";
	document.getElementById("program-name-m1").innerHTML = "&nbsp";

    /* #############################################################################
    ################################  MACHINE 2 ####################################
    ################################################################################ */

    $('#z1-intensity-bar-m2').highcharts($.extend(baseConfig));
    $('#z1-temperature-bar-m2').highcharts($.extend(baseConfig));
    $('#z2-intensity-bar-m2').highcharts($.extend(baseConfig));
    $('#z2-temperature-bar-m2').highcharts($.extend(baseConfig));

	printBars('z1-temperature-bar-m2', "Z1AxisTemperatureM2");
	printBars('z2-temperature-bar-m2',"Z2AxisTemperatureM2");
	printBars('z1-intensity-bar-m2',"Z1AxisEngineIntensityM2");
	printBars('z2-intensity-bar-m2',"Z2AxisEngineIntensityM2");

	document.getElementById("controller-mode-m2").innerHTML = "&nbsp";
	document.getElementById("execution-state-m2").innerHTML = "&nbsp";
	document.getElementById("program-name-m2").innerHTML = "&nbsp";

    /* #############################################################################
    ################################  MACHINE 3 ####################################
    ################################################################################ */

	$('#z1-temperature-bar-m3').highcharts($.extend(baseConfig));
	$('#z2-temperature-bar-m3').highcharts($.extend(baseConfig));
	$('#z1-intensity-bar-m3').highcharts($.extend(baseConfig));
	$('#z2-intensity-bar-m3').highcharts($.extend(baseConfig));

	// Print bars (temp/intensity)
	printBars('z1-temperature-bar-m3', "Z1AxisTemperatureM3");
	printBars('z2-temperature-bar-m3',"Z2AxisTemperatureM3");
	printBars('z1-intensity-bar-m3',"Z1AxisEngineIntensityM3");
	printBars('z2-intensity-bar-m3',"Z2AxisEngineIntensityM3");

	// Print string (controller / execution / program)
	printStrings("controller-mode-m3", "ControllerModeM3", AppConfiguration.ControllerMode);
	printStrings("execution-state-m3", "ExecutionStateM3", AppConfiguration.ExecutionState);
	printStrings("program-name-m3", "ProgramNameM3");

	// Prints the machine status (left green/yellow/red icon)
	printMachineStatus(3);

});

/**
* Gets the real name from a ExecutionState o ControllerMode givena numeric value
* @param obj: dictionary object
* @param val: numeric value
* @return string with the real name of the ExecutionState or ControllerMode
*/
const getRealNames = (obj,val) => Object.keys(obj).find(key => obj[key] === val);

/**
* Prints bars for temperature and intensity
* @param divId: div id name where the bar will be printed
* @param indicatorName: indicator name to be readen
*/
function printBars(divId, indicatorName)
{
	var series = $("#" + divId).highcharts().series[1];
	setInterval(function() {
		series.setData([{y:  Math.round(eval("StreamController." + indicatorName) * 100) / 100}]);
	}, AppConfiguration.GetStreamValuesInterval);
}

/**
* Prints different strings (controller / execution / program
* @param divId: div id name where the string will be printed
* @param indicatorName: indicator name to be readen
* @param dictionaryName: dictionary from the config file to map the numeric values
*/
function printStrings(idName, indicatorName, dictionaryName = null)
{
	setInterval(function() {
		if (dictionaryName) var realValue = getRealNames(dictionaryName, parseInt(eval("StreamController." + indicatorName)));
		else var realValue = eval("StreamController." + indicatorName);
		if (realValue) document.getElementById(idName).innerHTML = realValue.toUpperCase();
	}, AppConfiguration.GetStreamValuesInterval);
}

/**
* Prints the machine status
* @param machineNumber: Integer to identify the machine number
*/
function printMachineStatus(machineNumber)
{
DiagnosticController.StatusM3 = "ALERT";

	setInterval(function() {

	console.log("Getting values from variables every " + AppConfiguration.GetDiagnosticValuesInterval + " ms. The status is: " + eval("DiagnosticController.StatusM" + machineNumber) + ". Actual time: " + new Date(Date.now()).toLocaleTimeString());
		if (eval("DiagnosticController.StatusM" + machineNumber) === "ALERT" || eval("DiagnosticController.StatusM" + machineNumber) === "WARNING")
		{
			if (eval("DiagnosticController.StatusM" + machineNumber) === "ALERT") document.getElementById("machine-status-m" + machineNumber).className = "machine-error";
			else document.getElementById("machine-status-m" + machineNumber).className = "machine-warning";
			document.getElementById("machine-error-image-m" + machineNumber).className = "machine-error-x-image";
			document.getElementById("machine-error-image-m" + machineNumber).src = "images/cross.png";
			document.getElementById("machine-status-m" + machineNumber).style.setProperty("margin-top", "-27px");
			document.getElementById("machine-error-image-m" + machineNumber).style.setProperty("width", "18%");
			document.getElementById("machine-error-image-m" + machineNumber).style.setProperty("margin-top", "-27px");
			if (eval("DiagnosticController.StatusM" + machineNumber)) document.getElementById("machine-error-status-m" + machineNumber).innerHTML = eval("DiagnosticController.StatusM" + machineNumber);
			if (eval("DiagnosticController.MetricM" + machineNumber)) document.getElementById("machine-error-metric-m" + machineNumber).innerHTML = eval("DiagnosticController.MetricM" + machineNumber);
			if (eval("DiagnosticController.CauseM" + machineNumber)) document.getElementById("machine-error-message-m" + machineNumber).innerHTML = eval("DiagnosticController.CauseM" + machineNumber);
			if (eval("DiagnosticController.ValueM" + machineNumber)) document.getElementById("machine-error-value-m" + machineNumber).innerHTML = eval("DiagnosticController.ValueM" + machineNumber);
			if (eval("DiagnosticController.DateM" + machineNumber)) document.getElementById("machine-error-date-m" + machineNumber).innerHTML = "Date: " + dateMStoDateYYYYMMDD(eval("DiagnosticController.DateM" + machineNumber));

			// There's an anomaly! We print the graph
			printGraphDueToAnomaly();
		} else {
			document.getElementById("machine-status-m" + machineNumber).className = "machine-ok";
			document.getElementById("machine-status-m" + machineNumber).style.setProperty("margin-top", "-27px");
			document.getElementById("machine-error-image-m" + machineNumber).src = "images/checked-white.png";
			document.getElementById("machine-error-image-m" + machineNumber).className = "machine-noerror-v-image";
			document.getElementById("machine-error-image-m" + machineNumber).style.setProperty('width', '50%');
			document.getElementById("machine-error-image-m" + machineNumber).style.setProperty("padding-top", "22px");
			document.getElementById("machine-error-image-m" + machineNumber).style.setProperty("margin-top", "0px");
			document.getElementById("machine-error-status-m" + machineNumber).innerHTML = "";
			document.getElementById("machine-error-metric-m" + machineNumber).innerHTML = "";
			document.getElementById("machine-error-message-m" + machineNumber).innerHTML = "";
			document.getElementById("machine-error-value-m" + machineNumber).innerHTML = "";
			document.getElementById("machine-error-date-m" + machineNumber).innerHTML = "";

			// There's no anomaly, we remove the graph
			removeGraph();
		}
	}, AppConfiguration.GetDiagnosticValuesInterval);
}

/**
* Takes a date in timestamp (millisecond) format and coverts it to yyyy-mm-dd HH:mm:ss
* @param dateMs: date in ts millisecond
* @return parsedDate: Date in yyyy-mm-dd HH:mm:ss format
*/
function dateMStoDateYYYYMMDD(dateMs) {
	var myDate = new Date(dateMs);
	parsedDate = myDate.getFullYear() + '-' +('0' + (myDate.getMonth()+1)).slice(-2)+ '-' +  myDate.getDate() + ' '+myDate.getHours()+ ':'+('0' + (myDate.getMinutes())).slice(-2)+ ':'+myDate.getSeconds();
	return parsedDate;
}
