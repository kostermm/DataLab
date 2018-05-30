/*
 | Functions for data and feature manipulation
 | @author Martino Kosterman
 | @date March 2017
*/

/*
  GetData will download a csv data file from given url
*/
function GetData(url, postData) {
  var arrData = [], getHeaders = true;

  $.ajax(url, {
    method: 'POST',
    data: postData,
    dataType: 'text',
    async: false,
    success: function (data) {
      // console.log(data);
      var lineSeparator = '\r\n',
        lines = [],
        columnCount = 0;

      // Which line separator? Windows (CR LF)= '\r\n\'; Unix/OS X = '\r';  Mac (CR) = '\n'
      if (data.indexOf(lineSeparator) == -1) {
        lineSeparator = '\n';

        if (data.indexOf(lineSeparator) == -1) {
          lineSeparator = '\r';
        }
      }

      // Split the lines
      lines = data.split(lineSeparator);

      // Iterate over the lines and add categories or series
      $.each(lines, function (lineNo, line) {
        var items = line.split(',');
        var dataRow = [];

        // Get number of Cols from first row
        if (lineNo == 0) {
          columnCount = items.length
        }

        // header line may contain headers; only retrieved if getHeaders = true
        if (lineNo == 0 && getHeaders) {
          $.each(items, function (itemNo, item) {
            dataRow.push($.trim(item));
          });

          //Push row to data array
          arrData.push(dataRow);

        } else if (items.length == columnCount) {
          // the rest of the lines contain data
          $.each(items, function (itemNo, item) {
            dataRow.push($.trim(item));
          });

          //Push row to data array
          arrData.push(dataRow);

        } else {
          // console.log('CSV data row ' + lineNo + ' skipped: ' + items);
        }
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(textStatus + ' loading "' + url + '" -> ' + errorThrown);
    }
  });

  return arrData;

};
/*
  Convert array to object with properties given
  - arrData: two dimensional array
  -
*/
function ConvertDataArrayToArrayOfObjects(arrData, dataSettings) {
  // dataSettings.dataColumns, dataSettings.drilldownKey, dataSettings.tableNameProp
  // console.log('drilldownKey: ');console.log(drilldownKey);
  if (dataSettings.tableNameProp == undefined) dataSettings.tableNameProp = 0;
  if (dataSettings.valueProp == undefined) dataSettings.valueProp = 'value';

  // find corresponding feature
  var convertedArray = $.map(arrData,
    function (dataPoint, index) {
      var arr = {};

      $.each(dataSettings.dataColumns, function (index, dataColumn) {
        if ($.isNumeric(dataPoint[index])) {
          arr[dataColumn] = parseFloat(dataPoint[index]);
        } else {
          if (dataPoint[index] != '') {
            arr[dataColumn] = dataPoint[index];
          } else {
            arr[dataColumn] = null;
          }
        }
      });
      arr['x'] = arr[dataSettings.nameProp];
      arr['value'] = arr[dataSettings.valueProp];
      // arr['name'] = 'naam';

      // drilldownkey?
      if (dataSettings.drilldownKey != undefined) {
        arr['drilldown'] = arr[dataSettings.drilldownKey];
      }

      return arr;

    });

  return convertedArray;
}

/*
  Filter array of data object
  features: collection of features
  filter:   object with filter.property with filter.value
*/
function FilterData(dataArr, filter) {
  // example: filter = { property: 'GM_CODE', value: 'GM0014' }
  filteredArr = jQuery.grep(dataArr, function (point) {
    return point[filter.property] == filter.value;
  });

  return filteredArr;
}

/*
  features: collection of features
  filter:   object with filter.property with filter.value
*/
function FilterFeatures(features, filter) {

  // find corresponding feature
  var filteredFeatures = $.map(features,
    function (feature, index) {
      // Test for filter AND existing geometry
      if (feature.properties[filter.property] == filter.value && feature.geometry !=
        null) {
        if (feature.name === undefined) feature.name = feature.properties[
          filter.property];
        return feature;
      } else {
        return null;
      }
    });

  return filteredFeatures;
}

/*
  Test features for valid geometry
*/
function InvalidFeatures(features) {
  var invalidFeatures = $.map(features,
    function (feature) {
      // Test NULL geometry
      if (feature.geometry == null) {
        return feature;
      } else {
        return null;
      }
    });

  return invalidFeatures;

}

/*
  Helper function to save JSON object as text file
*/
function downloadObjectAsJSON(jsonObject) {

  var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(
    jsonObject));

  var a = document.createElement('a');
  a.href = 'data:' + data;
  a.download = 'data.json';
  a.innerHTML = 'download JSON';

  $('.container').append(a);

}

/*
  Download a geojson file using ajax and optionally convert with H.geojson
  - mapSettings: settings containing name, url
  - blnAsync: optional boolean to force synchronous download
  - conversionSetting: Settings for conversion:
      convert: boolean
      format: map, mapline or mappoint
*/
function getMap(mapSettings, blnAsync, conversionSetting) {
  var defaultConversionSettings = {
    convert: true,
    format: 'map'
  };
  // If sync setting not given, set to default value
  if (blnAsync == undefined) blnAsync = true;
  // if no conversion settings are given, use deafult settings
  if (conversionSetting == undefined) {
    conversionSetting = defaultConversionSettings
  } else {
    // if only boolean given, change to object with format
    if (conversionSetting == true) {
      conversionSetting = defaultConversionSettings
    }
  }

  // jsonP call?
  var jsonP = mapSettings.url.indexOf('outputFormat=text/javascript');

  // Download the map if not yet downloaded
  if (Highcharts.maps[mapSettings.name] == undefined) {
    $.ajax(mapSettings.url + ((jsonP > 0) ?
      '&format_options=callback:jsonpCallback' : ''), {
      async: blnAsync,
      dataType: (jsonP > 0) ? 'jsonp' : 'json',
      jsonpCallback: 'jsonpCallback',

      error: function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ' loading map "' + mapSettings.url + '" -> ' +
          errorThrown);
      },
      success: function (map) {
        // Optionally convert map
        if (conversionSetting.convert) {
          Highcharts.maps[mapSettings.name] = Highcharts.geojson(map,
            conversionSetting.format);
        } else {
          Highcharts.maps[mapSettings.name] = map;
        }
      }
    });
  } else {
    // Optionally convert existing map
    if (conversionSetting.convert) {
      Highcharts.maps[mapSettings.name] = Highcharts.geojson(Highcharts.maps[
        mapSettings.name], conversionSetting.format);
    }
  }
}

/*
  Function to display ajax errors
*/
function ajaxError(jqXHR, textStatus, errorThrown) {
  alert(textStatus + ' loading map "' + mapSettings.main.map.url + '" -> ' +
    errorThrown);
}
