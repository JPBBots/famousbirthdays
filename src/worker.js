const { Worker } = require('discord-rose')
const { Interface } = require('interface')

const famousBirthdays = require('famousbirthdays')

const int = new Interface()

const worker = new Worker()
int.setupWorker(worker)

worker.commands
  .prefix(() => {
    return '<@' + worker.user.id + '>'
  })
  .add({
    command: /.*/,
    interaction: {
      name: 'famousbirthdays',
      description: 'Gets birthdays for today or specific day',
      options: [{
        name: 'date',
        description: 'Specific date to show',
        type: 3
      }]
    },
    exec: async (ctx) => {
      if (ctx.isInteraction) {
        ctx.args = [ctx.options.date]
      } else ctx.args.unshift(ctx.ran)

      if (ctx.args[0] === 'tomorrow') ctx.args = [Date.now() + 8.64e+7]

      let str = ctx.args.join(' ')
      str = Number(str) || str

      const date = new Date(str || Date.now())

      if (isNaN(date.getTime())) {
        return ctx.embed
          .color(11405516)
          .title('Invalid Date')
          .description('Try something like `tomorrow`, `1/1`, `january 1`, etc.')
          .send(true, false, true)
      }

      const birthdays = await famousBirthdays(date)

      const embed = ctx.embed
        .color(11405516)
        .title(`Famous Birthdays on ${date.toDateString().split(' ').slice(1).slice(0, -1).join(' ')}`)

      birthdays.forEach(birthday => {
        embed.field(`${birthday.name} (${birthday.age || 'Dead'})`, `${birthday.occupation}. [More](${birthday.link})`, true)
      })

      embed
        .field('By JPBBots',
          '[Support Server](https://discordapp.com/invite/CRAbk4w) | ' +
          '[Invite](https://discordapp.com/oauth2/authorize?client_id=540387160772050954&permissions=2048&scope=bot+applications.commands) | ' +
          '[Top.gg](https://top.gg/bot/540387160772050954) | ' +
          '[JPBBots](https://jpbbots.org)'
        )
        .footer('Powered by data from famousbirthdays.com')
        .send()
    }
  })
