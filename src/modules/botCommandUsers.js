export default (bot, momId, db) => {
  bot.command('users', async ctx => {
    if (ctx.from.id !== momId) {
      console.warn(
        'Access forbidden to messagesLogs from user ' +
          JSON.stringify(ctx.from),
      );
      return;
    }
    const users = await db
      .collection('users')
      .find({})
      .toArray();
    ctx.replyWithMarkdown(`I have *${users.length}* users! `);

    const messages = users.map(
      user =>
        `${user.first_name || ''} ${user.last_name || ''} ${user.username ||
          ''}`,
    );
    ctx.replyWithMarkdown(messages.join('\n'));
  });
};
