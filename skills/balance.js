/*
Module for responding to balance message.
*/

module.exports = function balance(controller, context) {
  const { service, exemptUsers } = context;
  controller.hears(['balance'], 'direct_message, direct_mention', (bot, message) => {
    bot.api.users.info({ user: message.user }, (error, response) => {
      if (error) {
        console.error(error);
        return;
      }

      const receivedPromise = service.countRecognitionsReceived(message.user);
      const givenPromise = service.countRecognitionsGiven(message.user, response.user.tz, 1);

      Promise.all([receivedPromise, givenPromise]).then((responses) => {
        const userIsExempt = exemptUsers.some(exemptUser => exemptUser === message.user);
        const remaining = userIsExempt ? 'infinity' : Math.max(0, 5 - responses[1]);
        bot.whisper(message, `You have received \`${responses[0]}\` and you have \`${remaining}\` left to give away today`);
      });
    });
  });
};
