import { logHandling } from 'utils';

const momId = parseInt(process.env.MOM_ID);

export default (bot, db) => {
  bot.start(async ctx => {
    const user = await db.collection('users').findOne({ id: ctx.from.id });

    if (!Boolean(user)) {
      await db
        .collection('users')
        .insertOne({ ...ctx.from, createdAt: new Date() });
    }

    const devMessage = `Hello mom, ${ctx.from.first_name || ''} ${
      ctx.from.last_name || ''
    } talked to me 🤖💋`;

    await bot.telegram.sendMessage(momId, devMessage);
    await logHandling('I have some good news…', devMessage);

    const message = [
      `Welcome ${ctx.from.first_name}!`,
      '',
      'I’m CryptoShark, nice to meet you.',
      '',
      'Enter / following by the name or the symbol of the currency without space or punctuation like these following examples: /xrp /bitcoin /netboxcoin',
      'Use /help to see the main commands.',
      '',
      'If you have any suggestion, you can contact (and follow 👍) my mom Cynthia on [Twitter](https://twitter.com/monsieur_riz)',
      '',
      'Enjoy! 😁💰🤘',
    ].join('\n');

    return ctx.replyWithMarkdown(message);
  });
};
