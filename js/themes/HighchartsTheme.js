/*
 | Highcharts theme for (drilldown) maps
 | @author Martin Kosterman
 | @date March 2017
 */

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
// Specific theming for charts
Highcharts.chartTheme = {
  legend: {
    align: 'right',
    y: 31,
    itemStyle: {
      fontWeight: 'normal',
      width: 110 
    },
  },
  tooltip: {
    positioner: null,
    shadow: true,
    padding: 8,
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.8)'
  },
  mapNavigation: {
    enabled: false
  }
}

// General theming for all Highcharts objects (charts and maps 
Highcharts.theme = {
    lang: {
      decimalPoint: ',',
      thousandsSep: '.',
      // Specific text labels for drill down map
      drillUpText: '<< Terug naar {series.name}', // You may use {series.name} as parameter in the text

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
      style: {
        fontFamily: 'RijksoverheidSans, verdana, serif'
      },
      
      borderWidth: 0,

      // chart spacing and margins see: http://www.highcharts.com/docs/chart-design-and-style/design-and-style
      spacing: [10, 10, 15, 0],
      
      //VZinfo: [49, 5, 5, 79]
      margin: [49, 5, 5, 79],
            
      // Explicitly tell the width and height of a chart
      width: 495,
      height: 526,
      
      drilldownTitle: {
        text: '',
        style: {
          fontFamily: 'Verdana',
          fontSize: '12px',
          fontWeight: 'bold',
        },
        padding: 1,
        backgroundColor: 'rgba(255,255,255,0.8)',
        x: 91,
        y: 43
        
      }
    },
    // xAxis: {
        /* min:323325, max:587769 */
        // min:320000,
        // max:590000
    // },
    // yAxis: {
        /* min:-1539244, max:-1232816 */
        // min:-1540000,
        // max:-1232000,
    // },
    title: {
      align: 'left',
      style: {
        color: '#000000',
        // 'background-color': '#FFFFFF', // only works if useHTML
        fontSize: '18px',
        fontWeight: 'bold'
      },
      x: 1
      
      //useHTML: true,
    },
    subtitle: {
        style: {
            color: '#666666',
            font: 'bold 12px Verdana, sans-serif'
        }
    },
    legend: {
      title: {
        style: {
          fontSize: '12px',
        }
      },
      highlightSeries: {
        enabled: true,
        dimmedOpacity: 0
      },
      layout: 'vertical',
      verticalAlign: 'top',
      padding: 0, 
      x: 2,
      itemStyle: {
          fontSize: '11px',
      },
      itemHoverStyle:{
          color: 'gray'
      },
      itemMarginBottom: 2,
      maplineMarginTop: 10,       // Custom props for drilldown maps
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
    mapNavigation: {
      enabled: true,
      buttons: {
        zoomOut: {
          text: '–',
          y: 28,
        },
        Martino: {
          text: 'M',
          y: 28,
        }
            },
      buttonOptions: {
        verticalAlign: 'top',
        alignTo: 'plotBox',
        align: 'right',
        verticalAlign: 'bottom',
        x: -8,
        width: 12,
        height: 20,
        padding: 4,
        style: {
          fontFamily: 'Verdana',
          fontSize: '17px',
          fontWeight: 'bold',
          // textAlign: 'right'
        },
        theme: {
          'stroke-width': 1,
          'text-align': 'left',
          fill: 'rgba(255,255,255,0.8)',
        }
      },
    },
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
          fill: 'rgba(255,255,255,0.5)',
          'stroke-width': 1,
          stroke: 'silver',
          r: 2,
          // states: {
            // hover: {
              // fill: '#a4edba'
            // },
            // select: {
              // stroke: '#039',
              // fill: '#a4edba'
            // }
          // }
        }
      }
    },
    credits: {
      enabled: true,
      text: 'RIVM',
      href: 'http://www.rivm.nl',
      position: {
        align: 'left',
        verticalAlign: 'bottom',
        x: 0,
        y: -5
      },
      style: {
        fontSize: '11px',
        fontWeight: 'bold',
        color: '#6e6e6e'
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
    exporting: {
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
    }       
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
