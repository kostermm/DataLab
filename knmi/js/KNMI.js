/*
 | This code will generate a dashboard if neccessary information is provided.
 | @author Martino Kosterman
 | @date May 2018
*/


function getTemperatureData(bYear, eYear) {
  url = 'knmi/';
  params = '&byear='+ (bYear || '2018') + '&bmonth=1&bday=1&eyear='+ (eYear || '2018') + '&emonth=12&eday=31';


  //Load CSV data (slice result of array to skip headers)
  csvData = GetData(url, params);
  // console.log((csvData));

  parsedData = parseCSV(csvData, [0]);
  // console.log(parsedData);

  return parsedData;
};

// Parse two-dimensional array of strings
// skipColumns: array of column numbers to skip
function parseCSV (arrCSV, skipColumns ) {
  var rows = [], week = -1, date = Date;
  var dayToUse = 3;
  var date = new Date();

  // console.log('parseCSV', arrCSV);

  $.each(arrCSV, function (rowNo, row) {
    // remove columns
    row.splice(skipColumns[0],1);
    // parse date, check for dayToUse and filter
    date = parseDate(row[0]);
      row[0] = date;//.toLocaleDateString("en-US");
      
      row.forEach( function(value, i, arr) {
        if( i == 0 ) {
          // first element (date) is not parsed to float
        } else {
          arr[i] = parseFloat(value)/10;
        }
      })
      rows.push(row);
  });

  return rows;
};

// Parse two-dimensional array of strings
// skipColumns: array of column numbers to skip
function parseDate (strDate) {
  var year = Number(strDate.substr(0, 4))
    , month = Number(strDate.substr(4, 2)) - 1
    , day = Number(strDate.substr(6, 2));

  return new Date(year, month, day);
};

// This script is released to the public domain and may be used, modified and
// distributed without restrictions. Attribution not necessary but appreciated.
// Source: https://weeknumber.net/how-to/javascript

// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
  var date = new Date(this.getTime());
   date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function() {
  var date = new Date(this.getTime());
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  return date.getFullYear();
}