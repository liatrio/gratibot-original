/*
 * Module for checking description length.
 */
const desc = require('../libs/funcs.js');

module.exports = function checkDescription(controller) {
  controller.hears(process.env.EMOJI || ':toast:', 'ambient', (bot, message) => {
    bot.startConversation(message, (err, convo) => {
      desc.description(message, convo);
    });
  });
};
