const advertiseToChannel = (bot, channelId) => {
  const advertiseToChannel = async () => {
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();

    if (!(hours === 18 && minutes === 1)) {
      return;
    }
    const message =
      'Don’t forget, you can also talk to me directly 👉@cryptoshark\\_bot 🤖 and contact my developer 👉[@monsieur_riz](https://twitter.com/monsieur_riz)';
    bot.telegram.sendMessage(channelId, message);
  };
  setInterval(advertiseToChannel, 60 * 1000);
};

export default advertiseToChannel;
