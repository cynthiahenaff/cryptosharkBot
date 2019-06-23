import { logHandling } from 'utils';

export default (bot, db, momId) => {
  bot.start(async ctx => {
    const user = await db.collection('users').findOne({ id: ctx.from.id });
    if (user === null) {
      await db.collection('users').insert(ctx.from);
    }

    // Message mom with the new user's information
    const messageToMom = `Hello mom, ${ctx.from.first_name || ''} ${ctx.from
      .last_name || ''} talked to me 🤖💋`;

    await bot.telegram.sendMessage(momId, messageToMom);

    await logHandling('I have some good news…', messageToMom);

    return ctx.replyWithMarkdown(
      `Welcome ${
        ctx.from.first_name
      }!\n\nI'm Cryptobot, nice to meet you.\nUse /help to know me better.\n\nIf you have any suggestion, you can contact (and follow 👍) my mom Cynthia on [Twitter](https://twitter.com/monsieur_riz)\n\nEnjoy! 😁💰🤘`,
    );
  });
};
