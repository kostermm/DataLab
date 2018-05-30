"use strict"; 


// Load options for a select dropdown with 'id' from dataUrl and set selectedOption
function loadSelect(id, selectedOption) {
	var selectDropdown = $('#'+ id);
	$.ajax({
		url: dataConfig[id].url,
		dataType: 'text',
		success: function(data) {
			data = JSON.parse(data).value;
			$.each(data, function(index, item) {
				selectDropdown.append("<option value='" + item.Key + "'>" + item.Title + "</option>");
			});
			// set default
			if(selectedOption != undefined) {
				selectDropdown.find('option[value=' + selectedOption.key + ']').prop('selected', true);
			} else if (selectedOptions[id] != undefined) {
				selectDropdown.find('option[value=' + selectedOptions[id].key + ']').prop('selected', true);
			}
		}
	});
}

var xCategories = [2017, 2018];
var defaultChartOptions = {
	chart: {
		// renderTo: container,
		type: 'spline',
		zoomType: 'x',
	},
	colors: categorie,
	title: {
		text: 'Aantal sterfgevallen per week'
	},
	xAxis: {
		type: 'category',
		title: {
			text: 'Week'
		},
		labels: {
			enabled: true,
			rotation: 90
		},
		tickInterval: 10
		// categories: xCategories,
	},
	yAxis: {
		title: {
			text: 'Aantal'
		}
	},
	legend: {
		enabled: false
	},
	tooltip: {
		// headerFormat: '<large>Weeknummer: <strong>{point.key}</strong></large><br>',
		shared: true,
		valueDecimals: 0,
	},
	series: []
}

function createChart(container, options) {
	var chartOptions = $.extend( defaultChartOptions, options, { chart: { renderTo: container}});

	Highcharts.setOptions(Highcharts.chartTheme);
	return new Highcharts.Chart( chartOptions );
}

function updateChart(chart, series, subtitle) {
			console.log('update', series);
			var oldSerie = [];

			// Remove this serie first
			if( series.id != undefined && chart.get(series.id) != undefined ){
				chart.get(series.id).remove();
			}
			// Update subtitle
			if( subtitle != undefined ){
				chart.setSubtitle({ text: subtitle });
			}
			// Add series again
			chart.addSeries(series, true);
}

// dataConfig 
var dataConfig = {
	lftkls: {
		url: 'https://opendata.cbs.nl/ODataApi/odata/70895ned/LeeftijdOp31December'
	},
	gesl: {
		url: 'https://opendata.cbs.nl/ODataApi/odata/70895ned/Geslacht'
	},
	sterfte: {
		url: "https://opendata.cbs.nl/ODataApi/odata/70895ned/TypedDataSet?$filter=(Geslacht+eq+'gesl')+and+LeeftijdOp31December+eq+'lftkls'&$select=Perioden,Overledenen_1"
	},
	lucht: {
		url: "https://api.luchtmeetnet.nl/station/measurement_data?station_id=170&component_id=2&start_date=beginJaar/01/01&end_date=eindeJaar/12/31&daily_averages=1"
	}
}
// default options
var selectedOptions = { 
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
		maand: 1,
		dag: 1
	}
}
var chartSterfte, chartTemperatuur, chartLucht;

$(function () {
	// Fill beginjaar and set default
	var today = new Date();
	for(var i = 2000	; i <= today.getFullYear(); i++){
		$('#beginjaar').append("<option value='" + i + "'>" + i + "</option>")
	}
	if(selectedOptions.begin != undefined) {
		$('#beginjaar').find('option[value=' + selectedOptions.begin.jaar + ']').prop('selected', true);
	}

	// Create chart
	chartSterfte = createChart('sterfte', {	subtitle: {	text: selectedOptions.gesl.name + ', ' + selectedOptions.lftkls.name }} );
	chartTemperatuur = createChart('temperatuur', { title: { text: 'Temperatuur' }, subtitle: null, yAxis: {	title: { text: '°C'	}}});
	chartLucht = createChart('lucht', { title: { text: 'PM25' }, subtitle: null, yAxis: {	title: { text: 'μg/m3'	}}});
	// bindEvents();

	// load options for select dropdown
	loadSelect('gesl');
	loadSelect('lftkls');

	// Dropdown events
	$('select').on('change', function () {	
		var selectId = this.id;

		if( this.selectedOptions.length > 0 ){
			if(selectId == 'beginjaar'){
				selectedOptions.begin.jaar = this.selectedOptions[0].value;

				// Update all charts
				getSterfte();
				getTemperature();
				getLucht();
			} else {
				selectedOptions[selectId].key = this.selectedOptions[0].value;
				selectedOptions[selectId].name = this.selectedOptions[0].text;

				// Update sterfte
				getSterfte();
			}
		}

		// $.each(chartSterfte.series, function() {
		// 	if(this != undefined) this.remove();
		// })


	});
	
	$('#beginjaar').trigger('change');
});

