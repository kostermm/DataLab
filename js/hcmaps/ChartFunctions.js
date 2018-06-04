function drawChart(selectedRegions) {
  
  var chartContainer = mapSettings.chartContainer || 'chartContainer',
      selectedKeys = [],
      categories = mapSettings.chart.dataColumns,
      chartConfig = {
        title: {
          text: mapSettings.chart.title
        },
		subtitle: {
			text: 'Houd &lt;Shift&gt; ingedrukt om meerdere gemeenten te selecteren'
		},
        series: [{
          data: chartDataArr
        }],
       // type: 'line',
        xAxis: {
		  type: 'category',
          categories: categories
        },
        yAxis: {
          title: {
            text: mapSettings.legendTitle
          },
          min: ( mapSettings.chart.yAxis.min ),
          max: ( mapSettings.chart.yAxis.max )
        },
        chart: {
          width: null,
          height: null,
          margin: null,
          // marginBottom: 100
        },
        exporting: {
          filename: mapSettings.chart.title
        },
        series: []
      },
      key, chartData = [], chartDataArr = [], series = [];
  
  $.each(selectedRegions, function(i, item) {
    regionKey = item[mapSettings.main.map.key],
    regionName = item[mapSettings.main.data.nameProp];
    
    // Filterdata 
    regionData = FilterData(mapData, filter = { 
      property: mapSettings.main.data.chartKey, 
      value: regionKey 
    });
    
    // Get data points from regionData
    chartDataArr = [];
    $.each(categories, function(i, item) {
      chartDataArr[i] = regionData[0][item];
    });
    
    // Create series with name and data
    series.push({
        id: regionKey,
        name: regionName,
        data: chartDataArr
      }
    );
    
  });
  
  if( detailChart == undefined )
  {  // Initiate the chart with series added to charttConfig
    // Set specific chart theme
    Highcharts.setOptions(Highcharts.chartTheme);
  
    detailChart =  Highcharts.chart(chartContainer, $.extend(true, chartConfig, {series: series}));
  } else {
    // Update chart: remove all series and add selected regions
    var seriesLength = detailChart.series.length;
    for(var i = seriesLength - 1; i > -1; i--) {
        detailChart.series[i].remove(false);
    }
    $.each(series, function(i, serie) {
      detailChart.addSeries(serie, false);
    });
    detailChart.redraw();
  }
}