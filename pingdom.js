const credentials = {
  user: 'hostmaster@appgyver.com',
  pass: 'lolcatisappgyvercat',
  appkey: 'u0xcts0z84rfrc4lw95ip7to3x754a81'
}

const flowdock = require('./flowdock')
const fetch = require('node-fetch')
const p = require('pingdom-api')
const pingdom = p(credentials)
const baseUrl = 'http://localhost:8080/'

let statuses = []
let hasMessageBeenSentBefore = {}

function checkStatuses() {
  if (statuses.includes('down')) {
    console.log(statuses)
    statuses = []

    fetch(baseUrl + 'down', {
      method: 'POST'
    })

  } else {
    console.log(statuses)
    fetch(baseUrl + 'up', {
      method: 'POST'
    })
    statuses = []
  }
}

function ping() {
  pingdom.checks((err, checks) => {
    if (err) throw err
    console.log(hasMessageBeenSentBefore)

    checks.forEach((check) => {
      var name = check.name
      var status = check.status
      var lasterrortime = check.lasterrortime
      var currentTime = Math.round(new Date() / 1000)

      if (status == 'down' && !name.includes('usetrace')) {

        if (!hasMessageBeenSentBefore.hasOwnProperty(name)) {
          hasMessageBeenSentBefore[name] = currentTime
          flowdock.send(name, lasterrortime)
          statuses.push(check.status)
        } else {
          statuses.push(check.status)

          // Here the time between each notification can be changed
          if (currentTime - hasMessageBeenSentBefore[name] > 300) {
            console.log('DELETED')
            delete hasMessageBeenSentBefore[name]
          }

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