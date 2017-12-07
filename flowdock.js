const fetch = require('node-fetch')
const flowdockToken = process.env.FLOWDOCK_TOKEN || '5ebe97cf9ae259befb54bceb627e05f9'

var notification = function (name) {
  var randomThreadId = Math.floor(Math.random() * 10000) + 1

  var data = {
    'flow_token': `${flowdockToken}`,
    'event': 'activity',
    'author': {
      'name': `${name}`,
      'avatar': 'https://lh3.googleusercontent.com/BJnNSzRfzXS_hSYposOL5trRgupgQo4aP01JcoHLuBmqKY1aOgfiLpdWzDf6TzRphg=w300'
    },
    'title': 'is down',
    'external_thread_id': `${randomThreadId}`,
    'thread': {
      'title': `${name}`,
      'body': 'Fix it pls',
      'external_url': 'https://my.pingdom.com/newchecks/checks',
      'status': {
        'color': 'red',
        'value': 'down'
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

var message = function (name, status) {
  var data = {
    'flow_token': `${flowdockToken}`,
    'event': 'message',
    'content': `@team \`${name}\` ${status}!`,
  }

  // couldn't get threads to work
  // if (timestamp) data['external_thread_id'] = timestamp

  fetch('https://api.flowdock.com/messages', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(console.log('MESSAGE SENT'))
}

exports.notification = notification
exports.message = message


