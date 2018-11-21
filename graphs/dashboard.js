"use strict";

// Load options for a select dropdown with 'id' from dataUrl and set selectedOption
function loadSelect(id, selectedOption) {
	var selectDropdown = $('#' + id);
	$.ajax({
		url: selectConfig[id].url,
		dataType: 'text',
		success: function (data) {
			data = JSON.parse(data).value;
			$.each(data, function (index, item) {
				selectDropdown.append("<option value='" + item.Key + "'>" + item.Title + "</option>");
			});
			// set default
			if (selectedOption != undefined) {
				selectDropdown.find('option[value=' + selectedOption.key + ']').prop('selected', true);
			} else if (selectConfig.selectedOptions[id] != undefined) {
				selectDropdown.find('option[value=' + selectConfig.selectedOptions[id].key + ']').prop('selected', true);
			}
		}
	});
}

var dashboardCharts = {}, xAxisSettings = {};

// Code to run at page load: load select options, create (empty charts)
$(function () {
	// Fill select.jaar and set default values
	var today = new Date();
	for (var i = 2010; i <= today.getFullYear(); i++) {
		$('select.jaar').append("<option value='" + i + "'>" + i + "</option>")
	}
	if (selectConfig.selectedOptions.begin != undefined) {
		$('select#begin.jaar').find('option[value=' + selectConfig.selectedOptions.begin.jaar + ']').prop('selected', true);
	}
	if (selectConfig.selectedOptions.begin != undefined) {
		$('select#einde.jaar').find('option[value=' + selectConfig.selectedOptions.einde.jaar + ']').prop('selected', true);
	}

	// load options from selectConfig for sex and age classes
	$.each(selectConfig, function (key, item) {
		if ($('#' + key).length)
			loadSelect(key);
	})

	// Dropdown events
	$('select').on('change', function () {
		var selectId = this.id;

		if (this.selectedOptions.length > 0) {
			// Process change of beginjaar of eindjaar
			if ($(this).hasClass('jaar')) {
				switch (selectId) {
					case 'begin':
						$('select#einde')[0].value = Math.max(this.selectedOptions[0].value, Number($('select#einde')[0].value));
						break;
					case 'einde':
						$('select#begin')[0].value = Math.min(this.selectedOptions[0].value, Number($('select#begin')[0].value));
						break;
				}

				// Store selectedOptions
				selectConfig.selectedOptions['begin'].jaar = Number($('select#begin')[0].value);
				selectConfig.selectedOptions['einde'].jaar = Number($('select#einde')[0].value);

				// Update all charts
				$.each(chartsConfig, function (key, item) {
					item.data.getData();
				})
			} else { // Process change of age or sex
				// Store selectedOptions
				selectConfig.selectedOptions[selectId].key = this.selectedOptions[0].value;
				selectConfig.selectedOptions[selectId].name = this.selectedOptions[0].text;

				// Only update charts triggerdedBy sex and age
				$.each(chartsConfig, function (key, item) {
					if (item.data.triggeredBy != undefined && item.data.triggeredBy.indexOf(selectId) >= 0) {
						item.data.getData();
					}
				})
			}
		}
	});

	// Set Highcharts general theme
	// Highcharts.setOptions(Highcharts.chartTheme);

	// Create charts from chartsConfig
	$.each(chartsConfig, function (key, item) {
		dashboardCharts[key] = createChart(key, item.chartOptions);
	})

	// Trigger change event to load data and update charts
	$('#begin.jaar').trigger('change');

	// Bind events to sync interaction
	bindSyncEvents();
});

/* Create Highcharts charts possibly without series to create empty chart
// container: id of container to render chart
// options: chartOptions, merged with defaultChartOptions
*/
function createChart(id, options) {
	var chartOptions = $.extend(true, defaultChartOptions, options);
	var chartContainer = $('<div id="' + id + '" class="chart">')
		.appendTo('#chartsContainer')
		.highcharts(chartOptions);

	return chartContainer.highcharts();
	// new Highcharts.Chart( chartOptions );
}




