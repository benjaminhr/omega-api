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

function ping () {
  pingdom.checks((err, checks) => {
    if (err) throw err
    console.log(hasMessageBeenSentBefore)

    checks.forEach((check) => {
      var name = check.name
      var hostname = check.hostname
      var status = check.status
      var currentTime = Math.round(new Date() / 1000)

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

    })
  })
}

// because js doesn't have sleep()
setInterval(() => {
  ping()
  checkStatuses()
}, 4000)
