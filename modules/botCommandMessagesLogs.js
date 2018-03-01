module.exports = (bot, momId, db) => {
  bot.command('messagesLogs', async (ctx) => {
    if (ctx.from.id !== momId) {
      console.warn('Access forbidden to messagesLogs from user ' + JSON.stringify(ctx.from));
      return;
    }
    const dateLess24h = (Date.now() / 1000) - (24 * 60 * 60);
    const messages = await db.collection('messages')
      .find({ date: { $gt: dateLess24h } })
      .sort({ date: 1 })
      .toArray();

    const messagesToMom = messages
      .filter(message => message.from.id !== momId)
      .map(message => {
        const { first_name, last_name, username } = message.from;
        const { type, title } = message.chat;
        const { text } = message;

        return `_${first_name || ''}_ _${last_name || ''}_ _${username || ''}_\n (${type}, ${title}): ${text}`;
      });

    ctx.replyWithMarkdown(
      [ '*This is the logs over last 24 hours.*\n', ...messagesToMom ].join('\n')
    );

  });
};
