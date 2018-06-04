/*
The purpose of this demo is to demonstrate how multiple charts on the same page
can be linked through DOM and Highcharts events and API methods. It takes a
standard Highcharts config with a small variation for each data set, and a
mouse/touch event handler to bind the charts together.
*/



// Get the data. The contents of the data file can be viewed at
$.getJSON(
    'https://cdn.rawgit.com/highcharts/highcharts/057b672172ccc6c08fe7dbb27fc17ebca3f5b770/samples/data/activity.json',
    function (activity) {
        $.each(activity.datasets, function (i, dataset) {

            // Add X values
            dataset.data = Highcharts.map(dataset.data, function (val, j) {
                return [activity.xData[j], val];
            });

            $('<div class="chart">')
                .appendTo('#container')
                .highcharts({
                    chart: {
                        marginLeft: 40, // Keep all charts left aligned
                        spacingTop: 20,
                        spacingBottom: 20
                    },
                    title: {
                        text: dataset.name,
                        align: 'left',
                        margin: 0,
                        x: 30
                    },
                    // credits: {
                    //     enabled: false
                    // },
                    // legend: {
                    //     enabled: false
                    // },
                    xAxis: {
                        crosshair: true,
                        // events: {
                        //     setExtremes: syncExtremes
                        // },
                        // labels: {
                        //     format: '{value} km'
                        // }
                    },
                    // yAxis: {
                    //     title: {
                    //         text: null
                    //     }
                    // },
                    // tooltip: {
                    //     positioner: function () {
                    //         return {
                    //             // right aligned
                    //             x: this.chart.chartWidth - this.label.width,
                    //             y: 10 // align to title
                    //         };
                    //     },
                    //     borderWidth: 0,
                    //     backgroundColor: 'none',
                    //     pointFormat: '{point.y}',
                    //     headerFormat: '',
                    //     shadow: false,
                    //     style: {
                    //         fontSize: '18px'
                    //     },
                    //     valueDecimals: dataset.valueDecimals
                    // },
                    series: [{
                        data: dataset.data,
                        name: dataset.name,
                        type: dataset.type,
                        // color: Highcharts.getOptions().colors[i],
                        // fillOpacity: 0.3,
                        // tooltip: {
                        //     valueSuffix: ' ' + dataset.unit
                        // }
                    }]
                });
        });
        
        bindEvents(); 
    }

   
);
