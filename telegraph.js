const Telegraf = require('telegraf')

let chatId;
const bot = new Telegraf('429389659:AAEpVCUR4cjY-s8xf2BqesuFgdkrZAIhfGg')
bot.start((ctx) => {
  chatId = ctx.chat.id;
  console.log('started:', ctx.from.id)
  return ctx.reply('Welcome!')
})
bot.command('help', (ctx) => ctx.reply('Try send a sticker!'))
bot.hears('hi', (ctx) => ctx.reply('Hey there!'))
bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy!'))
bot.on('sticker', (ctx) => ctx.reply('👍'))

bot.startPolling()

setInterval(() => {
  if (chatId) {
    bot.telegram.sendMessage(chatId, 'Coucou');
  }
}, 1000);
