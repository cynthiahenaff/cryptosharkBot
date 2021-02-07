export default bot => {
  bot.on(['sticker', 'photo'], ctx => {
    ctx.reply('Cool! 👍');
    ctx.replyWithDocument({
      url: 'https://media.giphy.com/media/mbEgX6CUS01cQ/giphy.gif',
      filename: 'cat.gif',
    });
  });
  bot.on('message', ctx => {
    ctx.reply(
      'I’m sorry, I don’t understand 🤔 \nUse /help to see the main commands.',
    );
    // ctx.replyWithDocument({
    //   url: 'https://media.giphy.com/media/5zgXE8TTwrOj2ndaNc/giphy.gif',
    //   filename: 'bot.gif',
    // });
  });
};
