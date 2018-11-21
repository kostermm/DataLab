/* Update chart
// chart: Highcharts.Chart object
// series: series (one) to add
// subtitle (optional): Update subtitle if present
*/
function updateChart(chart, series, subtitle) {
	console.log('update', series);
	var subTitle = null;
	var axisData = [], categories = [];

	// Remove this serie first
	if (series.id != undefined && chart.get(series.id) != undefined) {
		chart.get(series.id).remove();
  }
  
	// Test whether data is available and update series and subtitle accordingly
	if (series.data.length == undefined) {
		subTitle = { text: 'No data found' };
	} else {
		// Add series
		chart.addSeries(series, true);
  }
  
	// Update subtitle
	if (subtitle != undefined) {
		subTitle = { text: subtitle };
	}
	chart.setSubtitle(subTitle);

  // Get extremes from chart[0] te set equal extremes for all charts
	if (chart.index == 0) {
		xAxisSettings = {
			min: chart.xAxis[0].dataMin,
			max: chart.xAxis[0].dataMax
		}
		$.each(dashboardCharts, function (index, chart) {
			chart.xAxis[0].setExtremes(xAxisSettings.min, xAxisSettings.max);
		})
	}
}

// Function to get Sterfte data and update chart
function getSterfte() {

	$.ajax({
		// statische URL voor de initiële view:
		url: chartsConfig['sterfte'].data.url.replace('gesl', selectConfig.selectedOptions.gesl.key).replace('lftkls', selectConfig.selectedOptions.lftkls.key),
		//dynamische URL die (zou moeten) reageren op de hierboven ge�nitialiseerde pulldown menu's:
		//url: "https://opendata.cbs.nl/ODataApi/odata/70895ned/TypedDataSet?$filter=(Geslacht+eq+'" + gesl2 + "')
		//                         +and+LeeftijdOp31December+eq+'" + lftkls2 + "'&$select=Perioden,Overledenen_1",
		// contains(Perioden,'W')
		dataType: 'text',
		success: function (data) {
			data = JSON.parse(data).value;
			var weekNumber = -1, seriesData = [], vorigeWeek;

			$.each(data, function (index, item) {
				/* Filter received data
				// - Only use Week data: Perioden contains W or X
				// - Only use data of selected years: begin.jaar <= year <= einde.jaar
				*/
				if ((item.Perioden.indexOf('W') > 0 || item.Perioden.indexOf('X') > 0)
					&& (Number(item.Perioden.substring(0, 4)) >= selectConfig.selectedOptions.begin.jaar &&
						Number(item.Perioden.substring(0, 4)) <= selectConfig.selectedOptions.einde.jaar)
					// ************ temp filter for weeks at start/end of year week <3 and week > 50
					// && ( Number(item.Perioden.substr(6,2)) < 2 || Number(item.Perioden.substr(6,2)) > 51 )
				) {
					weekNumber = Number(item.Perioden.substring(0, 4)) * 100 + Number(item.Perioden.substring(6, 8));
					// Push time/period and data value
					// seriesData.push([ weekNumber, Number(item.Overledenen_1) ]);
					seriesData.push([weekNumber, Number(item.Overledenen_1)]);
				}
			});
			// Merge orphans at start/end of year:  week 0/53
			seriesData = mergeWeekOrphans(seriesData);
			var seriesDataDate = [], week, year, date;

			$.each(seriesData, function (index) {
				// ((week)*7)+NewYear-(WEEKDAY(NewYear;2)-4)+(INT(WEEKDAY(NewYear;2)/5)-1)*7
				week = this[0] % 100;
				year = Math.floor(this[0] / 100);
				var NewYear = new Date(year, 0, 1); // month is zero-based
				var NewYearWeekDay = NewYear.getDay();
				NewYearWeekDay = NewYearWeekDay == 0 ? 7 : NewYearWeekDay;
				date = addDays(NewYear, ((week * 7) - (NewYearWeekDay - 4) + (Math.floor(NewYearWeekDay / 5) - 1) * 7));

				// if (week == 1 || week >= 52) {
				// 	console.log(year, week, this[0], NewYear, NewYear.getDay(), date);
				// }

				seriesDataDate.push({ x: date, y: this[1], name: year + ' wk ' + week });
				// if ((this[0] % 100) > 51) {
				// 	console.log(this[0]);
				// }
			});
			// console.log(seriesDataDate);

			updateChart(dashboardCharts['sterfte'], { id: 'Sterfte', name: 'Sterfte', data: seriesDataDate }
				, selectConfig.selectedOptions.gesl.name + ', ' + selectConfig.selectedOptions.lftkls.name);

		}
	});
}

