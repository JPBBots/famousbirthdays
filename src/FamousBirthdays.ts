import { SingleWorker } from 'jadl'
import { CommandHandler } from '@jadl/cmd'
import { Interface } from '@jpbbots/interface'

import { GatewayIntentBits } from 'discord-api-types'

import { FamousBirthdaysCommand } from './commands/FamousBirthdays'

export class FamousBirthdays extends SingleWorker {
  int = new Interface()

  cmd = new CommandHandler(this, [
    FamousBirthdaysCommand
  ], {
    interactionGuild: this.int.production ? undefined : '569907007465848842'
  })

  constructor () {
    super({
      token: process.env.BOT_TOKEN!,
      cache: {
        channels: [],
        roles: false,
        self: false
      },
      cacheControl: {
        guilds: []
      },
      intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages
    })

    this.setStatus('watching', 'Famous Birthdays')

    this.int.setupSingleton(this, 'famousbirthdays')

    this.int.commands.setupOldCommand([], ['', 'famousbirthdays'])
  }
}
