const { Server } = require('@logux/server')
const mongoose = require('mongoose')

// https://mongoosejs.com/docs/index.html
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const dbConnection = mongoose.connection

dbConnection.on('error', console.error.bind(console, 'connection error:'))
dbConnection.once('open', function () {
  console.log('mongodb connected'); // eslint-disable-line
})

// https://github.com/logux/logux/blob/master/2-starting/1-creating-server.md
const server = new Server(
    Server.loadOptions(process, {
      subprotocol: '1.0.0',
      supports: '1.x',
      root: __dirname,
    }),
)

server.auth((userId, token) => {
  // Allow only local users until we will have a proper authentication
  return process.env.NODE_ENV === 'development'
})

server.listen()