// Function to get Sterfte data and update chart
function getGriep(chartName) {
	chartName = chartName || 'griep';

	var griepData = getGriepData();
	// console.log(griepData);

	updateChart(dashboardCharts['griep'], { id: 'Griep', name: 'Griep', data: griepData });

}

// Function to get Temparature data and update chart
function getTemperature() {
	// dataCol: choose one of three dataCols: 1:Tmin, 2:Tgem, 3:Tmax
	var dataCols = {
		Tmin: 1,
		Tgem: 2,
		Tmax: 3
	}
	// Get Temparature data through JS function KNMI/getTemperatureData
	var arrTemperature = getTemperatureData(selectConfig.selectedOptions.begin.jaar);
	// console.log('TEMPERATUUR', arrTemperature);
	// Add average
	addTemparatureColumn(arrTemperature, 'Tgem', dataCols);
	addTemparatureColumn(arrTemperature, 'Tmin-Tmax', dataCols);
	// $.each(dataCols, function(colName, dataCol){
	// 	addTemparatureColumn(arrTemperature, colName, dataCol);
	// })
}
// Add one datacolumn from temp array
function addTemparatureColumn(arrTemperature, colName, dataCols) {
	var seriesData = [], date, dataCol2;
	var seriesType = 'line';
	var dataCol = dataCols[colName] || 2;
	var _MS_PER_DAY = 1000 * 60 * 60 * 24;

	if (colName.indexOf('-') > 0) {
		seriesType = 'arearange';
		dataCol = dataCols[colName.substring(0, colName.indexOf('-'))];
		dataCol2 = dataCols[colName.substring(colName.indexOf('-') + 1)];
	}

	// Process data array to seriesData array 
	arrTemperature.forEach(function (item, i, arr) {
		date = new Date(item[0]);
		// Push time/period and data value to series as array
		if (item[0].getDay() == 4) {
			// seriesData.push([ item[0], item[dataCol] ] );
			if (colName.indexOf('-') > 0) {
				seriesData.push({ x: date, low: item[dataCol], high: item[dataCol2], name: date.getFullYear() + ' wk ' + 'week' });
			} else {
				var firstDayOfYear = new Date(date.getFullYear(), 0); // 1 jan: month=0
				var week = Math.floor((date - firstDayOfYear) / _MS_PER_DAY / 7) + 1;
				seriesData.push({ x: date, y: item[dataCol], name: date.getFullYear() + ' wk ' + week });
			}
		}

	})
	// Convert day values to week values
	// 	seriesData = convertDayToWeekData(seriesData);

	updateChart(dashboardCharts['temperatuur'], {
		id: 'temp_' + dataCol, name: colName || 'Temperatuur ' + dataCol
		, data: seriesData, type: seriesType, color: Highcharts.getOptions().colors[0]
	});
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
		url: chartsConfig['lucht'].data.url.replace(/beginjaar/i, selectConfig.selectedOptions.begin.jaar)
			.replace(/eindejaar/i, selectConfig.selectedOptions.einde.jaar),   // Replace jaar with selected year
		//dynamische URL die (zou moeten) reageren op de hierboven ge�nitialiseerde pulldown menu's:

		dataType: 'text',
		success: function (data) {
			var seriesData = [];

			// Check for data for requested component
			if (JSON.parse(data)[component] != undefined) {
				data = JSON.parse(data)[component].measurements;
				// console.log('LUCHT', data);

				// Convert JSON data to 2d-array with x,y-values
				$.each(data, function (index, item) {
					// Push point to series
					seriesData.push([item.timestamp_measured.replace(' 00:00', ''), item.value]);
				});
				// Convert day values to week values
				seriesData = convertDayToWeekData(seriesData);
			} else {
				// seriesData is empty array
			}
			// update chart with options: use yAxis=2	
			updateChart(dashboardCharts['lucht'], { id: 'Lucht', name: 'Lucht', data: seriesData });

		}
	});
}

/* Converts array with (x,y) elements and x=date to array withx=YearWeek
// dayToUse: optional param indicates which day of the week to use
*/
function convertDayToWeekData(arrData, dayToUse) {
	dayToUse = dayToUse || 4 // default is mid of week (donderdag)
	var _MS_PER_DAY = 1000 * 60 * 60 * 24;

  console.log(arrData);

	return arrData.filter(function (item, index, arr) {
		var date = new Date(item[0]);
		return date.getDay() == dayToUse;
	}).map(function (item, index, arr) {
		var date = new Date(item[0]);
		var firstDayOfYear = new Date(date.getFullYear(),0); // 1 jan: month=0
		var week = Math.floor((date - firstDayOfYear) / _MS_PER_DAY / 7) + 1;

		// console.log(date.toLocaleDateString("nl-NL"), 'week: ', week);
		// return [ date.getFullYear() * 100 + week, item[1]];
		return { x: date, y: item[1], name: date.getFullYear() + ' wk ' + week };
	})
}

