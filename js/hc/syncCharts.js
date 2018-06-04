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

function bindEvents() {
  $('#chartsContainer .chart').bind('mousemove touchmove touchstart', function(e) {
    var currentChart = $(this).highcharts(),
      chart,
      event = currentChart.pointer.normalize(e.originalEvent),
      currentPoint = currentChart.series[0].searchPoint(event, true),
      point,
      i;

    if (point) {
      point.highlight(e);
    }

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
