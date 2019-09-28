const { Server } = require('@logux/server')
const mongoose = require('mongoose')


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

server.type('INC', {
  access (ctx, action, meta) {
    console.log("ctx.userId : ", ctx.userId ); // eslint-disable-line
    console.log("ctx.clientId: ", ctx.clientId); // eslint-disable-line
  }
})

server.listen()
