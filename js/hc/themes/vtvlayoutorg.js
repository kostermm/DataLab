/**
 * Theme VTV Highcharts JS
 * @author Laurens Zwakhals
 * @version 2.2
 * @date 09-06-2016
 * @versionhistory: 
 * 0.1: 05-04-2016
 * 1.0: 12-09-2016
 * 2.0: 25-04-2017 --> Added responsive design
 * 2.1: 06-06-2017 --> Added color series
 * 2.2: 09-06-2017 --> Automatically positioning yAxis.title, conditional formatting responsive design (exception for bar-charts)
 ***/

var categorie = ['#42145f','#ffb612','#a90061','#777c00','#007bc7','#673327','#e17000','#39870c', '#94710a','#01689b','#f9e11e','#76d2b6','#d52b1e','#8fcae7','#ca005d','#275937','#f092cd'];
// 1)paars, 2)donkergeel, 3)robijnrood, 4)mosgroen, 5)hemelblauw, 6)donkerbruin, 7)oranje, 8)groen, 9)bruin, 10)donkerblauw, 11)geel, 12)mintgroen, 13)rood, 14)lichtblauw, 15violet), 16)donkergroen, 17)roze
var geslacht =['#007bc7', '#ca005d', '#42145f']; //order: 1)men, 2)women, 3)total
var internationaal = ['#42145f', '#ffb612'];
var enkel = ['#42145f'];
var profiel = ['#e17000', '#42145f', '#777c00'];
 
