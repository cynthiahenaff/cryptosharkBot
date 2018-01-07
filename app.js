require('dotenv').config();

const ccxt = require('ccxt');
const { MongoClient, ObjectID } = require('mongodb');
const Telegraf = require('telegraf');

const cryptos = [
  {
    symbol: 'BTC/EUR',
    name: 'Bitcoin',
    exchange: 'gdax',
    command: 'bitcoin',
  },
  {
    symbol: 'ETH/EUR',
    name: 'Ethereum',
    exchange: 'gdax',
    command: 'ether',
  },{
    symbol: 'XRP/EUR',
    name: 'Ripple',
    exchange: 'kraken',
    command: 'ripple',
  },
];

(async () => {
  console.log('Bot is starting');

  console.log('Connection to the database');
  const db = await MongoClient.connect(process.env.MONGODB_URL);

  const fetchTicker = async (exchangeName, symbol) => {
    const exchange = new ccxt[exchangeName]();
    const ticker = await exchange.fetchTicker(symbol);
    return ticker.last;
  };

  const channelId = '@ButterInTheSpinach';
  const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

  bot.start(async (ctx) => {
    console.log('started:', ctx.from.id);
    console.log(ctx.from);
    await db.collection('users').insert(ctx.from);

    return ctx.reply(`Welcome ${ctx.from.first_name}!`);
  });



  bot.command('help', (ctx) => {
    let message = '/howMuch - Query the market\n';
    for (const crypto of cryptos) {
      message = message + `/${crypto.command} - Amount of ${crypto.name} in Euro\n`;
    }
    ctx.reply(message);
  });

  bot.command('howMuch', async (ctx) => {
    ctx.reply('I\'m searching...');
    try {
      const sentence = await getTickers();
      ctx.reply(sentence);
      // Shortest version:
      // ctx.reply(getTickers());
    }
    catch (error) {
      ctx.reply('Sorry there is an error. Please try again in a few minutes.');
    }
  });

  for (const crypto of cryptos) {
    bot.command(crypto.command, async (ctx) => {
      try {
        const lastValue = await fetchTicker(crypto.exchange, crypto.symbol);
        ctx.reply(`${crypto.name} is at ${lastValue} euros on ${crypto.exchange}`);
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


  const getTickers = async () => {
    // Get Ticker Info
    try {
      let message = '';
      for (const crypto of cryptos) {
        const lastValue = await fetchTicker(crypto.exchange, crypto.symbol);
        // const lastBtc = await fetchTicker('gdax', 'BTC/EUR');
        // const lastEth = await fetchTicker('gdax', 'ETH/EUR');
        // const lastXrp = await fetchTicker('kraken', 'XRP/EUR');
        message = message + `${crypto.name} is at ${lastValue} euros on ${crypto.exchange}\n`;
      }
      return message;
    }
    catch (error) {
      return 'Sorry there is an error. Please try again in a few minutes.';
    }
  };

  const messageToChannel = async () => {
    const sentence = await getTickers();
    bot.telegram.sendMessage(channelId, sentence);
  };

  setInterval(messageToChannel, 60 * 60 * 1000);

})();
