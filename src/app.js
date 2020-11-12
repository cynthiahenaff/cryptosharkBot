require('dotenv').config();

import { MongoClient } from 'mongodb';
import Telegraf from 'telegraf';
import { IncomingWebhook } from '@slack/webhook';

import advertiseToChannel from 'modules/advertiseToChannel';
import messageToChannel from 'modules/messageToChannel';
import logMessages from 'modules/logMessages';
import botStart from 'modules/botStart';
import botCommandHelp from 'modules/botCommandHelp';
import botCommandTop10 from 'modules/botCommandTop10';
import botCommandCurrency from 'modules/botCommandCurrency';
import botCommandBest1h from 'modules/botCommandBest1h';
import botCommandBest24h from 'modules/botCommandBest24h';
import botCommandBest7d from 'modules/botCommandBest7d';
import botCommandWorst1h from 'modules/botCommandWorst1h';
import botCommandWorst24h from 'modules/botCommandWorst24h';
import botCommandWorst7d from 'modules/botCommandWorst7d';
import botCommandMessagesLogs from 'modules/botCommandMessagesLogs';
import botCommandUsers from 'modules/botCommandUsers';
import botCommandAbout from 'modules/botCommandAbout';
import unsupportedCommand from 'modules/unsupportedCommand';
import { errorHandling, logHandling } from 'utils';

const momId = parseInt(process.env.MOM_ID);

export const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

//Catch uncaught exceptions
process.on('uncaughtException', function (err) {
  // handle the error safely
  (async () => errorHandling(err))();
});

(async () => {
  console.log('Bot is starting');

  console.log('Connection to the database');
  const client = await MongoClient.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  const db = client.db(process.env.MONGODB_DB_NAME);

  const channelId = process.env.CHANNEL_ID;
  const bitsBot = new Telegraf(process.env.TELEGRAM_BITS_TOKEN, {
    username: process.env.TELEGRAM_BITS_USERNAME,
    updates: {
      get_interval: 1000,
    },
  });

  const csBot = new Telegraf(process.env.TELEGRAM_CS_TOKEN, {
    username: process.env.TELEGRAM_CS_USERNAME,
    updates: {
      get_interval: 1000,
    },
  });

  const bots = [bitsBot, csBot];

  for (const bot of bots) {
    await logMessages(bot, db);

    await botStart(bot, db, momId);

    await botCommandHelp(bot);
    await botCommandCurrency(bot);
    await botCommandTop10(bot);
    await botCommandBest1h(bot);
    await botCommandBest24h(bot);
    await botCommandBest7d(bot);
    await botCommandWorst1h(bot);
    await botCommandWorst24h(bot);
    await botCommandWorst7d(bot);
    await botCommandMessagesLogs(bot, momId, db);
    await botCommandUsers(bot, momId, db);
    await botCommandAbout(bot);
    await unsupportedCommand(bot);

    bot.startPolling(30, 100, null, async () => {
      await errorHandling(`${bot.options.username} : startPolling stopped`);
      // if error with telegram, exit after 10 seconds
      setTimeout(() => {
        process.exit(1);
      }, 10 * 1000);
    });

    logHandling(`Bot ${bot.options.username} is ready…`);
  }

  messageToChannel(csBot, channelId, webhook);
  // advertiseToChannel(csBot, channelId);
})();
