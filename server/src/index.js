const { Server } = require('@logux/server')
const { User } = require('./models')

// https://github.com/logux/logux/blob/master/2-starting/1-creating-server.md
const server = new Server(
    Server.loadOptions(process, {
      subprotocol: '1.0.0',
      supports: '1.x',
      root: __dirname,
    }),
)

/**
 * @callback authenticator
 * @param {string} userId User ID.
 * @param {*} credentials The client credentials.
 * @param {Client} client Client object.
 * @return {boolean|Promise<boolean>} `true` if credentials was correct
 */
const authenticator = (userId, credentials, client) => {
  // Allow only local users until we will have a proper authentication
  return process.env.NODE_ENV === 'development'
}

// Set authenticate function. It will receive client credentials
// and node ID. It should return a Promise with `true` or `false`.
server.auth(authenticator)

// Pattern or regular expression
const channelName = 'user/:id'

/**
 * Callback during subscription process.
 * @type {objects}
 */
const channelCallbacks = {
  // Checks user access for channel.
  access (ctx) {
    console.log("ctx.params: ", ctx.params) // eslint-disable-line
    // User can subscribe only to own data
    return ctx.params.id === ctx.userId
  },

  // Creates actions with initial state.
  async init (ctx, action, meta) {
    let name = await User.find({ _id: ctx.params.id })
    // Creating action to set user name and sending it to subscriber
    ctx.sendBack({ type: 'user/name', name })
  },

  // Callback which will be run
  // on the end of subscription processing
  // or on an error.
  finally () {},
}

/**
 * Define the channel.
 */
server.channel(channelName, channelCallbacks)

// The action’s type.
const actionType = 'CHANGE_NAME'

// Callbacks for actions with this type.
const actionCallbacks = {
  // authorizer
  // Check does user can do this action.
  access (ctx, action, meta) {},

  // resender
  // Return object with keys for meta
  // to resend action to other users
  /**
   * @callback resender
   * @param {Context} ctx Information about node, who create this action.
   * @param {Action} action The action data.
   * @param {Meta} meta The action metadata.
   * @return {object|Promise<object>} Meta’s keys.
   */
  resend (ctx, action, meta) {},

  // processor
  //  Action business logic.
  /**
   * @callback processor
   * @param {Context} ctx Information about node, who create this action.
   * @param {Action} action The action data.
   * @param {Meta} meta The action metadata.
   * @return {Promise|undefined} Promise when processing will be finished.
   */
  process (ctx, action) {},

  // Callback which will be run
  // on the end of action processing
  // or on an error.
  finally (ctx, action, meta) {},
}

// Define action type’s callbacks.
server.type('CHANGE_NAME', {
  access (ctx, action, meta) {
    console.log("ctx.userId : ", ctx.userId) // eslint-disable-line
    console.log("ctx.clientId: ", ctx.clientId) // eslint-disable-line
  },
})

server.listen()
