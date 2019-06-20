import { getAllCryptocurrencies } from 'api/coinMarketCap';
import { get } from 'lodash';

export default bot => {
  bot.command('about', async ctx => {
    const { data } = await getAllCryptocurrencies({ limit: 5000 });
    ctx.replyWithMarkdown(
      `You can contact my developer on [twitter](https://twitter.com/monsieur_riz) or [linkedIn](https://www.linkedin.com/in/cynthia-henaff-47168714b/)\nIf you have any questions or suggestions, don’t hesitate to contact her 😁\n\nI manage at this time *${
        get(data, 'data', []).length
      }* currencies from [CoinMarketCap](https://coinmarketcap.com/)`,
    );
  });
};
