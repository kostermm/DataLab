/*	Datalab configuraties:
 |  - Configuratie voor dropdown selecties
 |	- Configuraties voor grafieken
 |	- Standaard Highcharts opties
 | 	
 |	2018-11
*/

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
			name: 'Totaal leeftijd'
		},
		gesl: {
			key: 1100,
			name: 'Totaal mannen en vrouwen'
		},
		begin: {
			jaar: 2017,
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
		data: {
			url: "https://opendata.cbs.nl/ODataApi/odata/70895ned/TypedDataSet?$filter=(Geslacht+eq+'gesl')+and+LeeftijdOp31December+eq+'lftkls'&$select=Perioden,Overledenen_1",
			getData: getSterfte,
			triggeredBy: 'gesl;lftkls'
		},
		chartOptions: {
			chart: {
				height: 180
			},
			title: { text: null }, // 'Aantal sterfgevallen per week' }, 
			subtitle: { text: selectConfig.selectedOptions.gesl.name + ', ' + selectConfig.selectedOptions.lftkls.name },
			xAxis: {
				labels: {
					enabled: true
				},
				opposite: true
			},
			yAxis: { title: { text: 'aantal/week' } },
			credits: {
				enabled: false
			}
		}
	},
	griep: {
		data: {
			url: "data/griep.csv",
			getData: getGriep,
			triggeredBy: 'gesl'
		},
		chartOptions: {
			chart: {
				height: 120
			},
			subtitle: null,
			xAxis: {
				labels: {
					enabled: false
				},
				opposite: false
			},
			yAxis: { title: { text: 'incidentie' } },
			credits: {
				enabled: false
			}
		}
	},
	lucht: {
		data: {
			url: 'https://api.luchtmeetnet.nl/station/measurement_data?station_id=170&component_id=2&start_date=beginJaar/01/01&end_date=eindeJaar/12/31&daily_averages=1',
			getData: getLucht
		},
		chartOptions: {
			// title: { text: 'Fijnstof PM 2.5' }, 
			subtitle: null,
			xAxis: {
				labels: {
					enabled: false
				},
				opposite: false
			},
			yAxis: { title: { text: 'μg/m3' } },
			// tooltip: {
			// 	valueSuffix: 'μg/m3'
			// },
			credits: {
				enabled: false
			}
		}
	},
	temperatuur: {
		data: {
			url: '../knmi.php',
			getData: getTemperature
		},
		chartOptions: {
			// title: { text: 'Temperatuur' }, 
			chart: {
				height: 140,
				marginBottom: 25
			},
			subtitle: null,
			xAxis: {
				labels: {
					enabled: true
				},
				opposite: false
			},
			yAxis: {
				title: { text: '°C' },
				max: 30,
				min: -10,
				tickInterval: 10
			},
			// tooltip: { 
			// 	valueSuffix: '°C',
			// 	valueDecimals: 1 
			// },
			credits: {
				enabled: true,
				text: 'rivm.nl',
				href: 'https://www.rivm.nl'
			}
		}
	}
}

// Default charts options, specific options like titles etc are set through chartsConfig
var defaultChartOptions = {
	chart: {
		// renderTo: container,
		marginBottom: 10,
		type: 'spline',
		zoomType: 'x'
	},
	colors: ["#7cb5ec", "#434348", "#e85300"], // "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"],
	xAxis: {
		type: 'datetime',
		events: {
			setExtremes: syncExtremes
		},
		startOnTick: true,
		// endOndTick: true,	
		minTickInterval: 5,
		labels: {
			enabled: true
		},
	},
	yAxis: {
		title: {
			text: 'Aantal'
		}
	},
	// tooltip: {
	// 	// pointFormat: '{series.name}: <b>{point.y:,.0f}{tooltip.valueSuffix}</b><br/>'
	// 	valueSuffix: null,
	// 	formatter: function () {
	// 		console.log(this.series.name, this.series.tooltipOptions.valueSuffix)
	// 		return '<b>' + this.key + '</b><br/>' + this.series.name + this.y + ' ' + this.series.tooltipOptions.valueSuffix;
	// 	}
	// },
	plotOptions: {
		series: {
			marker: {
				radius: 2,
				symbol: 'circle'
			}
		}
	}
}