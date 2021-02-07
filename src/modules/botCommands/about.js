import getCurrenciesCount from 'modules/db/getCurrenciesCount';

export default (bot, db) => {
  bot.command('about', async ctx => {
    const count = await getCurrenciesCount(db);

    const message = [
      'You can contact my developer on [Twitter](https://twitter.com/monsieur_riz) or [LinkedIn](https://www.linkedin.com/in/cynthia-henaff-47168714b/)',
      'If you have any questions or suggestions, don’t hesitate to contact her 😁',
      '',
      `At the moment, I can handle *${count}* currencies from [CoinMarketCap](https://coinmarketcap.com/)`,
    ].join('\n');

    ctx.replyWithMarkdown(message);
  });
};