// Function to get Temparature data and update chart
function getTemperature(dataCol) {
	console.log('TEMPERATUUR', );
	var dataCol = dataCol || 2;
	var dataPoint = [], seriesData = [];

	var arrTemperature = getTemperatureData(selectedOptions.begin.jaar);

	arrTemperature.forEach( function(item, i, arr) {
		// clear dataPoint
		dataPoint = [];
		// Push period and data value
		dataPoint.push(item[0]);
		dataPoint.push(item[dataCol]);
		// Push point to series
		seriesData.push(dataPoint);
	})
	// Convert day values to week values
	seriesData = convertDayToWeekData(seriesData);
	
	updateChart(chartTemperatuur, { id: 'Temperatuur', name: 'Temperatuur', data: seriesData } );
}

function getSterfte() {

	$.ajax({
		// statische URL voor de initiële view:
		url: dataConfig['sterfte'].url.replace('gesl', selectedOptions.gesl.key).replace('lftkls', selectedOptions.lftkls.key),
		//dynamische URL die (zou moeten) reageren op de hierboven ge�nitialiseerde pulldown menu's:
		//url: "https://opendata.cbs.nl/ODataApi/odata/70895ned/TypedDataSet?$filter=(Geslacht+eq+'" + gesl2 + "')
		//                         +and+LeeftijdOp31December+eq+'" + lftkls2 + "'&$select=Perioden,Overledenen_1",
		// contains(Perioden,'W')
		dataType: 'text',
		success: function( data ) {
			data = JSON.parse(data).value;
			var xCategories = [], series = [];
			var vorigeWeek;

			console.log(data);

			$.each(data, function(index, item) {
				if( ( item.Perioden.indexOf('W') > 0 || item.Perioden.indexOf('X') >0 ) 
						&& ( Number(item.Perioden.substring(0,4)) >= selectedOptions.begin.jaar &&
						Number(item.Perioden.substring(0,4)) <= selectedOptions.einde.jaar )) {
							
							// console.log(item, data[index+1]);
							if( item.Perioden.indexOf('X') >0 ){
								// Week 0 will be added to previous week
								console.log(item,  series[series.length-1]);
								if( series[series.length-1] != undefined) {
									series[series.length-1][1] += Number(item.Overledenen_1);
								}
							} else if ( item.Perioden.indexOf('W101') >0 && 
									(series[series.length-1]!=undefined && series[series.length-1].indexOf('W153') >0)) {

								console.log(item,  series[series.length-1])
								
							} else {
								xCategories.push(item.Perioden.substring(6,8));
								series.push([(item.Perioden.substr(0,4)+item.Perioden.substr(6,2)), Number(item.Overledenen_1)]);
							}
				}
			});	 
			
			updateChart(chartSterfte, { id: 'Sterfte', name: 'Sterfte', data: series }
				, selectedOptions.gesl.name + ', ' + selectedOptions.lftkls.name );
			
		}
	});	
}

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
function getLucht(component) {

	component = component || 'PM25';

	var dataCol = dataCol || 2;
	var dataPoint = [], seriesData = [];

	$.ajax({
		// statische URL voor de initiële view:
		url: dataConfig['lucht'].url.replace(/beginjaar/i,selectedOptions.begin.jaar).replace(/eindejaar/i,selectedOptions.einde.jaar),   // Replace jaar with selected year
		//dynamische URL die (zou moeten) reageren op de hierboven ge�nitialiseerde pulldown menu's:
		
		dataType: 'text',
		success: function( data ) {
			var xCategories = [], series = [];
			
			data = JSON.parse(data)[component].measurements;
			
			console.log('LUCHT', data);
			
			// Convert JSON data to 2d-array with x,y-values
			$.each(data, function(index, item) {
				// clear dataPoint
				dataPoint = [];
				// Push period and data value
				dataPoint.push(item.timestamp_measured.replace(' 00:00',''));
				dataPoint.push(item.value);
				// Push point to series
				seriesData.push(dataPoint);
			});	 
			// Convert day values to week values
			seriesData = convertDayToWeekData(seriesData);

			// update chart with options: use yAxis=2	
			updateChart(chartLucht, { id:'Lucht', name: 'Lucht', data: seriesData } );
			
		}
	});	
}
/*
	Converts array with (x,y) elements and x=date to array withx=YearWeek
	dayToUse: optional param indicates which day of the week to use
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
		return [date.getFullYear().toString() + ('0'+ week).slice(-2), item[1]];
	})
}
