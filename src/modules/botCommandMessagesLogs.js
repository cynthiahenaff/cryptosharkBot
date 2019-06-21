import { logHandling, errorHandling } from 'utils';

export default (bot, momId, db) => {
  bot.command('logs', async ctx => {
    if (ctx.from.id !== momId) {
      errorHandling(`Access forbidden to messagesLogs from user 
      ${JSON.stringify(ctx.from)}`);
      return;
    }
    const dateLess24h = Date.now() / 1000 - 24 * 60 * 60;

    const messagesDb = await db
      .collection('messages')
      .find({ date: { $gt: dateLess24h } })
      .sort({ date: 1 })
      .toArray();

    const messages = messagesDb.filter(message => message.from.id !== momId);

    const messagesToMom = messages.map(message => {
      const { first_name, last_name, username } = message.from;
      const { type, title } = message.chat;
      const { text } = message;

      return `_${first_name || ''}_ _${last_name || ''}_ _${username ||
        ''}_\n (${type}, ${title}): ${text}`;
    });

    ctx.replyWithMarkdown(
      ['*These are the logs of last 24 hours.*\n', ...messagesToMom].join('\n'),
    );

    logHandling('These are the logs over last 24 hours', messagesToMom);
  });
};
