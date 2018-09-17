"use strict"; 

// Load options for a select dropdown with 'id' from dataUrl and set selectedOption
function loadSelect(id, selectedOption) {
	var selectDropdown = $('#'+ id);
	$.ajax({
		url: selectConfig[id].url,
		dataType: 'text',
		success: function(data) {
			data = JSON.parse(data).value;
			$.each(data, function(index, item) {
				selectDropdown.append("<option value='" + item.Key + "'>" + item.Title + "</option>");
			});
			// set default
			if(selectedOption != undefined) {
				selectDropdown.find('option[value=' + selectedOption.key + ']').prop('selected', true);
			} else if (selectConfig.selectedOptions[id] != undefined) {
				selectDropdown.find('option[value=' + selectConfig.selectedOptions[id].key + ']').prop('selected', true);
			}
		}
	});
}
// Default charts options, specific options like titles etc are set through chartsConfig
var defaultChartOptions = {
	chart: {
		// renderTo: container,
		type: 'spline',
		zoomType: 'x',
	},
	colors: ["#7cb5ec", "#434348", "#e85300", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"],
	// title: {
	// 	text: 'Aantal sterfgevallen per week'
	// },
	xAxis: {
		type: 'linear',
		title: {
			text: 'Week'
		},
		startOnTick: true,
		minTickInterval: 1,			
		allowDecimals: false,
		labels: {
			enabled: true,
			// rotation: 90,
			formatter: function () {
				// Use thousands separator for four-digit numbers too
				if ( (this.value / 100) >= 2000 && (this.value / 100) <= 2020 )  {
						// return Math.floor(this.value / 100) + ' ' +  this.value % 100
						return "'" + this.value.toString().substr(2,2) + ' <br/>' +  this.value % 100
				} 
				return label;
			}
		},
		// tickInterval: 10
	},
	yAxis: {
		title: {
			text: 'Aantal'
		}
	},
	legend: {
		enabled: true,
		align: 'right',
		layout: 'proximate'
	},
	tooltip: {
		// headerFormat: '<large>Weeknummer: <strong>{point.key}</strong></large><br>',
		shared: true,
		valueDecimals: 0,
	},

	plotOptions: {
		series: {
			marker: {
				radius: 2,
				symbol: 'circle'
			}
		}
	}
	// series: []
}

// Configuration for select dropdowns: data url, selected options by defalt
var selectConfig = {
	lftkls: {
		url: 'https://opendata.cbs.nl/ODataApi/odata/70895ned/LeeftijdOp31December'
	},
	gesl: {
		url: 'https://opendata.cbs.nl/ODataApi/odata/70895ned/Geslacht'
	},
	selectedOptions: { 
		lftkls: {
			key: 10000,
			name: 'Totaal alle leeftijden'
		},
		gesl: {
			key: 1100,
			name: 'Totaal mannen en vrouwen'
		},
		begin: {
			jaar: 2018,
			maand: 1,
			dag: 1
		},
		einde: {
			jaar: 2018,
			maand: 12,
			dag: 31
		}
	},

}

// chartsConfig 
var chartsConfig = {
	
	sterfte: {
		url: "https://opendata.cbs.nl/ODataApi/odata/70895ned/TypedDataSet?$filter=(Geslacht+eq+'gesl')+and+LeeftijdOp31December+eq+'lftkls'&$select=Perioden,Overledenen_1",
		chartOptions: { 
			// chart: { renderTo: 'sterfte' },
			title: { text: 'Aantal sterfgevallen per week' }, 
			subtitle: {	text: selectConfig.selectedOptions.gesl.name + ', ' + selectConfig.selectedOptions.lftkls.name },
			yAxis: {	title: { text: 'Aantal'	}}
		}
	},
	lucht: {
		url: 'https://api.luchtmeetnet.nl/station/measurement_data?station_id=170&component_id=2&start_date=beginJaar/01/01&end_date=eindeJaar/12/31&daily_averages=1',
		chartOptions: { 
			// chart: { renderTo: 'lucht' },
			title: { text: 'Fijnstof PM 2.5' }, 
			// subtitle: null, 
			yAxis: {	title: { text: 'μg/m3'	}}}
	},
	temperatuur: {
		url: '../knmi.php',
		chartOptions: { 
			// chart: { renderTo: 'temperatuur' },
			title: { text: 'Temperatuur' }, 
			// subtitle: null, 
			yAxis: {	title: { text: '°C'	}}
		}
	}
}

var dashboardCharts = {}, xAxisSettings = {};

// Code to run at page load: load select options, create (empty charts)
$(function () {
	// Fill select.jaar and set default values
	var today = new Date();
	for(var i = 2010	; i <= today.getFullYear(); i++){
		$('select.jaar').append("<option value='" + i + "'>" + i + "</option>")
	}
	if(selectConfig.selectedOptions.begin != undefined) {
		$('select#begin.jaar').find('option[value=' + selectConfig.selectedOptions.begin.jaar + ']').prop('selected', true);
	}
	if(selectConfig.selectedOptions.begin != undefined) {
		$('select#einde.jaar').find('option[value=' + selectConfig.selectedOptions.einde.jaar + ']').prop('selected', true);
	}
	
	// load options from selectConfig for sex and age classes
	$.each(selectConfig, function(key, item){
		if( $('#'+key).length )
		loadSelect(key);
	})

	// Dropdown events
	$('select').on('change', function () {	
		var selectId = this.id;

		if( this.selectedOptions.length > 0 ){
			if( $(this).hasClass('jaar') ){
				selectConfig.selectedOptions[selectId].jaar = Number(this.selectedOptions[0].value);

				// Update all charts
				getSterfte();
				getTemperature();
				getLucht();
			} else {
				selectConfig.selectedOptions[selectId].key = this.selectedOptions[0].value;
				selectConfig.selectedOptions[selectId].name = this.selectedOptions[0].text;

				// Only update sterfte for sex and age
				getSterfte();
			}
		}
	});

	// Set Highcharts general theme
	// Highcharts.setOptions(Highcharts.chartTheme);

	// Create charts from chartsConfig
	$.each(chartsConfig, function(key, item){
		dashboardCharts[key] = createChart(key, item.chartOptions);
	})
	// Bind events to sync interaction
	// bindEvents(); 

	// Trigger change event to load data and update charts
	$('#begin.jaar').trigger('change');


});

/* Create Highcharts charts possibly without series to create empty chart
// container: id of container to render chart
// options: chartOptions, merged with defaultChartOptions
*/
function createChart(id, options) {
	var chartOptions = $.extend(true, defaultChartOptions, options );
	var chartContainer = $('<div id="' + id + '" class="chart">')
                .appendTo('#chartsContainer')
								.highcharts( chartOptions );
								
	return chartContainer.highcharts();
	// new Highcharts.Chart( chartOptions );
}

/* Update chart
// chart: Highcharts.Chart object
// series: series (one) to add
// subtitle (optional): Update subtitle if present
*/
function updateChart(chart, series, subtitle) {
	console.log('update', series);
	var subTitle = null;

	// Remove this serie first
	if( series.id != undefined && chart.get(series.id) != undefined ){
		chart.get(series.id).remove();
	}
	// Test whether data is available and update series and subtitle accordingly
	if( series.data.length == undefined ){
		subTitle = { text: 'No data found' };
	} else {
		// Add series
		chart.addSeries(series, true);
	}
	// Update subtitle
	if( subtitle != undefined ){
		subTitle = { text: subtitle };
	}
	chart.setSubtitle( subTitle );

	if( chart.index == 0) {
		xAxisSettings = {
			min: chart.xAxis[0].dataMin,
			max: chart.xAxis[0].dataMax
		}
		$.each(dashboardCharts, function(index, chart) {
			chart.xAxis[0].setExtremes(xAxisSettings.min, xAxisSettings.max);
		})
	}
}

// Function to get Sterfte data and update chart
function getSterfte() {

	$.ajax({
		// statische URL voor de initiële view:
		url: chartsConfig['sterfte'].url.replace('gesl', selectConfig.selectedOptions.gesl.key).replace('lftkls', selectConfig.selectedOptions.lftkls.key),
		//dynamische URL die (zou moeten) reageren op de hierboven ge�nitialiseerde pulldown menu's:
		//url: "https://opendata.cbs.nl/ODataApi/odata/70895ned/TypedDataSet?$filter=(Geslacht+eq+'" + gesl2 + "')
		//                         +and+LeeftijdOp31December+eq+'" + lftkls2 + "'&$select=Perioden,Overledenen_1",
		// contains(Perioden,'W')
		dataType: 'text',
		success: function( data ) {
			data = JSON.parse(data).value;
			var weekNumber = -1, seriesData = [], vorigeWeek;

			// console.log(data);

			$.each(data, function(index, item) {
				/* Filter received data
				// - Only use Week data: Perioden contains W or X
				// - Only use data of selected years: begin.jaar <= year <= einde.jaar
				*/
				if( ( item.Perioden.indexOf('W') > 0 || item.Perioden.indexOf('X') >0 ) 
						&& ( Number(item.Perioden.substring(0,4)) >= selectConfig.selectedOptions.begin.jaar &&
						Number(item.Perioden.substring(0,4)) <= selectConfig.selectedOptions.einde.jaar )
					// ************ temp filter for weeks at start/end of year week <3 and week > 50
						// && ( Number(item.Perioden.substr(6,2)) < 2 || Number(item.Perioden.substr(6,2)) > 51 )
					){
						weekNumber = Number(item.Perioden.substring(0,4)) * 100 + Number(item.Perioden.substring(6,8));
						// Push time/period and data value
						seriesData.push([ weekNumber, Number(item.Overledenen_1) ]);
				}
			});	 
			// Merge orphans at start/end of year:  week 0/53
			seriesData = mergeWeekOrphans(seriesData)

			updateChart(dashboardCharts['sterfte'], { id: 'Sterfte', name: 'Sterfte', data: seriesData }
				, selectConfig.selectedOptions.gesl.name + ', ' + selectConfig.selectedOptions.lftkls.name );
			
		}
	});	
}

// Function to get Temparature data and update chart
function getTemperature(dataCol) {
	// dataCol: choose one of three dataCols: 1:Tmin, 2:Tgem, 3:Tmax
	var dataCols = {
		Tmin: 1, 
		Tgem: 2,
		Tmax: 3
	}
	// Get Temparature data through JS function KNMI/getTemperatureData
	var arrTemperature = getTemperatureData(selectConfig.selectedOptions.begin.jaar);
	// console.log('TEMPERATUUR', arrTemperature);
	$.each(dataCols, function(colName, dataCol){
		addTemparatureColumn(arrTemperature, colName, dataCol);
	})
}
// Add one datacolumn from temp array
function addTemparatureColumn (arrTemperature, colName, dataCol){
	var seriesData = [];
	var dataCol = dataCol || 2;

	// Process data array to seriesData array 
	arrTemperature.forEach( function(item, i, arr) {
		// Push time/period and data value to series as array
		seriesData.push([ item[0], item[dataCol] ] );
	})
	// Convert day values to week values
	seriesData = convertDayToWeekData(seriesData);

	updateChart(dashboardCharts['temperatuur'], { id: 'temp_'+dataCol, name: colName || 'Temperatuur '+dataCol	, data: seriesData } );
}



// Function to get Luchtkwaliteit data and update chart
function getLucht(component) {
	/*
	Luchtmeetnet: https://api.luchtmeetnet.nl/station/measurement_data?station_id=170&component_id=2&start_date=2018/05/01&end_date=2018/05/31&daily_averages=1
	baseURL: 			https://api.luchtmeetnet.nl/station/measurement_data
	Querystring:	station_id=170&component_id=2&start_date=2018/05/01&end_date=2018/05/31&daily_averages=1

	Response:
		PM25	{
			details	{…}
			measurements []
				0: {	
					validated:	0
					value:	3.75
					rounded:	4
					timestamp_measured:	2018-05-01 00:00
					expected:	0
				}
	*/
	component = component || 'PM25';
	var seriesData = [];

	$.ajax({
		// statische URL voor de initiële view:
		url: chartsConfig['lucht'].url.replace(/beginjaar/i,selectConfig.selectedOptions.begin.jaar)
				.replace(/eindejaar/i,selectConfig.selectedOptions.einde.jaar),   // Replace jaar with selected year
		//dynamische URL die (zou moeten) reageren op de hierboven ge�nitialiseerde pulldown menu's:
		
		dataType: 'text',
		success: function( data ) {
			var seriesData = [];
			
			// Check for data for requested component
			if( JSON.parse(data)[component] != undefined ){
				data = JSON.parse(data)[component].measurements;
				// console.log('LUCHT', data);
				
				// Convert JSON data to 2d-array with x,y-values
				$.each(data, function(index, item) {
					// Push point to series
					seriesData.push( [ item.timestamp_measured.replace(' 00:00',''), item.value ] );
				});	 
				// Convert day values to week values
				seriesData = convertDayToWeekData(seriesData);
			} else {
				// seriesData is empty array
			}
			// update chart with options: use yAxis=2	
			updateChart(dashboardCharts['lucht'], { id:'Lucht', name: 'Lucht', data: seriesData } );
			
		}
	});	
}

/* Converts array with (x,y) elements and x=date to array withx=YearWeek
// dayToUse: optional param indicates which day of the week to use
*/
function convertDayToWeekData(arrData, dayToUse) {
	dayToUse = dayToUse || 4 // default is mid of week (donderdag)
	var _MS_PER_DAY = 1000 * 60 * 60 * 24;

	return arrData.filter( function (item, index, arr){
		var date = new Date(item[0]);
		return date.getDay() == dayToUse;
	}).map( function (item, index, arr){
		var date = new Date(item[0]);
		var firstDayOfYear = new Date(date.getFullYear(), 0); // 1 jan: month=0
		var week = Math.floor((date - firstDayOfYear)/_MS_PER_DAY/7) +1;

		// console.log(date.toLocaleDateString("nl-NL"), 'week: ', week);
		return [ date.getFullYear() * 100 + week, item[1]];
	})
}

/* Merge week data items with items in next/prev year:
// week 0 -> merge with last item previous year
// week 53 -> merge with first item next year
// if next/pref does not exist: remove week 0/53
*/
function mergeWeekOrphans(arrData) {
// Week 0 will be added to previous week
							// 	console.log(item,  series[series.length-1]);
							// 	if( series[series.length-1] != undefined) {
							// 		series[series.length-1][1] += Number(item.Overledenen_1);
							// 	}
	return arrData.map( function (item, index, arr){
			// Week 0 will be added to previous week
			if( item[0] % 100 == 0 ){
				if( arr[index-1] != undefined ) {
					console.log('add', item, ' to', arr[index-1]);
					arr[index-1][1] += item[1];
				} 
			}
			if( item[0] % 100 == 53){
				if( arr[index+1] != undefined ) {
					console.log('add', item, ' to', arr[index+1]);
					arr[index+1][1] += item[1];
				} 
			}

			return item;
		}).filter( function (item, index, arr){
			return item[0] % 100 != 0 && item[0] % 100 != 53;
	})
	// .map( function (item, index, arr){
	// 	var date = new Date(item[0]);
	// 	var firstDayOfYear = new Date(date.getFullYear(), 0); // 1 jan: month=0
	// 	var week = Math.floor((date - firstDayOfYear)/_MS_PER_DAY/7) +1;

	// 	// console.log(date.toLocaleDateString("nl-NL"), 'week: ', week);
	// 	return [date.getFullYear().toString() + ('0'+ week).slice(-2), item[1]];
	// })
}