import { getAllCryptocurrencies } from 'api/coinMarketCap';

export default bot => {
  bot.command('about', async ctx => {
    const { data } = await getAllCryptocurrencies({ limit: 5000 });
    ctx.replyWithMarkdown(
      `You can contact my mom @monsieurRiz on [twitter](https://twitter.com/monsieur_riz) or [linkedIn](https://www.linkedin.com/in/cynthia-henaff-47168714b/)\n\nI manage currently *${
        data.data.length
      }* currencies from [CoinMarketCap](https://coinmarketcap.com/)`,
    );
  });
};
