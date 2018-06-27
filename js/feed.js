let ws = new WebSocket('wss://ws-feed.gdax.com');

let subRequest =
    // Request
    // Subscribe to ETH-USD and ETH-EUR with the level2, heartbeat and ticker channels,
    // plus receive the ticker entries for ETH-BTC and ETH-USD
    {
        "type": "subscribe",
        "product_ids": [
            "ETH-USD",
        ],
        "channels": [
            "level2",
            "heartbeat",
            {
                "name": "ticker",
                "product_ids": [
                    "ETH-USD"
                ]
            }
        ]
    }

let currAsk = document.getElementById('currAsk')
let currBid = document.getElementById('currBid')
let coin = document.getElementById('coin')
let currency = document.getElementById('currency')

ws.onopen = function() {
    // Subscribe to the channel
    ws.send(JSON.stringify(subRequest));
}

ws.onmessage = function(msg) {
    //console.log(JSON.parse(msg.data));
    var update = JSON.parse(msg.data)

    if (update.product_id) {
        coin.innerHTML = update.product_id.split("-")[0]
        currency.innerHTML = update.product_id.split("-")[1]
        if (update.changes) {
            var changes = update.changes[0]
            if (changes[0] == "buy") {
                currBid.innerHTML = changes[1];
            }
            if (changes[0] == "sell") {
                currAsk.innerHTML = changes[1];
            }
        }
    }
}

// Object { type: "l2update", product_id: "ETH-EUR", time: "2018-06-26T19:47:08.562Z", changes: (1) […] }