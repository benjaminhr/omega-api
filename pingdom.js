const credentials = {
  user: 'hostmaster@appgyver.com',
  pass: 'lolcatisappgyvercat',
  appkey: 'u0xcts0z84rfrc4lw95ip7to3x754a81'
}

const fetch = require('node-fetch')
const pingdom = require('pingdom-api')
const p = pingdom(credentials)
const baseUrl = 'http://localhost:8080/'

function ping() {
  p.checks((err, checks) => {
    if (err) throw err

    checks.forEach((check) => {
      if (check.status == 'down' && !check.name.includes('usetrace')) {
        fetch(baseUrl + 'down', {
          method: 'POST'
        })  
      } else {
        fetch(baseUrl + 'up', {
          method: 'POST'
        })  
      }
    })

  })
}

// because js doesn't have sleep()
setInterval(() => ping(), 5000)

function flowdock(name) {
  var timestamp = new Date.now().toUTCString()
  var flowdock_token = "5ebe97cf9ae259befb54bceb627e05f9"

  var data = {
    "flow_token": `${flowdock_token}`,
    "event": "activity",
    "author": {
      "name": `${name}`,
      "avatar": "https://lh3.googleusercontent.com/BJnNSzRfzXS_hSYposOL5trRgupgQo4aP01JcoHLuBmqKY1aOgfiLpdWzDf6TzRphg=w300"
    },
    "title": "is down",
    "external_thread_id": `${timestamp}`,
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
  .then(data => data.json())
  .then(json => console.log(json))
}
