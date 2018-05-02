/*
 | Functions for loading maps and drilling 
 | @author Martino Kosterman
 | @date March 2017
*/

/*
  Create drilldown title
*/
function createDrilldownTitle(chart) {
  drilldownTitleOptions = Highcharts.defaultOptions.chart.drilldownTitle;
  
  chart.drilldownTitle = chart.renderer.label( drilldownTitleOptions.text, drilldownTitleOptions.x, drilldownTitleOptions.y )
    .css( drilldownTitleOptions.style )
    .attr({
        fill: drilldownTitleOptions.backgroundColor,
        padding: drilldownTitleOptions.padding
    })
    .add();
}
/* 
  Drilldown event function to handle drilldown
  Context this is chart object
*/
function drilldown(e) {

  if (!e.seriesOptions) {
    var chart = this,
        parentKey = e.point.drilldown;
       
    // Show the spinner
    chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

    //Get gemeente naam of drilldown area
    parentName = e.point.properties[mapSettings.main.map.nameProp];
    
    // Filterdata 
    drilldownData = FilterData(csvDrilldownData, filter = { property: mapSettings.main.data.drilldownKey, value: parentKey });
    
    // set title for drilldown map
    chart.drilldownTitle.attr({ text: mapSettings.drilldown.map.titlePrefix + parentName });
    
    // Hide loading and add series
    chart.hideLoading();
    // clearTimeout(fail);
    chart.addSeriesAsDrilldown(e.point, {
      name: parentName,
      data: drilldownData, 
      mapData: Highcharts.maps[mapSettings.drilldown.map.name],  
      joinBy: [mapSettings.drilldown.map.key, mapSettings.drilldown.data.key],
      keys: mapSettings.drilldown.data.tableColumns || mapSettings.drilldown.data.dataColumns,
      allAreas: false,
      tooltip: {
        // headerFormat: '{series.name}<br/>',
        pointFormat: '{point.properties.' + mapSettings.drilldown.map.nameProp + '}: <b>{point.value}</b>'
      },
    });
  }
}

/* 
  Drillup event function to reset chart.subtitle
  Context this is chart object
*/
function drillup(e) {
  this.drilldownTitle.attr({ text: Highcharts.defaultOptions.chart.drilldownTitle.text });
}
        
/*
  Download a geojson file using ajax and optionally convert with H.geojson
  - mapSettings: settings containing name, url
  - blnAsync: optional boolean to force synchronous download
  - conversionSetting: Settings for conversion:
      convert: boolean
      format: map, mapline or mappoint
*/
function getMap (mapSettings, blnAsync, conversionSetting) {
  var defaultConversionSettings = {
      convert: true,
      format: 'map'
    };
  // If sync setting not given, set to default value
  if( blnAsync == undefined ) blnAsync = true;
  // if no conversion settings are given, use deafult settings
  if( conversionSetting == undefined ) { 
    conversionSetting = defaultConversionSettings
  } else {
    // if only boolean given, change to object with format
    if( conversionSetting == true ) {
      conversionSetting = defaultConversionSettings
    }
  }
  
  // jsonP call?
  var jsonP = mapSettings.url.indexOf('outputFormat=text/javascript');

  // Download the map if not yet downloaded
  if( Highcharts.maps[mapSettings.name] == undefined ) {
    $.ajax(mapSettings.url + ((jsonP > 0) ? '&format_options=callback:drilldownCallback' : ''), { 
      async: blnAsync, 
      dataType: (jsonP > 0) ? 'jsonp' : 'json',
      jsonpCallback: 'drilldownCallback',
      
      error: function(jqXHR, textStatus, errorThrown ) {
         alert(textStatus + ' loading map "' + mapSettings.url + '" -> ' + errorThrown);
      },
      success: function (map) {
        // Optionally convert map
        if( conversionSetting.convert ) {
          Highcharts.maps[mapSettings.name] = Highcharts.geojson(map, conversionSetting.format);
        } else {
          Highcharts.maps[mapSettings.name] = map;
        }
      }
    });
  } else {
    // Optionally convert existing map
    if( conversionSetting.convert ) {
      Highcharts.maps[mapSettings.name] = Highcharts.geojson(Highcharts.maps[mapSettings.name], conversionSetting.format);
    }
  }
}

/* 
  Function to display ajax errors
*/
function ajaxError(jqXHR, textStatus, errorThrown ) {
  alert(textStatus + ' loading map "' + mapSettings.main.map.url + '" -> ' + errorThrown);
}