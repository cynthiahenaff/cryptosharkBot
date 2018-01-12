require('dotenv').config();

const axios = require('axios');
const delay = require('timeout-as-promise');
const { MongoClient, ObjectID } = require('mongodb');
const Telegraf = require('telegraf');


const momId = 353733726;

(async () => {
  console.log('Bot is starting');

  console.log('Connection to the database');
  const db = await MongoClient.connect(process.env.MONGODB_URL);

  const fixDecimalPrice = (price) => {
    if (price < 1) {
      price = price.toFixed(6);
    }
    else if (price < 10) {
      price = price.toFixed(4);
    }
    else {
      price = price.toFixed(2);
    }
    return price;
  };

  const percentChange = (change) => {
    if (change > 0) {
      change = '+' + change.toFixed(2);
    }
    else {
      change = change.toFixed(2);
    }
    return change;
  };

  const coinmarketcapFetchTicker = async (currency) => {
    const getTicker = await axios.get(`https://api.coinmarketcap.com/v1/ticker/${currency}/?convert=EUR`);
    const lastValueEur = fixDecimalPrice(parseFloat(getTicker.data[0].price_eur));
    const lastValueUsd = fixDecimalPrice(parseFloat(getTicker.data[0].price_usd));
    const changeOver1h = percentChange(parseFloat(getTicker.data[0].percent_change_1h));
    const changeOver24h = percentChange(parseFloat(getTicker.data[0].percent_change_24h));
    const changeOver7d = percentChange(parseFloat(getTicker.data[0].percent_change_7d));

    return {
      lastValueEur: lastValueEur,
      lastValueUsd: lastValueUsd,
      changeOver1h: changeOver1h,
      changeOver24h: changeOver24h,
      changeOver7d: changeOver7d
    };
  };

  const channelId = '@ButterInTheSpinach';
  const bot = new Telegraf(process.env.TELEGRAM_TOKEN, { username: 'ButterInTheSpinachBot' });

  // Log messages to DB
  bot.use(async (ctx, next) => {
    if (ctx.updateType === 'message') {
      await db.collection('messages').insert(ctx.update.message);
    }
    await next();
  });

  bot.start(async (ctx) => {
    await db.collection('users').insert(ctx.from);

    // Message mom with the new user's informations
    const messageToMom = `Hello mom, ${ctx.from.first_name} ${ctx.from.last_name} talked to me 🤖💋`;
    await bot.telegram.sendMessage(momId, messageToMom);

    return ctx.replyWithMarkdown(`Welcome ${ctx.from.first_name}!\n\nI'm Cryptobot, nice to meet you.\nUse /help to know me better.\n\nIf you have some suggestion, you can contact (and follow 👍) my mom *Cynthia* on *twitter* https://twitter.com/monsieur_riz\n\nEnjoy! 😁💰🤘  `);
  }, { 'parse_mode': 'Markdown' });

  // Getting all currencies with CMC's API
  const resultApi = await axios.get('https://api.coinmarketcap.com/v1/ticker/?convert=EUR&limit=0');
  const tickers = resultApi.data;

  // Sorting all currencies by market cap by descending order
  tickers.sort((a, b) => { return parseFloat(b.market_cap_usd || 0) - parseFloat(a.market_cap_usd || 0); });
  console.log('Cryptocurrencies: ' + tickers.length);

  // Help command (/howMuch + /symbol)
  bot.command('help', (ctx) => {
    let message = '/howMuch - Query the market\n';
    for (const ticker of tickers.slice(0, 10)) {
      message = message + `/${ticker.symbol} - Value of *${ticker.name}* in EUR/USD\n`;
    }
    ctx.replyWithMarkdown(message);
  }, { 'parse_mode': 'Markdown' });

  // How much command
  bot.command('howMuch', async (ctx) => {
    ctx.reply('I\'m searching...');
    try {
      let message = '';
      for (const ticker of tickers.slice(0, 6)) {
        const result = await coinmarketcapFetchTicker(ticker.id);
        message = message + `${ticker.name} (${ticker.symbol})\n*${result.lastValueEur}€*   -   $${result.lastValueUsd}\n\n`;
      }
      ctx.replyWithMarkdown(message);
    }
    catch (error) {
      ctx.reply('Sorry there is an error. Please try again in a few minutes.');
    }
  }, { 'parse_mode': 'Markdown' });

  // Currency command
  for (const ticker of tickers) {
    bot.command([ ticker.symbol, ticker.symbol.toLowerCase(), ticker.id.replace(/-/g, '') ], async (ctx) => {
      try {
        const result = await coinmarketcapFetchTicker(ticker.id);
        ctx.replyWithMarkdown(`${ticker.name} (${ticker.symbol})
*${result.lastValueEur}€* - $${result.lastValueUsd}

   Change 1h:  ${result.changeOver1h.padStart(7)}%
   Change 24h: *${result.changeOver24h.padStart(7)}%*
   Change 7d:  ${result.changeOver7d.padStart(7)}%`);
      }
      catch(error) {
        ctx.reply('Sorry there is an error. Please try again in a few minutes.');
      }
    }, { 'parse_mode': 'Markdown' });
  }

  // Message mom with logs over the last 24 hours
  bot.command('messagesLogs', async (ctx) => {
    if (ctx.from.id !== momId) {
      return;
    }
    const dateLess24h = (Date.now() / 1000) - (24 * 60 * 60);
    const messages = await db.collection('messages')
      .find({ date: { $gt: dateLess24h } })
      .sort({ date: 1 })
      .toArray();

    let messageToMom = '*This is the logs over last 24 hours.*\n\n';
    for (const message of messages) {
      if (message.from.id !== momId) {
        messageToMom = messageToMom + `_${message.from.first_name || ''}_ _${message.from.last_name || ''}_ _${message.from.username || ''}_\n (${message.chat.type}, ${message.chat.title}): ${message.text}\n`;
      }
    }
    ctx.replyWithMarkdown(messageToMom);
  }, { 'parse_mode': 'Markdown' });

  bot.startPolling();
  console.log('Bot is ready');

  // Message to channel
  const messageToChannel = async () => {
    while (true) {
      try {
        let message = 'I send you every hour the top 5 of cryptocurrencies 🔝💰\n\n';
        for (const ticker of tickers.slice(0, 5)) {
          const result = await coinmarketcapFetchTicker(ticker.id);
          message = message + `*${ticker.name}*: ${result.lastValueEur}€\nChange (1h): _${result.changeOver1h}%_\n\n`;
        }
        message = message + `\nYou can ask me for **more** than *${tickers.length} currencies* by clicking on this link @ButterInTheSpinachBot 🤖`;
        bot.telegram.sendMessage(channelId, message, { 'parse_mode': 'Markdown' });
        break;
      }
      catch (error) {
        await delay(10 * 1000);
      }
    }
  };
  setInterval(messageToChannel, 60 * 60 * 1000);

  // Advertise to channel
  const advertiseToChannel = async () => {
    const message = 'Don\'t forget, you can talk directly with me by clicking on this link @ButterInTheSpinachBot 🤖 and join my mom at https://twitter.com/monsieur_riz';
    bot.telegram.sendMessage(channelId, message);
  };
  setInterval(advertiseToChannel, 24 * 60 * 60 * 1000);

})();
