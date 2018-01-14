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

    let messageToMom = '*This is the logs over last 24 hours.*\n\n';
    for (const message of messages) {
      if (message.from.id !== momId) {
        messageToMom = messageToMom + `_${message.from.first_name || ''}_ _${message.from.last_name || ''}_ _${message.from.username || ''}_\n (${message.chat.type}, ${message.chat.title}): ${message.text}\n`;
      }
    }
    ctx.replyWithMarkdown(messageToMom);
  });
};