Highcharts.setOptions({
	lang: {
		months: ['januari', 'februari', 'maart', 'april', 'mei', 'juni',  'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
		weekdays: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
		numericSymbols: null,
		decimalPoint: ',',
		thousandsSep: ' ',
		loading: 'laden...',
		noData: 'Geen gegevens geselecteerd',
		contextButtonTitle: 'Exporteer grafiek',
		printChart: 'Print grafiek',
		downloadPNG: 'Download als PNG',
		downloadPDF: 'Download als PDF',
		downloadSVG: 'Download als SVG',
		downloadCSV: 'Download data in CSV-formaat',
		downloadXLS: 'Download data in XLS-formaat',
		viewData: 'Toon de data in tabelvorm'
	},
	chart: {
        style: {
			fontFamily: 'RO Sans'
        },
		backgroundColor: 'rgba(255, 255, 255, 0.0)',
		//Event below is for automatically positioning yAxis.axisTitle (http://jsfiddle.net/kL5md/21/)
		events: {
			load: function () {
                var chart = this, yAxis = chart.yAxis[0];
				if(chart.options.chart.type != 'bar' && yAxis.axisTitle != undefined) {
					var bbWidth = yAxis.axisTitle.getBBox();
					yAxis.update({
						title: {
							offset: -bbWidth.width
						}
					});
				}
			}
		}
	}
});
 
Highcharts.theme = {
	colors: categorie,
	title: {
		align: 'center',
		style: {
			fontSize: '24px',
			fontWeight: 'bold',
			color: '#01689B'
		},
		margin: 30
	},
	subtitle: {
		align: 'center',
		style: {
			fontSize: '18px',
			fontWeight: 'bold',
			color: '#01689B'
		}
	},	
	credits: {
		text: '',
		style: {
			fontSize: '14px',
			color: '#505050'
			},
		position: {
            verticalAlign: 'bottom',
			align: 'left',
			x: 0
        }
	},
	xAxis: {
		lineWidth: 2,
		lineColor: '#535353',
		tickLength: 4,
		tickWidth: 2,
		tickColor: '#535353',
		labels: {
			style: {
				fontSize: '10pt',
				color: '#000000'
			},
			staggerLines: 1
		},
		title: {
			align: 'high',
			style: {
				fontSize: '11pt',
				color: '#01689b'
			}
		},
		crosshair: {
            width: 3,
            color: '#535353',
			dashStyle: 'shortDash'
        }
	},
	yAxis: {
        title: {
			text: '',
			align: 'high',
			style: {
				fontSize: '11pt',
				color: '#01689b'
			},
			rotation: 0,
			y: -9
        },
		labels: {
			style: {
				fontSize: '10pt',
				color: '#000000'
			}
		},
		lineWidth: 0,
		gridLineDashStyle: 'solid',
		gridLineColor: '#535353',
		gridlineWidth: '0.75'
    },
	legend: {
		margin: 0,
		squareSymbol: false,
		symbolWidth: 24,
		symbolHeight: 12,
		symbolRadius: 0,
		y: -10,
		itemStyle: {
			fontWeight: 'normal',
			fontSize: '11pt',
			color: '#000000'
		},
		itemHoverStyle: {
			color: '#007bc7'
		},
		itemHiddenStyle: {
			color: '#c8c8c8'
		}
	},
	tooltip: {
		headerFormat: '<strong><large>{point.key}</large></strong><br>',
		style: {
			fontSize: '11pt',
			color: '#000000'
		},
		pointFormat: '<span style="color:{point.color}">\u25A0</span> {series.name}: <b>{point.y}</b><br/>',
		valueDecimals: 1,
		hideDelay: 0.2,
		backgroundColor: 'rgba(255,255,255,0.95)',
		borderWidth: 2,
		borderColor: '#000000',
		shadow: false
	},
	plotOptions: {
		line: {
			lineWidth: 4,
			marker: {
				enabled: false
			}
		},
		area: {
			lineWidth: 0,
			marker: {
				enabled: false
			}
		},
		column: {
			pointPadding: 0,
			groupPadding: 0.08,
			borderWidth: 0
		},
		bar: {
			pointPadding: 0,
			groupPadding: 0.08,
			borderWidth: 0
		},
		series: {
			stickyTracking: false,
			states: {
				hover: {
					lineWidthPlus: 2,
					brightness: 0.15
				}
			},
			marker: {
                symbol: 'circle',
				radius: 0,
                lineColor: null, // inherit from series
                states: {
                    hover: {
						fillColor: '#ffffff',
						lineWidth: 4,
						radius: 7
					}
				}
			},
			//animation: false,
			animation: {
                duration: 2000
			},
			dataLabels: {
				enabled: true,
				align: 'left',
				verticalAlign: 'middle',
				color: '#000000',
				style: {
					width: '150px',
					fontSize: '14px',
					fontWeight: 'normal'
				},
				y: -2,
				x: 6,
				allowOverlap: true,
				formatter: function() {
					if (this.point.x == this.series.data.length - 1) {	
						return this.series.name;
						//Other examples:
						//return this.y + "% " + this.series.name;
						//return (Math.round( this.y * 10 ) / 10) + '%';
					} else {
						return null;
					}
				},
				crop: false,
				overflow: 'none'
			}
		}
	},
	labels: {
		style: {
			fontSize : '14px',
			color: '#01689b'
		}
	},
	navigation: {
		menuStyle: {
			border: '0px',
			background: '#01689B',
			padding: '3px',
        },
		menuItemStyle: {
            padding: '0 10px',
            color: '#ffffff',
            fontSize: '13px',
			fontWeight: 'bold'
            },
        menuItemHoverStyle: {
            background: '#ecf5fb',
            color: '#000000'
            },
        buttonOptions: {
			symbolStroke: '#01689B', //Not needed anymore since 'the Hamburger' is replaced with icons.
			height: 30,
			width: 30
        }
    },
	exporting: {
        buttons: {
            contextButton: {
				//symbol: 'url(./js/themes/images/download.png)',
				symbol: 'url(/modules/custom/sdv_highcharts/js/images/download.png)',
				verticalAlign: 'bottom',
				y: 10,
				symbolX: 22,
                symbolY: 22,
				theme: {
					fill: 'rgba(255, 255, 255, 0.0)',
					states: {
						hover: {
							fill: '#b3b3b3'
						},
						select: {
							fill: '#b3b3b3'
						}
					}
				},
           		menuItems: [{
					textKey: 'downloadPNG',
					onclick: function () {this.exportChart();}
				},{
					textKey: 'downloadPDF',
					onclick: function () {this.exportChart({type: 'application/pdf'});}
				},{
					textKey: 'downloadSVG',
					onclick: function () {this.exportChart({type: 'image/svg+xml'});}
				},{
					separator: true
				},{
					textKey: 'downloadCSV',
					onclick: function () { this.downloadCSV(); }
				},{
					textKey: 'downloadXLS',
					onclick: function () { this.downloadXLS(); }
				},{
					textKey: 'viewData',
					onclick: function () { this.viewData(); }
				}]
            },
			printButton: {
                //symbol: 'url(./js/themes/images/printer.png)',
				symbol: 'url(/modules/custom/sdv_highcharts/js/images/printer.png)',
				verticalAlign: 'bottom',
				x: -30,
				y: 10,
				theme: {
					fill: 'rgba(255, 255, 255, 0.0)',
					states: {
						hover: {
							fill: '#b3b3b3'
						},
						select: {
							fill: '#b3b3b3'
						}
					}
				},
                symbolX: 22,
                symbolY: 22,
                _titleKey: 'printChart',
                onclick: function () {
					this.print();
                }
            }
        }
    },
	responsive: {
		rules: [{
			condition: {
				callback: function() {
					console.log(this.index, this.options.chart.type, this.title.textStr );
					return (this.options.chart.type !== 'bar' && this.chartWidth < 600);
				}
			},
			chartOptions: {
				chart: {marginRight: 10},
				title: {style: {fontSize: '17px'}},
				subtitle: {style: {fontSize: '13px'}},
				credits: {enabled: false},
				yAxis: {title: {style: {fontSize: '13px'}}}, //In reality this is less then 13px
				xAxis: {labels: {step: 5}},
				plotOptions: {series: {dataLabels: {enabled: false}}}	
			}
		},{
			condition: {
				callback: function() {
					console.log(this.index, this.options.chart.type, this.title.textStr );
					return (this.options.chart.type == 'bar' && this.chartWidth < 600);
				}
			},
			chartOptions: {
				chart: {marginRight: 10},
				title: {style: {fontSize: '17px'}},
				subtitle: {style: {fontSize: '13px'}},
				credits: {enabled: false},
				yAxis: {title: {style: {fontSize: '13px'}}},  //In reality this is less then 13px
				plotOptions: {series: {dataLabels: {enabled: false}}}			
			}
		}]
	}
};

// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.theme);

// Specific theming for maps
Highcharts.mapTheme = {
  legend: {
    align: 'left',
    y: 50,
    itemStyle: {
      fontWeight: 'bold',
      width: null
    },
  },
  tooltip: {
    positioner: function () {
      return { x: 90, y: 58 };
    },
    shadow: false,
    padding: 1,
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.8)'
  },
  mapNavigation: {
    enabled: true
  }
}

