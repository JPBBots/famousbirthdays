import { Command, Run, Options } from '@jadl/cmd'
import { Embed } from '@jadl/builders'

import getBirthdays from 'famousbirthdays'

@Command('famousbirthdays', 'Gets birthdays for today or specific day')
export class FamousBirthdaysCommand {
  @Run()
  async birthdays(@Options.String('date', 'Specific date to show') d?: string) {
    const date =
      d == 'tomorrow'
        ? new Date(Date.now() + 86400000)
        : new Date(d || Date.now())

    if (isNaN(date.getTime())) {
      return new Embed()
        .color(11405516)
        .title('Invalid Date')
        .description('Try something like `tomorrow`, `1/1`, `january 1`, etc.')
    }

    const birthdays = await getBirthdays(date)

    const embed = new Embed()
      .color(11405516)
      .title(
        `Famous Birthdays on ${date
          .toDateString()
          .split(' ')
          .slice(1)
          .slice(0, -1)
          .join(' ')}`
      )

    birthdays.slice(0, 20).forEach((birthday) => {
      embed.field(
        `${birthday.name} (${birthday.age || 'Dead'})`,
        `${birthday.occupation}. [More](${birthday.link})`,
        true
      )
    })

    embed
      .field(
        'By JPBBots',
        '[Support Server](https://discordapp.com/invite/CRAbk4w) | ' +
          '[Invite](https://discordapp.com/oauth2/authorize?client_id=540387160772050954&permissions=2048&scope=bot+applications.commands) | ' +
          '[Top.gg](https://top.gg/bot/540387160772050954) | ' +
          '[JPBBots](https://jpbbots.org)'
      )
      .footer('Powered by data from famousbirthdays.com')

    return embed
  }
}
