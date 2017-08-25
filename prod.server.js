var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var port = process.env.PORT || config.build.port

var app = express()

var apiRoutes = express.Router()

apiRoutes.get('/getDiscList', (req,res) => {
  axios.get('https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',{
    headers: {
      referer: 'http://y.qq.com',
      host: 'y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})
apiRoutes.get('/lyric', (req,res) => {
  axios.get('https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',{
    headers: {
      referer: 'http://y.qq.com',
      host: 'y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret=response.data
    if(typeof(ret)=="string") {
      let matches= ret.match(/^\w+\(({[^()]+})\)$/)
       res.json(JSON.parse(matches[1]))
    }
  }).catch((err) => {
    console.log(err)
  })
})
app.use('/api', apiRoutes)

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})