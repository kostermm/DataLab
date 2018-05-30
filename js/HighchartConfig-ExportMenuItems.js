/* Load these modules/plugins after loading Highcharts */
<script src="<path>/exporting.js"></script>
<script src="<path>/export-csv.js"></script>
    
/* Use these settings for exportin in the chart configuration */
exporting: {
  buttons: {
    contextButton: {
      menuItems: [
        {
          textKey: 'printChart',
          onclick: function() { this.print(); }
        }, {
            separator: true
        }, {
          textKey: 'downloadPNG',
          onclick: function() { this.exportChart(); }
        }, {
          textKey: 'downloadJPEG',
          onclick: function() { this.exportChart( { type: 'image/jpeg' } ); }
        }, {
          textKey: 'downloadPDF',
          onclick: function() { this.exportChart( { type: 'application/pdf' } ); }
        }, {
          textKey: 'downloadSVG',
          onclick: function() { this.exportChart( { type: 'image/svg+xml' } ); }
        }, {
          textKey: 'downloadCSV',
          onclick: function () { this.downloadCSV(); }
        }, {
          textKey: 'downloadXLS',
          onclick: function () { this.downloadXLS(); }
        }, {
          textKey: 'viewData',
          onclick: function () { this.viewData(); }
        }
      ]
    }
  }
}