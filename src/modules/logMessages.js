const logMessages = async (bot, db) => {
  bot.use(async (ctx, next) => {
    if (ctx.updateType === 'message') {
      await db.collection('messages').insert(ctx.update.message);
    }
    await next();
  });
};

export default logMessages;
