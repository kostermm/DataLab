// Load options for a select dropdown with 'id' from dataUrl and set selectedOption
function loadSelect(id, dataUrl, selectedOption) {
	var selectDropdown = $('#'+ id);
	$.ajax({
		url: dataUrl,
		dataType: 'text',
		success: function(data) {
			data = JSON.parse(data).value;
			$.each(data, function(index, item) {
				selectDropdown.append("<option value='" + item.Key + "'>" + item.Title + "</option>");
			});
			// set default
			if(selectedOption != undefined) {
				selectDropdown.find('option[value=' + selectedOption.key + ']').prop('selected', true);
			}
		}
	});

}

// default options
var selectedOptions = { 
	lftkls: {
		key: 10000,
		name: 'Totaal alle leeftijden'
	},
	gesl: {
		key: 1100,
		name: 'Totaal mannen en vrouwen'
	},
	jaar: {
		key: 2015,
		name: '2015'
	},
	week: {
		key: 20,
		name: 'week 20'
	}
}

$(function () {
	// load options for select dropdown
	loadSelect('gesl', 'https://opendata.cbs.nl/ODataApi/odata/70895ned/Geslacht', { key: 3000 });
	loadSelect('lftkls', 'https://opendata.cbs.nl/ODataApi/odata/70895ned/LeeftijdOp31December');

	// Dropdown events
	$('select').on('change', function () {	
		selectId = this.id;
		selectedOptions[selectId].key = this.selectedOptions[0].value;
		selectedOptions[selectId].name = this.selectedOptions[0].text;
	});

				
	// $("#lftkls, #gesl").on("change", function(evt){
	// $.ajax({
	// 	// statische URL voor de initi�le view:
	// 	url: "https://opendata.cbs.nl/ODataApi/odata/70895ned/TypedDataSet?$filter=(Geslacht+eq+'1100')+and+LeeftijdOp31December+eq+'10000'&$select=Perioden,Overledenen_1",
	// 	//dynamische URL die (zou moeten) reageren op de hierboven ge�nitialiseerde pulldown menu's:
	// 	//url: "https://opendata.cbs.nl/ODataApi/odata/70895ned/TypedDataSet?$filter=(Geslacht+eq+'" + gesl2 + "')+and+LeeftijdOp31December+eq+'" + lftkls2 + "'&$select=Perioden,Overledenen_1",
	// 	dataType: 'text',
	// 	success: function( data ) {
	// 		data = JSON.parse(data).value;
			
	// 		//alert (gesl2);
	// 		//alert (geslnm2);
	// 		//alert (lftkls2);
	// 		//alert (lftklsnm2);
	// 		var xCategories = [];
	// 		var seriesData1 = [];
	// 		var seriesData2 = [];
	// 		var seriesData3 = [];
	// 		for(var i = 0; i < data.length; i++){
	// 			if (data[i].Perioden.substring(0,6) == "2016W1") {
	// 				var cat = data[i].Perioden.substring(6,8);
	// 				xCategories[xCategories.length] = cat;
	// 				var series1 = Number(data[i].Overledenen_1);
	// 				seriesData1[seriesData1.length] = series1;
	// 			}
	// 			if (data[i].Perioden.substring(0,6) == "2017W1") {
	// 				var series2 = Number(data[i].Overledenen_1);
	// 				seriesData2[seriesData2.length] = series2;
	// 			}
	// 			if (data[i].Perioden.substring(0,6) == "2018W1") {
	// 				var series3 = Number(data[i].Overledenen_1);
	// 				seriesData3[seriesData3.length] = series3;
	// 			}
	// 		}	 
			
	// 		var options = {
	// 			chart: {
	// 				renderTo: 'sterfteperweek',
	// 				type: 'spline',
	// 				marginRight: 50
	// 			},
	// 			colors: categorie,
	// 			title: {
	// 				text: 'Aantal sterfgevallen per week'
	// 			},
	// 			subtitle: {
	// 				text: geslnm2 + ', ' + lftklsnm2
	// 			},
	// 			xAxis: {
	// 				title: {
	// 					text: 'Weeknummers'
	// 				},
	// 				categories: xCategories,
	// 				tickInterval: 3,
	// 				tickmarkPlacement: 'on'
	// 			},
	// 			yAxis: {
	// 				title: {
	// 					text: 'Aantal'
	// 				},
	// 				//allowDecimals: false,
	// 				//min: 55,
	// 				//tickInterval: 2
	// 			},
	// 			tooltip: {
	// 				headerFormat: '<large>Weeknummer: <strong>{point.key}</strong></large><br>',
	// 				//valueSuffix: ' jaar',
	// 				shared: true,
	// 				valueDecimals: 0,
	// 				//crosshairs: true		
	// 			},
				
	// 			/*tooltip: {
	// 				formatter: function() {
	// 					var s = '<b>'+ this.x +'</b>',
	// 						verschil = 0;
						
	// 					$.each(this.points, function(i, point) {
	// 						s += '<br/>'+ point.series.name +': '+
	// 							point.y +' jaar';
	// 					});
	// 					var verschil= Math.round((this.points[1].y - this.points[0].y)*100)/100;
						
	// 					s += '<br/><strong>verschil: '+verschil+ ' jaar</strong>';
						
	// 					return s;
	// 				},
	// 				shared: true
	// 			},*/				
	// 			series: [{
	// 				name: '2016',
	// 				data: seriesData1
	// 			},{
	// 				name: '2017',
	// 				data: seriesData2
	// 			},{
	// 				name: '2018',
	// 				data: seriesData3
	// 			}]
	// 		}
	// 		Highcharts.setOptions(Highcharts.chartTheme);
	// 		var chart = new Highcharts.Chart(options);
			
	// 	}
	// });	
	// });	
	// $('#lftkls, #gesl').trigger('change');
});