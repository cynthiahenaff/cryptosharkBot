module.exports = (bot, channelId) => {
  const advertiseToChannel = async () => {
    const message = 'Don\'t forget, you can talk directly with me by clicking on this link @ButterInTheSpinachBot 🤖 and join my mom at https://twitter.com/monsieur_riz';
    bot.telegram.sendMessage(channelId, message);
  };
  setInterval(advertiseToChannel, 24 * 60 * 60 * 1000);
};
