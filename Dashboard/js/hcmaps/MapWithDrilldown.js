/*
 | This code will generate a map with drilldown function if neccessary information is provided.
 | @author Martino Kosterman
 | @date March 2017
*/


$(function () {
  // Set drillUp button Text
  if( mapSettings.mapDrillUpText != undefined ) {
    Highcharts.setOptions({
      lang: { drillUpText: mapSettings.mapDrillUpText }
    });
  }
  
  // mapConfiguration to draw map with Highcharts
  // Parameters from mapSettings will be used to get the final configuration
  mapConfig = {
    title: { text: mapSettings.mapTitle },
	subtitle: {text: mapSettings.mapSubtitle },
    legend: {
      title: { text: mapSettings.legendTitle }
    },
    colorAxis: mapSettings.colorAxis,
    colors: mapSettings.colorAxis.colors,
    series: [],
    chart: {
      description: mapSettings.mapDescription,
      
      events: {  
        drilldown: drilldown, // Call Drilldown event functions without "()" so jQuery will pass event context
        drillup: drillup,
        load: function () {
          var chart = this;
          
          createDrilldownTitle(chart);
          
          var axis = this.colorAxis[0];
          // Disable LegendItemClick event on colorAxis
          $.each(axis.legendItems, function(i, item) {
            item.legendGroup.on('click', function (e) {
              return false;
            });
          });
        }
      },
    },
    plotOptions: {
      map: {
        tooltip: {
          valueDecimals: mapSettings.valueNotation.valueDecimals,
          valueSuffix: mapSettings.valueNotation.valueSuffix,
        }
      },
    },
    exporting: {
      filename: mapSettings.mapTitle
    }
  };
  
  // Nederland and other background layers are used as contour layer. Drawn as last layers so border will be at top of other borders.
  $.each(mapSettings.backgroundLayers, function(layerNo, layer) {  
    
    getMap(layer, false, { convert: true, format: layer.type });
    
    mapConfig.series.push(
      { 
        zIndex: layerNo + 1, // Offset to put background layers on top
        name: layer.name,
        data: Highcharts.maps[layer.name], 
        type: 'mapline', // Always plot as line
        color: layer.borderColor,
        lineWidth: layer.lineWidth,
        showInLegend: layer.name != 'Nederland',
      }
    );
  });

  // Set specific map theme
  Highcharts.setOptions(Highcharts.mapTheme);

  // Initiate the chart
  var mapContainer = mapSettings.mapContainer || 'mapContainer';
  var mapChart = Highcharts.mapChart(mapContainer, mapConfig, chartCreateCallback);
  
  //Load CSV data (slice result of array to skip headers)
  csvData = GetData(mapSettings.main.data.url);

  // Set dataColumns from csv headers if dataColumns == undefined
  if ( mapSettings.main.data.dataColumns == undefined ) {
    mapSettings.main.data.dataColumns = csvData[0];
  }
  // console.log('dataColumns');console.log(mapSettings.main.data.dataColumns);
  
  //Convert to Array of objects
  csvData = ConvertDataArrayToArrayOfObjects(csvData.slice(1), mapSettings.main.data);
  
  // jsonP call?
  var jsonP = mapSettings.main.map.url.indexOf('outputFormat=text/javascript');
    
  // Load main map asynchronously
  $.ajax( mapSettings.main.map.url + ((jsonP > 0) ? '&format_options=callback:mainCallback' : ''), {
    dataType: (jsonP > 0) ? 'jsonp' : 'json',
    jsonpCallback: 'mainCallback', 
    error: ajaxError,
    async: true,
    success: function (mainMap) {
      
      // Add mainMap to the map.series series
      mapChart.addSeries(
      {
        zIndex: 0,
        name: mapSettings.main.map.name,
        description: mapSettings.main.map.description,
        data: csvData, // data converted to array of objects
        mapData: mainMap,
        joinBy: [mapSettings.main.map.key, mapSettings.main.data.key],
        keys: mapSettings.main.data.tableColumns || mapSettings.main.data.dataColumns,
        tooltip: {
          pointFormat: '{point.properties.' + mapSettings.main.map.nameProp + '}: <b>{point.value}</b>'
        }
      });
        
      // mapChart.viewData();
    }
  });

  // timerLabel = 'download drilldown csv data';
  // console.time(timerLabel);
  csvDrilldownData = GetData(mapSettings.drilldown.data.url);
  // console.timeEnd(timerLabel);

  // timerLabel = 'convert drilldown csv data';
  // console.time(timerLabel);
  // Load CSV drilldownData and convert to objects
  // Set dataColumns from csv headers if dataColumns == undefined
  if ( mapSettings.drilldown.data.dataColumns == undefined ) {
    mapSettings.drilldown.data.dataColumns = csvDrilldownData[0];
  }
  // console.log('dataColumns');console.log(mapSettings.drilldown.data.dataColumns);
  
  //Convert to Array of objects
  csvDrilldownData = ConvertDataArrayToArrayOfObjects(csvDrilldownData.slice(1), mapSettings.drilldown.data);
 
  // console.timeEnd(timerLabel);

  // timerLabel = 'download drilldown map';
  // console.time(timerLabel);
  // Preload drilldown map
  getMap(mapSettings.drilldown.map, false);
  // console.timeEnd(timerLabel);
  
});

function chartCreateCallback (chart) {
  //Remove svg.title element
  chart.title.textStr='';

};