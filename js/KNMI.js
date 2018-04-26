/*
 | This code will generate a dashboard if neccessary information is provided.
 | @author Martino Kosterman
 | @date May 2018
*/


$(function () {
  url = '/knmi.php';
  params = '&byear=2018&bmonth=2&bday=13&eyear=2018&emonth=4&eday=26';
  //Load CSV data (slice result of array to skip headers)
  csvData = GetData(url, params);

});

function chartCreateCallback (chart) {
  //Remove svg.title element
  chart.title.textStr='';

};