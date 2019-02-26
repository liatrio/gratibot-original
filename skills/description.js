/*
 * Module for checking description length.
 */
const desc = require('../libs/funcs.js');

module.exports = function checkDescription(controller) {
  controller.hears(process.env.EMOJI || ':toast:', 'ambient', (bot, message) => {
    bot.startConversation(message, (err, convo) => {
      const emoji = process.env.EMOJI || ':toast:';
      const trimmedMessage = desc.trimLength(message, emoji);
      const uniqueUser = desc.getUsers(message);
      if (trimmedMessage.length < 40) {
        convo.ask(`Why is ${uniqueUser} deserving of ${emoji} ?`, (response, newConvo) => {
          if (response.text.length < 40) {
            newConvo.say(`Distributing ${emoji} requires a description greater than 40 characters. Please try again`);
            newConvo.next();
          } else {
            newConvo.say(`Awesome! Giving ${emoji} to ${uniqueUser}`);
            newConvo.next();
          }
        });
      } else {
        convo.say(`Awesome, ${emoji} given to ${uniqueUser}`);
      }
    });
  });
};
