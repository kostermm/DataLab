/*
 | This code will generate a map with chart function if neccessary information is provided.
 | @author Martino Kosterman
 | @date March 2017
*/
var detailChart; // variable to hold chart

$(function () {
  // mapConfiguration to draw map with Highcharts
  // Parameters from mapSettings will be used to get the final configuration
  var mapConfig = {
    title: { text: mapSettings.mapTitle },
    colorAxis: mapSettings.colorAxis,
    colors: mapSettings.colorAxis.colors,
    series: [],
    chart: {
      description: mapSettings.mapDescription,
      events: {
        load: function () {
          var axis = this.colorAxis[0];
          // Disable LegendItemClick event on colorAxis
          $.each(axis.legendItems, function(i, item) {
            item.legendGroup.on('click', function (e) {
              return false;
            });
          });
        }
      }
    },
    legend: {
      title: { text: mapSettings.legendTitle || Highcharts.defaultOptions.legend.text }
    },
    plotOptions: {
      map: {
        tooltip: {
          valueDecimals: mapSettings.valueNotation.valueDecimals,
          valueSuffix: mapSettings.valueNotation.valueSuffix,
        }
      }
    },
    exporting: {
      filename: mapSettings.mapTitle
    }
  };
  
  // Create basic map with the background layers
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
  
  // If interaction set to 'chart' wrapping function will get collection of selected points and add them to the chart
  if(mapSettings.mapInteraction == 'chart') {
    // Wrap point.select to get to the total selected points
    Highcharts.wrap(Highcharts.Point.prototype, 'select', function(proceed) {
      
      // First proceed with regular event handling to assure all selected points are added to SelectedPoints collection
      proceed.apply(this, Array.prototype.slice.call(arguments, 1));
      
      var selectedPoints = mapChart.getSelectedPoints();
      
      if (selectedPoints.length) {
        drawChart(selectedPoints)
      } else {
        // Destroy chart if no points are selected
        if (detailChart) {
          detailChart = detailChart.destroy();
        }
      }
    });
  }

  // Set specific map theme
  Highcharts.setOptions(Highcharts.mapTheme);
  
  // Initiate the chart with only backgroundlayers
  var mapContainer = mapSettings.mapContainer || 'mapContainer';
  var mapChart = Highcharts.mapChart(mapContainer, mapConfig, chartCreateCallback);
  
  //Load CSV data (slice result of array to skip headers)
  csvDataArr = GetData(mapSettings.main.data.url);

  // Set dataColumns from csv headers if dataColumns == undefined
  if ( mapSettings.main.data.dataColumns == undefined ) {
    mapSettings.main.data.dataColumns = csvDataArr[0];
  }
  
  //Convert to Array of objects
  mapData = ConvertDataArrayToArrayOfObjects(csvDataArr.slice(1), mapSettings.main.data);
  
  // Load main map asynchronously
  $.ajax( mapSettings.main.map.url, {
    dataType: 'json',
    async: true,
    error: ajaxError,
    success: function (mainMap) {
      
      // Add mainMap to the map.series
      mapChart.addSeries(
      {
        zIndex: 0,
        allowPointSelect: (mapSettings.mapInteraction == 'chart'),
        name: mapSettings.main.map.name,
        description: mapSettings.main.map.description,
        data: mapData, // data converted to array of objects
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

});

function chartCreateCallback (chart) {
  //Remove svg.title element
  chart.title.textStr='';
};
