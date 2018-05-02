// General theming for all Highcharts objects (charts and maps 
Highcharts.mapTheme = {
    lang: {
      decimalPoint: ',',
      thousandsSep: ' ',
      // Specific text labels for drill down map
      //drillUpText: '<< Terug naar {series.name}', // You may use {series.name} as parameter in the text
	  drillUpText : '<< Terug',
      zoomIn: 'Inzoomen',
      zoomOut: 'Uitzoomen',
      printChart: 'Kaart afdrukken',
      downloadPNG : 'PNG afbeelding downloaden',
      downloadJPEG : 'JPEG afbeelding downloaden',
      downloadPDF : 'PDF document downloaden',
      downloadSVG : 'SVG afbeelding downloaden',
      contextButtonTitle : 'Kaart context menu',
      downloadCSV : 'CSV downloaden',
      downloadXLS : 'XLS downloaden',
      viewData : 'Tabel tonen'
    },
    chart: {
      // chart spacing and margins see: http://www.highcharts.com/docs/chart-design-and-style/design-and-style
      spacing: [10, 10, 15, 0],
      
      //VZinfo: [49, 5, 5, 79]
      margin: [49, 5, 5, 79],
            
      // Explicitly tell the width and height of a chart
      height: 526,
	  //height: '110%', // VZInfo ratio
      
      drilldownTitle: {
        text: '',
        //align: 'left',
		style: {
          fontFamily: 'Verdana',
          fontSize: '16px',
          fontWeight: 'bold'
        },
        padding: 1,
        //backgroundColor: 'rgba(255,255,255,0.8)',
        //x: 91,
        y: 33
        
      }
    },
	title: {
		align: 'left',
		style: {
			fontSize: '18px',
			fontWeight: 'bold',
			color: '#01689B'
		},
		x: 1
    },
    subtitle: {
		align: 'left',
		style: {
			fontSize: '14px',
			fontWeight: 'bold',
			color: '#01689B'
		}
	},
	credits: {
		enabled: true,
		text: '',
		href: '',
		style: {
			fontSize: '11px',
			color: '#505050',
			cursor: 'default'
		},
		position: {
            verticalAlign: 'bottom',
			align: 'left',
			x: 0
        }
    },
	mapNavigation: {
		enabled: true,
		buttonOptions: {
			align: 'left',
			verticalAlign: 'bottom',
			x: -75,
			style: {
				fontWeight: 'bold',
				color: 'white',
			},
			theme: {
				fill: '#01689b',
				'stroke-width': 0,
				r: 4,
				states: {
					hover: {
						fill: '#b2d7ee',
						style: {
							color: '#e17000'
						}
					},
					select: {
						stroke: '#039',
						fill: '#01689b'
					}
				}
			}
		}
    },
    legend: {
		title: {
			style: {
				fontSize: '12px',
				fontWeight: 'normal'
			}
		},
		highlightSeries: {
			enabled: true,
			dimmedOpacity: 0.01
		},
		layout: 'vertical',
		verticalAlign: 'top',
		padding: 0, 
		align: 'left',
		x: 2,
		y: 50,
		itemStyle: {
			fontSize: '11px',
			fontWeight: 'normal',
			width: null
		},
		itemHoverStyle:{
			color: 'gray'
		},
		itemMarginBottom: 2,
		maplineMarginTop: 10,
		itemBorderColor: '#6e6e6e', // Custom props for drilldown maps
		itemBorderWidth: .5,        // Custom props for drilldown maps
		squareSymbol: false, // if true: height = width 
		symbolRadius: 0, // if Radius = Height/2 the symbol will be a circle
		symbolHeight: 13,
		symbolWidth: 25
	},
    plotOptions: {
      map: {
        exportKey: 'exportName',
        tooltip: {
          headerFormat: '' //'{series.name}<br/>',
        },
        nullColor: 'white',
        states: {
          hover: {
            color: null, // Setting to null will keep original fill color
            brightness: 0,
            borderColor: 'rgba(255,153,0, 0.5)', //'orange'
            borderWidth: '3px'
          },
          select: {
            color: null, // Setting to null will keep original fill color
            brightness: 0,
            borderColor: 'rgba(255,153,0, 0.5)', //'orange'
            borderWidth: '3px'
          }
        },
        events: {
          legendItemClick: function () { // disable legendItemClick for series not using colorAxis
            return false; 
          }
        }
      },
      series: {
        animation: { duration: 0 },
        allowPointSelect: true,
      },
      mapline: {
        allowPointSelect: false,
        enableMouseTracking: false,
        colorAxis: false, // Set to false to create own legend item in stead of connecting up to colorAxis 
        includeInCSVExport: false // Do not include exporting options like csv, viewData  
      }
    },
	
				/*style: {
				fontWeight: 'bold',
				color: 'white',
			},
			theme: {
				fill: '#01689b',
				'stroke-width': 0,
				r: 4,
				states: {
					hover: {
						fill: '#b2d7ee',
						style: {
							color: '#e17000'
						}
					},
					select: {
						stroke: '#039',
						fill: '#01689b'
					}
				}
			}*/
	
	
    drilldown: {
      animation: { duration: 10 },
      activeDataLabelStyle: {
        cursor: 'pointer',
        color: 'white', //'#003399',
        fontWeight: 'normal',
        textDecoration: 'none'
      },
      drillUpButton: {
        relativeTo: 'plotBox', // spacingBox
        position: {
          y: -15,
          x: 0
        },
		
			theme: {
				fill: '#01689b',
				'stroke-width': 0,
				r: 4,
				style: {
				fontWeight: 'bold',
				color: 'white',
			},
				states: {
					hover: {
						fill: '#b2d7ee',
						style: {
							color: '#e17000'
						}
					},
					select: {
						stroke: '#039',
						fill: '#01689b'
					}
				}
			}
      }
    },
    series: {
      dataLabels: {
        enabled: true,
        allowOverlap: false,
        style: {
          color: 'contrast', 
          fontSize: '11px',
          fontWeight: 'normal',
          textOutline: '0px 0px contrast' 
        },
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
				symbol: 'url(./js/hc/themes/images/download.png)',
				//symbol: 'url(/modules/custom/sdv_highcharts/js/images/download.png)',
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
                symbol: 'url(./js/hc/themes/images/printer.png)',
				//symbol: 'url(/modules/custom/sdv_highcharts/js/images/printer.png)',
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
    /*exporting: {
      buttons: {
        contextButton: {
          menuItems: [
            {
              textKey: 'printChart',
              onclick: function() { this.print(); }
            }, {
                separator: true
            }, {
              textKey: 'downloadPNG',
              onclick: function() { this.exportChart(); }
            }, {
              // textKey: 'downloadJPEG',
              // onclick: function() { this.exportChart( { type: 'image/jpeg' } ); }
            // }, {
              textKey: 'downloadPDF',
              onclick: function() { this.exportChart( { type: 'application/pdf' } ); }
            }, {
              textKey: 'downloadSVG',
              onclick: function() { this.exportChart( { type: 'image/svg+xml' } ); }
            }, {
              textKey: 'downloadCSV',
              onclick: function () { this.downloadCSV(); }
            }, {
              textKey: 'downloadXLS',
              onclick: function () { this.downloadXLS(); }
            }, {
              textKey: 'viewData',
              onclick: function () { this.viewData(); }
            }
          ]
        }
      },
      csv: {
        itemDelimiter: ';',
        lineDelimiter: '\r\n',
        columnHeaderFormatter : function (serie, key, keyLength) {
          if( serie.name != undefined ) {
            // console.log(serie.name + '-' + key);
            return key;
          } else {
            return 'Gemeente'
          }
        }
      }
    }*/       
};

// Apply the theme
//Highcharts.setOptions(Highcharts.theme);