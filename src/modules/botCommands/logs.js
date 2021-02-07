import { logHandling, errorHandling } from 'utils';
import { startOfDay } from 'date-fns';

const momId = parseInt(process.env.MOM_ID);

export default (bot, db) => {
  bot.command('logs', async ctx => {
    if (ctx.from.id !== momId) {
      errorHandling({
        title: 'Access forbidden to messages logs',
        body: JSON.stringify(ctx.from),
      });
      return;
    }

    const messages = await db
      .collection('messages')
      .find({ date: { $gt: startOfDay() } })
      .sort({ date: 1 })
      .toArray();

    const filteredMessages = messages.filter(
      message => message.from.id !== momId,
    );

    const logs = filteredMessages.map(
      ({ from, chat, text }) =>
        `_${from?.first_name ?? ''}_ _${from?.last_name ?? ''}_ _${
          from?.username || ''
        }_\n (${chat?.type}, ${chat?.title})\n ${text}`,
    );

    ctx.replyWithMarkdown(
      ['*These are the logs of last 24 hours.*\n', ...logs].join('\n\n'),
    );

    logHandling('These are the logs over last 24 hours', logs.join('\n\n'));
  });
};
