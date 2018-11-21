/**
 * In order to synchronize tooltips and crosshairs, override the
 * built-in events with handlers defined on the parent element.
 */
// $('#container').bind('mousemove touchmove touchstart', function (e) {
//     var chart,
//         point,
//         i,
//         event;

//     for (i = 0; i < Highcharts.charts.length; i = i + 1) {
//         chart = Highcharts.charts[i];
//         // Find coordinates within the chart
//         event = chart.pointer.normalize(e.originalEvent);
//         // Get the hovered point
//         point = chart.series[0].searchPoint(event, true);

//         if (point) {
//             point.highlight(e);
//         }
//     }
// });

/* Working fiddles, also with multiple series
 * https://forum.highcharts.com/highcharts-usage/synchronized-charts-with-multiple-series-t33578 
 * http://jsfiddle.net/L180p7r3/2/
 * 

*/

function bindSyncEvents() {
  // console.log('Binding sync event to ', $('#chartsContainer .chart'));
  $('#chartsContainer .chart').bind('mousemove touchmove touchstart', function(e) {
    var chart, point, i,
      currentChart = $(this).highcharts(), 
      event = currentChart.pointer.normalize(e.originalEvent),
      currentPoint = currentChart.series[0].searchPoint(event, true) ;

    if (currentPoint != undefined) {
      for (i = 0; i < Highcharts.charts.length; i = i + 1) {
        chart = Highcharts.charts[i];
        if (chart !== currentChart) {
          point = chart.series[0].searchPoint({
            chartX: currentPoint.plotX + chart.plotLeft,
            chartY: currentPoint.plotY + chart.plotTop
          }, true); // Get the hovered point

          if (point) {
            point.highlight(e);
          }
        }
      }
    }
    
  });
}
/**
 * Override the reset function, we don't need to hide the tooltips and
 * crosshairs.
 */
Highcharts.Pointer.prototype.reset = function () {
    return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function (event) {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
  var thisChart = this.chart;
  
  if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
    // if(e.min == undefined) { // zoom out -> use extremes of chart[0]
    //   e.trigger = 'zoomout';
    //   e.min = Highcharts.charts[0].xAxis[0].dataMin;
    //   e.max = Highcharts.charts[0].xAxis[0].dataMax
    // }

    Highcharts.each(Highcharts.charts, function (chart) {
      if (chart !== thisChart || e.trigger == 'zoomout') {
        if (chart.xAxis[0].setExtremes) { // It is null while updating
          chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
        }
      }
    });
  }
}