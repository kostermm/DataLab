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

  chart.drilldownTitle = chart.renderer.label(drilldownTitleOptions.text,
      drilldownTitleOptions.x, drilldownTitleOptions.y)
    .css(drilldownTitleOptions.style)
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
    drilldownData = FilterData(csvDrilldownData, filter = {
      property: mapSettings.main.data.drilldownKey,
      value: parentKey
    });

    // set title for drilldown map
    chart.drilldownTitle.attr({
      text: mapSettings.drilldown.map.titlePrefix + parentName
    });

    // Hide loading and add series
    chart.hideLoading();
    // clearTimeout(fail);
    chart.addSeriesAsDrilldown(e.point, {
      name: parentName,
      data: drilldownData,
      mapData: Highcharts.maps[mapSettings.drilldown.map.name],
      joinBy: [mapSettings.drilldown.map.key, mapSettings.drilldown.data.key],
      keys: mapSettings.drilldown.data.tableColumns || mapSettings.drilldown
        .data.dataColumns,
      allAreas: false,
      tooltip: {
        // headerFormat: '{series.name}<br/>',
        pointFormat: '{point.properties.' + mapSettings.drilldown.map.nameProp +
          '}: <b>{point.value}</b>'
      },
    });
  }
}

/*
  Drillup event function to reset chart.subtitle
  Context this is chart object
*/
function drillup(e) {
  this.drilldownTitle.attr({
    text: Highcharts.defaultOptions.chart.drilldownTitle.text
  });
}
