require('dotenv').config();

const { MongoClient, ObjectID } = require('mongodb');
const Telegraf = require('telegraf');

const advertiseToChannel = require('./modules/advertiseToChannel');
const messageToChannel = require('./modules/messageToChannel');
const logMessages = require('./modules/logMessages');
const botStart = require ('./modules/botStart');
const botCommandHelp = require ('./modules/botCommandHelp');
const botCommandHowmuch = require('./modules/botCommandHowmuch');
const botCommandCurrency = require('./modules/botCommandCurrency');
const botCommandBest1h = require('./modules/botCommandBest1h');
const botCommandBest24h = require('./modules/botCommandBest24h');
const botCommandBest7d = require('./modules/botCommandBest7d');
const botCommandMessagesLogs = require('./modules/botCommandMessagesLogs');

const momId = parseInt(process.env.MOM_ID);

(async () => {
  console.log('Bot is starting');

  console.log('Connection to the database');
  const db = await MongoClient.connect(process.env.MONGODB_URL);

  const channelId = process.env.CHANNEL_ID;
  const bot = new Telegraf(process.env.TELEGRAM_TOKEN, { username: process.env.TELEGRAM_USERNAME });

  logMessages(bot, db);

  botStart(bot, db, momId);

  botCommandHelp(bot);
  botCommandHowmuch(bot);
  botCommandCurrency(bot);
  botCommandBest1h(bot);
  botCommandBest24h(bot);
  botCommandBest7d(bot);
  botCommandMessagesLogs(bot, momId, db);

  bot.startPolling(30, 100, null, () => {console.log('startPolling stopped');});
  console.log('Bot is ready');

  messageToChannel(bot, channelId);
  advertiseToChannel(bot, channelId);
})();
