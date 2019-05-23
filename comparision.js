
/*
Apps Script code
Comparing the 3X execution time of 20 calls to Shooping Content API :: products :: list
with built-in service and plain URL fetch
*/

var merchantId = 'XXXXXXXXX'
var LIMIT = 20

function serviceFetch() {
  var service = ShoppingContent.Products
  var nextToken = true, fetches = 0
  var start = +new Date()
  while (nextToken && fetches < LIMIT) {
    var response = service.list(merchantId)
    var nextToken = response.nextPageToken
    fetches++
  }
  var time = (+new Date() - start) / 1000
  Logger.log('serviceFetch :: Time elapsed %s, fetches %s', time, fetches)
  return time
}

function urlFetch() {
  var token = ScriptApp.getOAuthToken()
  var oprions   = {
    method:"GET",
    headers:{ Authorization:"Bearer "+token}
  }
  var nextToken = 'blank', fetches = 0
  var start = +new Date()
  while (nextToken && fetches < LIMIT) {
    var query = 'https://www.googleapis.com/content/v2.1/merchantId/products'.replace('merchantId', merchantId) +
      ((nextToken != 'blank') ? ('?pageToken=' + nextToken) : '')
    var urlResponse = UrlFetchApp.fetch(query, oprions)
    var urlResponseObj = JSON.parse(urlResponse.getContentText())
    var nextToken = urlResponseObj.nextPageToken
    fetches++
  }
  var time = (+new Date() - start) / 1000
  Logger.log('urlFetch :: Time elapsed %s, fetches %s', time, fetches)
  return time

}

function compare() {
  var sheet = SpreadsheetApp.create('comparison').getSheets()[0].clear()
  var data = [['iteration', 'fetches', 'serviceFetch', 'urlFetch']]
  for (var i = 0; i < 4; i++) {
  data.push([i, LIMIT, serviceFetch(), urlFetch()])
  }
  sheet.getRange(1, 1, i + 1, data[0].length).setValues(data)
  Logger.log('relust data sheet %s', sheet.getParent().getUrl())
}


/*
Google Ads Script code
Checking the 3X execution time of 20 calls to Shooping Content API :: products :: list
with built-in service and plain URL fetch
*/

function main() {
  var merchantId = 'XXXXXXXXX'
  var LIMIT = 20

  function serviceFetch() {
    var service = ShoppingContent.Products
    var nextToken = true, fetches = 0
    var start = +new Date()
    while (nextToken && fetches < LIMIT) {
      var response = service.list(merchantId)
      var nextToken = response.nextPageToken
      fetches++
    }
    var time = (+new Date() - start) / 1000
    Logger.log('serviceFetch :: Time elapsed %s, fetches %s', time, fetches)
    return time
  }

  var sheet = SpreadsheetApp.create('serviceFetch AdWords').getSheets()[0].clear()
  var data = [['iteration', 'fetches', 'serviceFetch']]
  for (var i = 0; i < 4; i++) {
  data.push([i, LIMIT, serviceFetch()])
  }
  sheet.getRange(1, 1, i + 1, data[0].length).setValues(data)
  Logger.log('relust data sheet %s', sheet.getParent().getUrl())
}
