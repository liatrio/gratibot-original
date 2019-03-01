/*
Module for responding to balance message.
*/

module.exports = function balance(controller, context) {
  const emoji = process.env.EMOJI || ':toast:';
  const { service } = context;
  controller.hears(['balance'], 'direct_message, direct_mention', (bot, message) => {
    bot.api.users.info({ user: message.user }, (error, userinfo) => {
      if (error) {
        console.error(error);
        return;
      }

      const receivedPromise = service.countRecognitionsReceived(message.user);
      const givenPromise = service.countRecognitionsGiven(message.user, userinfo.tz, 1);

      Promise.all([receivedPromise, givenPromise]).then((responses) => {
        const remaining = Math.max(0, 5 - responses[1]);
        bot.reply(message, `You have received ${responses[0]} ${emoji} and you have ${remaining} ${emoji} remaining to give away today`);
      });
    });
  });
};
