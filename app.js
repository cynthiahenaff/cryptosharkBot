require('dotenv').config();

const axios = require('axios');
const delay = require('timeout-as-promise');
const { MongoClient, ObjectID } = require('mongodb');
const Telegraf = require('telegraf');
const cryptos = require('./cryptos.json');

(async () => {
  console.log('Bot is starting');

  console.log('Connection to the database');
  const db = await MongoClient.connect(process.env.MONGODB_URL);

  const coinmarketcapFetchTicker = async (currency) => {
    const getTicker = await axios.get(`https://api.coinmarketcap.com/v1/ticker/${currency}/?convert=EUR`);

    let lastValue = parseFloat(getTicker.data[0].price_eur);
    if (lastValue < 1) {
      lastValue = lastValue.toFixed(6);
    }
    else if (lastValue < 10) {
      lastValue = lastValue.toFixed(4);
    }
    else {
      lastValue = lastValue.toFixed(2);
    }

    return {
      lastValue: lastValue,
      changeOver1h: getTicker.data[0].percent_change_1h,
      changeOver24h: getTicker.data[0].percent_change_24h,
      changeOver7d: getTicker.data[0].percent_change_7d
    };
  };

  const channelId = '@ButterInTheSpinach';
  const bot = new Telegraf(process.env.TELEGRAM_TOKEN, { username: 'ButterInTheSpinachBot' });

  // Log messages to DB
  bot.use(async (ctx, next) => {
    console.log('OK');
    if (ctx.updateType === 'message') {
      await db.collection('messages').insert(ctx.update.message);
    }
    await next();

  });

  bot.start(async (ctx) => {
    await db.collection('users').insert(ctx.from);

    const momId = 353733726;
    const messageToMom = `Hello mom, ${ctx.from.first_name} ${ctx.from.last_name} talked to me 🤖💋`;
    await bot.telegram.sendMessage(momId, messageToMom);

    return ctx.reply(`Welcome ${ctx.from.first_name}!\n\nI'm Cryptobot, nice to meet you.\nUse /help to know me better.\n\nIf you have some suggestion, you can contact (and follow 👍) my mom Cynthia on twitter https://twitter.com/monsieur_riz\n\nEnjoy! 😁💰🤘  `);
  });


  bot.command('help', (ctx) => {
    let message = '/howMuch - Query the market\n';
    for (const crypto of cryptos) {
      message = message + `/${crypto.command} - Amount of ${crypto.name} in ${crypto.currencyName}\n`;
    }
    ctx.reply(message);
  });

  bot.command('howMuch', async (ctx) => {
    ctx.reply('I\'m searching...');
    try {
      let message = '';
      for (const crypto of cryptos) {
        const result = await coinmarketcapFetchTicker(crypto.nameOnCoinmarketcap);
        message = message + `${crypto.name} is at ${result.lastValue} ${crypto.currencySymbol}\n`;
      }
      ctx.reply(message);
    }
    catch (error) {
      ctx.reply('Sorry there is an error. Please try again in a few minutes.');
    }
  });

  for (const crypto of cryptos) {
    bot.command(crypto.command, async (ctx) => {
      try {
        const result = await coinmarketcapFetchTicker(crypto.nameOnCoinmarketcap);
        ctx.reply(`${crypto.name} is at ${result.lastValue} ${crypto.currencySymbol}

Evolution over 1h : ${result.changeOver1h} %
Evolution over 24h: ${result.changeOver24h} %
Evolution over 7 days: ${result.changeOver7d} %`);
      }
      catch (error) {
        ctx.reply('Sorry there is an error. Please try again in a few minutes.');
      }
    });
  }
  // bot.on('new_chat_members', (ctx) => ctx.reply(`Hello ${ctx.from.first_name}`));
  // bot.hears('hi', (ctx) => ctx.reply('Hey there!'))
  // bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy!'))
  // bot.on('sticker', (ctx) => ctx.reply('👍'))

  bot.startPolling();

  const messageToChannel = async () => {
    while (true) {
      try {
        let message = 'I send you every hour the crypto market value 🤖💰\n\n';
        for (const crypto of cryptos) {
          if (crypto.postOnChannel === true) {
            const result = await coinmarketcapFetchTicker(crypto.nameOnCoinmarketcap);
            message = message + `${crypto.name} is at ${result.lastValue} ${crypto.currencySymbol}\n`;
          }
        }
        message = message + '\nYou can ask me for more currencies by clicking on this link @ButterInTheSpinachBot 🤖';
        bot.telegram.sendMessage(channelId, message);
        break;
      }
      catch (error) {
        await delay(10 * 1000);
      }
    }
  };
  setInterval(messageToChannel, 60 * 60 * 1000);


  const advertiseToChannel = async () => {
    const message = 'Don\'t forget, you can talk directly with me by clicking on this link @ButterInTheSpinachBot 🤖 and join my mom at https://twitter.com/monsieur_riz';
    bot.telegram.sendMessage(channelId, message);
  };
  setInterval(advertiseToChannel, 24 * 60 * 60 * 1000);

})();
