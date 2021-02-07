const saveMessageToDB = (bot, db) => {
  bot.use(async (ctx, next) => {
    if (ctx.updateType === 'message') {
      await db
        .collection('messages')
        .insertOne({ ...ctx.update.message, createdAt: new Date() });
    }
    await next();
  });
};

export default saveMessageToDB;
