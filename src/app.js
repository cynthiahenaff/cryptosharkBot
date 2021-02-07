require('dotenv').config();

import { MongoClient } from 'mongodb';
import { Telegraf } from 'telegraf';

import messageToChannel from 'modules/messageToChannel';
import saveMessageToDB from 'modules/saveMessageToDB';
import { botCommandsHandlers } from 'modules/botCommands';
import unsupportedCommand from 'modules/unsupportedCommand';
import dailyFetchingCurrencies from 'modules/db/dailyFetchingCurrencies';
import { errorHandling, logHandling } from 'utils';

//Catch uncaught exceptions
process.on('uncaughtException', (err, origin) => () =>
  errorHandling({
    title: 'node.js Error: uncaughtException',
    body: `Caught exception: ${err}\n Exception origin: ${origin}`,
  }),
);

const run = async () => {
  console.log('Bot is starting');

  console.log('Connection to the database');
  const client = await MongoClient.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  const db = client.db(process.env.MONGODB_DB_NAME);

  await db.executeDbAdminCommand({ setFeatureCompatibilityVersion: '4.4' });

  const bot = new Telegraf(process.env.TELEGRAM_CS_TOKEN, {
    username: process.env.TELEGRAM_CS_USERNAME,
    updates: {
      get_interval: 1000,
    },
  });

  saveMessageToDB(bot, db);
  dailyFetchingCurrencies(db);

  await Promise.all(
    botCommandsHandlers.map(async handler => {
      await handler(bot, db);
    }),
  );

  unsupportedCommand(bot);

  bot.startPolling(30, 100, null, async () => {
    await errorHandling({ title: 'Bot error: startPolling stopped' });
    // if error with telegram, exit after 10 seconds
    setTimeout(() => {
      process.exit(1);
    }, 10 * 1000);
  });

  logHandling('cryptoShark is ready…');

  messageToChannel(bot, db);
};

run();
