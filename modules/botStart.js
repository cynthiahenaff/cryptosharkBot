module.exports = (bot, db, momId) => {
  bot.start(async (ctx) => {
    await db.collection('users').insert(ctx.from);

    // Message mom with the new user's informations
    const messageToMom = `Hello mom, ${ctx.from.first_name} ${ctx.from.last_name} talked to me 🤖💋`;
    await bot.telegram.sendMessage(momId, messageToMom);

    return ctx.replyWithMarkdown(`Welcome ${ctx.from.first_name}!\n\nI'm Cryptobot, nice to meet you.\nUse /help to know me better.\n\nIf you have some suggestion, you can contact (and follow 👍) my mom Cynthia on  [twitter](https://twitter.com/monsieur_riz)\n\nEnjoy! 😁💰🤘`);
  });
};
