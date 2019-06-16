require('dotenv').config();

import { MongoClient } from 'mongodb';
import Telegraf from 'telegraf';
import { IncomingWebhook } from '@slack/webhook';

const advertiseToChannel = require('./modules/advertiseToChannel');
const messageToChannel = require('./modules/messageToChannel');
const logMessages = require('./modules/logMessages');
const botStart = require('./modules/botStart');
const botCommandHelp = require('./modules/botCommandHelp');
const botCommandTop10 = require('./modules/botCommandTop10');
const botCommandCurrency = require('./modules/botCommandCurrency');
const botCommandBest1h = require('./modules/botCommandBest1h');
const botCommandBest24h = require('./modules/botCommandBest24h');
const botCommandBest7d = require('./modules/botCommandBest7d');
const botCommandWorst1h = require('./modules/botCommandWorst1h');
const botCommandWorst24h = require('./modules/botCommandWorst24h');
const botCommandWorst7d = require('./modules/botCommandWorst7d');
const botCommandMessagesLogs = require('./modules/botCommandMessagesLogs');
const botCommandUsers = require('./modules/botCommandUsers');
const botCommandAbout = require('./modules/botCommandAbout');

const momId = parseInt(process.env.MOM_ID);

const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

//Catch uncaught exceptions
process.on('uncaughtException', function(err) {
  // handle the error safely
  console.error(err);
  (async () => {
    await webhook.send({
      text: err,
    });
  })();
});

(async () => {
  console.log('Bot is starting');

  console.log('Connection to the database');
  const db = await MongoClient.connect(process.env.MONGODB_URL);

  const channelId = process.env.CHANNEL_ID;
  const bot = new Telegraf(process.env.TELEGRAM_TOKEN, {
    username: process.env.TELEGRAM_USERNAME,
    updates: {
      get_interval: 1000,
    },
  });

  logMessages(bot, db);

  botStart(bot, db, momId, webhook);

  botCommandHelp(bot);
  botCommandTop10(bot, webhook);
  botCommandCurrency(bot, webhook);
  botCommandBest1h(bot, webhook);
  botCommandBest24h(bot, webhook);
  botCommandBest7d(bot, webhook);
  botCommandWorst1h(bot, webhook);
  botCommandWorst24h(bot, webhook);
  botCommandWorst7d(bot, webhook);
  botCommandMessagesLogs(bot, momId, db);
  botCommandUsers(bot, momId, db);
  botCommandAbout(bot);

  bot.startPolling(30, 100, null, async () => {
    console.log('startPolling stopped');
    await webhook.send({
      text: 'startPolling stopped',
    });
  });
  console.log('Bot is ready');

  await webhook.send({
    text: 'Bot is ready…',
  });

  messageToChannel(bot, channelId, webhook);
  advertiseToChannel(bot, channelId);
})();
