const fetch = require('node-fetch')

var send = function(name, lasterrortime) {
  var date = new Date()
  var timestamp = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  // var flowdock_token = "5ebe97cf9ae259befb54bceb627e05f9"
  var flowdock_token = process.env.FLOWDOCK_TOKEN
  var randomThreadId = Math.floor(Math.random() * 10000) + 1

  var data = {
    "flow_token": `${flowdock_token}`,
    "event": "activity",
    "author": {
      "name": `${name}`,
      "avatar": "https://lh3.googleusercontent.com/BJnNSzRfzXS_hSYposOL5trRgupgQo4aP01JcoHLuBmqKY1aOgfiLpdWzDf6TzRphg=w300"
    },
    "title": "is down",
    "external_thread_id": `${randomThreadId}`,
    "thread": {
      "title": `${name}`,
      "body": "Fix it pls",
      "external_url": "https://my.pingdom.com/newchecks/checks",
      "status": {
        "color": "red",
        "value": "down"
      }
    }
  }

  fetch('https://api.flowdock.com/messages', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(console.log('NOTIFICATION SENT'))
}


exports.send = send;