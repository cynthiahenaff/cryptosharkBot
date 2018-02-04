const fetchTickers = require('./fetchTickers');

module.exports = (bot) => {
  bot.command('about', async (ctx) => {
    const tickers = await fetchTickers();
    ctx.replyWithMarkdown(`You can contact my mom @monsieurRiz on [twitter](https://twitter.com/monsieur_riz) or [linkedIn](https://www.linkedin.com/in/cynthia-henaff-47168714b/)\n\nI manage currently *${tickers.length}* currencies from [CoinMarketCap](https://coinmarketcap.com/)`);
  });
};
