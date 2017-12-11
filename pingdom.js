const credentials = {
  user: process.env.P_USER || 'hostmaster@appgyver.com',
  pass: process.env.P_PASS || 'lolcatisappgyvercat',
  appkey: process.env.P_APP_KEY || 'k0gppsbnl749ln89wy0m7a7a86hkztk6'
}

const baseUrl = process.env.BASE_URL || 'http://localhost:8080/'
const flowdock = require('./flowdock')
const fetch = require('node-fetch')
const p = require('pingdom-api')
const pingdom = p(credentials)

let statuses = []
let hasMessageBeenSentBefore = {}

function checkStatuses () {
  console.log(statuses)

  if (statuses.length > 0) {
    statuses = []

    fetch(baseUrl + 'down', {
      method: 'POST'
    })
  } else {
    fetch(baseUrl + 'up', {
      method: 'POST'
    })
    statuses = []
  }
}

function handleNotifications(name, status, currentTime) {
  // send notification once, if item is back up 
  if (status === 'up' && hasMessageBeenSentBefore.hasOwnProperty(name)) {

    if (hasMessageBeenSentBefore[name].statusBackUp != true) {
      flowdock.message(name, 'is back up')
    }

    hasMessageBeenSentBefore[name].statusBackUp = true
  }

  // Here the time (seconds) between each notification can be changed
  if (hasMessageBeenSentBefore[name]) {
    if (currentTime - hasMessageBeenSentBefore[name].notificationTimestamp > 600) {
      console.log('DELETED')
      delete hasMessageBeenSentBefore[name]
    }
  }
}

function ping () {
  pingdom.checks((err, checks) => {
    if (err) throw err
    console.log(hasMessageBeenSentBefore)

    checks.forEach((check) => {
      let name = check.name
      let hostname = check.hostname
      let status = check.status
      let currentTime = Math.round(new Date() / 1000)

      if (status === 'down' && !name.includes('usetrace') && hostname.includes('appgyver')) {
        statuses.push(status)

        if (!hasMessageBeenSentBefore.hasOwnProperty(name)) {
          let propertyData = {
            'notificationTimestamp': currentTime,
            'statusBackUp': false
          }
          hasMessageBeenSentBefore[name] = propertyData

          flowdock.notification(name)
          flowdock.message(name, 'is down')
        }
      }

      handleNotifications(name, status, currentTime)

    })
  })
}

var healthcheck = function() {
  fetch('https://healthchecks.io/api/v1/checks/\?tag\=push-notifications', {
    headers: {
      'X-Api-Key': 'WiUV-CaAto5_wUmhLU7ZmV_RlK2I7K_d'
    }
  })
  .then(data => data.json())
  .then((data) => {
    let checks = data.checks
    let currentTime = Math.round(new Date() / 1000)

    checks.forEach((check) => {
      let status = check.status
      let name = check.name

      if (status === 'down') {
        if (!hasMessageBeenSentBefore.hasOwnProperty(name)) {
          let propertyData = {
            'notificationTimestamp': currentTime,
            'statusBackUp': false
          }
          hasMessageBeenSentBefore[name] = propertyData

          flowdock.notification(name)
          flowdock.message(name, 'is down')
        }
      }
      
      handleNotifications(name, status, currentTime)

    })
  })
}

// because js doesn't have sleep()
setInterval(() => {
  ping()
  healthcheck()
  checkStatuses()
}, 4000)
