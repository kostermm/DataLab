
(function (H) {
  // Wrap prototype functions to add extra functionality
  
  // Add marginTopp for first mapline serie in legend, if set in theme
  H.wrap(H.Legend.prototype, 'positionItem', function(proceed, item) {
    var legend = this;
    
    if (item._legendItemPos) {
      if( item.options && item.options.type == 'mapline' &&  Highcharts.defaultOptions.legend.maplineMarginTop != undefined ) {
          item._legendItemPos[1] = item._legendItemPos[1] + ( Highcharts.defaultOptions.legend.maplineMarginTop || 0)
      } 
      proceed.call(legend, item);
    }
  });
  
  // Add border around legend symbols
  H.wrap(H.Legend.prototype, 'renderItem', function(proceed, item) {
    var legend = this;
    
    proceed.call(legend, item);
    
    // Set border around legend items of map type charts which have a legendSymbol defined
    if( $.inArray('map', this.chart.types) != -1 && item.legendSymbol != undefined ) {
      $(item.legendSymbol.element).attr({
        'stroke-width': this.chart.options.legend.itemBorderWidth,
        'stroke': this.chart.options.legend.itemBorderColor
      });
    }
  });
  
}(Highcharts));
