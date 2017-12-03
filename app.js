require('dotenv').config();

const { MongoClient, ObjectID } = require('mongodb');
const KrakenClient = require('kraken-api');
const Telegraf = require('telegraf');

(async () => {
  console.log('Bot is starting');

  console.log('Connection to the database');
  const db = await MongoClient.connect(process.env.MONGODB_URL);


  const key = process.env.KRAKEN_KEY; // API Key
  const secret = process.env.KRAKEN_SECRET; // API Private Key
  const kraken = new KrakenClient(key, secret, { timeout: 30 * 1000 });


  const chatId = -1001340775946;
  const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
  bot.start(async (ctx) => {
    // chatId = ctx.chat.id;
    console.log('started:', ctx.from.id);
    console.log(ctx.from);
    await db.collection('users').insert(ctx.from);

    return ctx.reply(`Welcome ${ctx.from.first_name}!`);
  });
  bot.command('help', (ctx) => ctx.reply('/how - Query the market'));
  bot.command('how', (ctx) => {
    ctx.reply('I\'m searching...');
    getTickers();
  });
  // bot.on('new_chat_members', (ctx) => ctx.reply(`Hello ${ctx.from.first_name}`));

  // bot.hears('hi', (ctx) => ctx.reply('Hey there!'))
  // bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy!'))
  // bot.on('sticker', (ctx) => ctx.reply('👍'))

  bot.startPolling();


  const getTickers = async () => {
    // Display user's balance
    // console.log(await kraken.api('Balance'));

    // Get Ticker Info
    const data = await kraken.api('Ticker', { pair : 'XXBTZEUR,XETHZEUR' });
    // const dataStringified = JSON.stringify(data);
    // console.log(dataStringified);

    const ethereum = data.result.XETHZEUR.c[0];
    const ethereumFloat = parseFloat(ethereum);
    console.log('Ether is at ' + ethereumFloat + ' euros');

    const bitcoin = data.result.XXBTZEUR.c[0];
    const bitcoinFloat = parseFloat(bitcoin);
    // String template ES6
    console.log(`Bitcoin is at ${bitcoinFloat} euros`);

    if (chatId) {
      bot.telegram.sendMessage(chatId, `Bitcoin is at ${bitcoinFloat} euros\nEther is at ${ethereumFloat} euros` );
    }
  };

  setInterval(getTickers, 60 * 60 * 1000);

})();
