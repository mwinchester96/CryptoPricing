/*
Get historical data from begin date to end date and display
on HTML page
*/

let restEndpoint = "https://api.prime.coinbase.com"
let dataTable = document.getElementById('historical-data-table');
let startDateInput = document.getElementById('start-date-input');
let endDateInput = document.getElementById('end-date-input');
let granularityInput = document.getElementById('granularity-input');
let productIdInput = document.getElementById('product-id-input');
let submitRequestButton = document.getElementById("submit-request-button");

var populateTable = function(responseText) {
  data = JSON.parse(responseText);
  createTable(data);
}

// Get data and populate table
var getHistoricalData = function(productId, startDate, endDate, granularity) {
  var historicalDataUrl = "/products/" + productId + "/candles"
  var params = "start=" + startDate + "&" + "end=" + endDate + "&" + "granularity=" + granularity;
  var requestUrl = restEndpoint + historicalDataUrl + "?" + params;

  httpGetAsync(requestUrl, populateTable);
}

// Helper func to send HTTP get request
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function createTable(tableData) {
  var table = document.createElement('table');
  var tableBody = document.createElement('tbody');
  var headers = ["time", "low", "high", "open", "close", "volume"];

  headerRow = document.createElement('tr');
  headers.forEach(function(headerTitle) {
    var cell = document.createElement('th');
    cell.appendChild(document.createTextNode(headerTitle));
    headerRow.appendChild(cell);
  });
  tableBody.appendChild(headerRow);

  tableData.forEach(function(rowData) {
    var row = document.createElement('tr');

    rowData.forEach(function(cellData) {
      var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  document.body.appendChild(table);
}

// Run functions to populate table

submitRequestButton.onclick = function() {
  var startDate = startDateInput.value;
  var endDate = endDateInput.value;
  var granularity = granularityInput.value;
  var productId = productIdInput.value;
  historicalData = getHistoricalData(productId, startDate, endDate, granularity);
};
