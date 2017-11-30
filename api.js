const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// by default up
let status = 'up'

// middleware
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// routes
app.get('/', (req, res) => {
  res.json({
    'status': status
  })
})

app.post('/:status', (req, res) => {
  var params = req.params.status

  if (params == 'up') {
    status = 'up'
  } else {
    status = 'down'
  }

  res.end()
})

var port = process.env.PORT || 8080
app.listen(port)
