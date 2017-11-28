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
