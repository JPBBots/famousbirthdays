const { Master } = require('discord-rose')
const path = require('path')

const { Interface } = require('interface')
const int = new Interface()

const { AutoPoster } = require('topgg-autoposter')

const config = require('../config')

const master = new Master(path.resolve(__dirname, './worker.js'), {
  token: config.token,
  cache: {
    channels: false,
    roles: false,
    self: false
  },
  cacheControl: {
    guilds: ['id']
  }
})

AutoPoster(config.dbl, master)

int.setupMaster(master, 'famousbirthdays')

master.start()