/* Merge week data items with items in next/prev year:
// week 0 -> merge with last item previous year
// week 53 -> merge with first item next year
// if next/prev does not exist: remove week 0/53
*/
function mergeWeekOrphans(arrData) {
	// Week 0 will be added to previous week
	// 	console.log(item,  series[series.length-1]);
	// 	if( series[series.length-1] != undefined) {
	// 		series[series.length-1][1] += Number(item.Overledenen_1);
	// 	}
	return arrData.map(function (item, index, arr) {
		// Week 0 will be added to previous week
		if (getYearWeek(item[0]).week == 0) {
			if (arr[index - 1] != undefined) {
				console.log('add', item, ' to', arr[index - 1]);
				arr[index - 1][1] += item[1];
			}
		}
		if (getYearWeek(item[0]).week == 53) {
			if (arr[index + 1] != undefined) {
				console.log('add', item, ' to', arr[index + 1]);
				arr[index + 1][1] += item[1];
			}
		}

		return item;
	}).filter(function (item, index, arr) {
		return getYearWeek(item[0]).week != 0 && getYearWeek(item[0]).week != 53;
	})
	// .map( function (item, index, arr){
	// 	var date = new Date(item[0]);
	// 	var firstDayOfYear = new Date(date.getFullYear(), 0); // 1 jan: month=0
	// 	var week = Math.floor((date - firstDayOfYear)/_MS_PER_DAY/7) +1;

	// 	// console.log(date.toLocaleDateString("nl-NL"), 'week: ', week);
	// 	return [date.getFullYear().toString() + ('0'+ week).slice(-2), item[1]];
	// })
}

// Get object with year and week from year-week string format: YYYYWW
function getYearWeek(intYearWeek) {
	var objYearWeek = {};
	objYearWeek.year = Math.floor(intYearWeek / 100);
	objYearWeek.week = intYearWeek % 100;

	return objYearWeek;

}

// function to add days to a given date. 
function addDays(startDate, numberOfDays) {
	var returnDate = new Date(
		startDate.getFullYear(),
		startDate.getMonth(),
		startDate.getDate() + numberOfDays,
		startDate.getHours(),
		startDate.getMinutes(),
		startDate.getSeconds()
	);

	return returnDate;
}

function getGriepData(chartName, bYear, eYear) {
	chartName = chartName || 'griep';
	var csvDataText = [], csvData = [], dataRow = [];
	var url = chartsConfig[chartName].data.url;

	//Load CSV data (slice result of array to skip headers)
	var csvDataText = GetData(url);

	$.each(csvDataText, function (index, row) {
		dataRow = [];

		if (index == 0) {
			csvData.push(row);
		} else {
			$.each(row, function (index, cell) {
				dataRow.push(Number(cell.replace(',', '.')));
			});
			csvData.push(dataRow);
		}
	});
	// console.log(csvData);

	var parsedData = parseWeekData(csvData, true);
	// console.log(parsedData);

	return parsedData;
};

// Parse two-dimensional array of strings
// skipColumns: array of column numbers to skip

// jaar;week;IAZ_incidentie
// 2010;40;22,99044364
function parseWeekData(arrData, hasHeader) {
	hasHeader = hasHeader || true;
	var rows = [], year, week = -1;
	var date = new Date();

	// console.log('parseWeekData', arrData);

	$.each(arrData, function (index, row) {  // (rowNo, row)
		// ((week)*7)+NewYear-(WEEKDAY(NewYear;2)-4)+(INT(WEEKDAY(NewYear;2)/5)-1)*7

		// console.log(row);
		if (hasHeader && index == 0) {

		} else {
			year = row[0];
			week = row[1];
			var NewYear = new Date(year, 0, 1); // month is zero-based
			var NewYearWeekDay = NewYear.getDay();
			NewYearWeekDay = NewYearWeekDay == 0 ? 7 : NewYearWeekDay;
			date = addDays(NewYear, ((week * 7) - (NewYearWeekDay - 4) + (Math.floor(NewYearWeekDay / 5) - 1) * 7));

			// if (week == 1 || week >= 52) {
			// 	console.log(year, week, this[0], NewYear, NewYear.getDay(), date);
			// }

			rows.push({ x: date, y: this[2], name: year + ' wk ' + week });
			// if ((this[0] % 100) > 51) {
			// 	console.log(this[0]);
			// }
		}
	});

	return rows;
};

Date.prototype.getWeek = function () {
	var onejan = new Date(this.getFullYear(), 0, 1);
	// return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
	return Math.ceil((((new Date(this.getFullYear(), this.getMonth(), this.getDate()) - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};