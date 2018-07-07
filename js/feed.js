// Set up vars
let ws = new WebSocket('wss://ws-feed.prime.coinbase.com');
let feedTable = document.getElementById('feed-table');
let allProductIds = [];

let productIdInputBox = document.getElementById('product-id-input');
let productIdSubscribeButton = document.getElementById('submit-product-id');

productIdSubscribeButton.onclick = function(){
  subscribeToNewProduct(productIdInputBox.value)
};

// Using product_id, create or alter existing row
var addOrAlterRow = function(product_id, update) {
  var type = update[0];
  var price = update[1];

  // Already exists
  if(allProductIds.indexOf(product_id) > -1) {
    var currRow = document.getElementById(product_id);
    if(type == "buy") {
      currRow.cells[1].innerHTML = price;
    } if(type = "sell") {
      currRow.cells[2].innerHTML = price;
    }
  }

  // Create new row
  else {
    var newRow = feedTable.insertRow();
    newRow.id = product_id;

    var idCell = newRow.insertCell(0);
    var buyCell = newRow.insertCell(1);
    var sellCell = newRow.insertCell(2);
    
    newRow.cells[0].innerHTML = product_id
    if(type == "buy") {
        buyCell.innerHTML = product_id
    } if(type = "sell") {
        sellCell.innerHTML = product_id
    }
    allProductIds.push(product_id);
  }
}

var subscribeToNewProduct = function(product_id) {
  let subRequest =
    // Request
    // Subscribe to ETH-USD and ETH-EUR with the level2, heartbeat and ticker channels,
    // plus receive the ticker entries for ETH-BTC and ETH-USD
    {
        "type": "subscribe",
        "product_ids": [
            product_id,
        ],
        "channels": [
            "level2",
            "heartbeat"
        ]
    }

    // Subscribe to the channel
    ws.send(JSON.stringify(subRequest));
}

ws.onopen = function() {
    // Subscribe to the channel
}

ws.onmessage = function(msg) {
    var update = JSON.parse(msg.data)

    // Add pricing update if id is available and is correct type
    if (update.product_id && update.type == "l2update") {
      addOrAlterRow(update.product_id, update.changes[0]);
    }

    else {
      console.log(update);
    }
}