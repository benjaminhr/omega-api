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

    checks.forEach((check) => {
      if (check.status == 'down' && !check.name.includes('usetrace')) {
        var name = check.name
        var lasterrortime = check.lasterrortime
        
        flowdock.send(name,lasterrortime)
        statuses.push(check.status)        
      }
    })

  })
}

// because js doesn't have sleep()
setInterval(() => {
  ping()
  checkStatuses()
}, 4000)