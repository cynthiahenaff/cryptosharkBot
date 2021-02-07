const momId = parseInt(process.env.MOM_ID);

export default (bot, db) => {
  bot.command('users', async ctx => {
    if (ctx.from.id !== momId) {
      console.warn(
        'Access forbidden to messagesLogs from user ' +
          JSON.stringify(ctx.from),
      );
      return;
    }

    const users = await db.collection('users').find().toArray();

    ctx.replyWithMarkdown(`I have *${users.length}* users! `);

    const formattedUsers = users.map(
      ({ first_name, last_name, username }) =>
        `${first_name || ''} ${last_name || ''} ${username || ''}`,
    );
    ctx.replyWithMarkdown(formattedUsers.join('\n'));
  });
};
