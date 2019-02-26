/*
 * Module for checking description length.
 */

module.exports = function checkDescription(controller) {
  controller.hears(process.env.EMOJI || ':toast:', 'ambient', (bot, message) => {
    bot.startConversation(message, (err, convo) => {
      const emoji = process.env.EMOJI || ':toast:';
      const removeEmoji = new RegExp(emoji, 'g');
      let fullMessage = message.event.text;
      // Gets all users mentioned
      const catchUsers = fullMessage.match(/<.*?>/g);
      const uniqueUsers = [...new Set(catchUsers)];
      // Strips users _ emoji out of message
      fullMessage = fullMessage.replace(/(\s)+(<.*?>)|(<.*?>)(\s)+/g, '');
      fullMessage = fullMessage.replace(removeEmoji, '');
      if (fullMessage.length < 40) {
        convo.ask(`Why is ${uniqueUsers} deserving of ${emoji} ?`, (response, newConvo) => {
          if (response.text.length < 40) {
            newConvo.say(`Distributing ${emoji} requires a description greater than 40 characters. Please try again`);
            newConvo.next();
          } else {
            newConvo.say(`Awesome! Giving ${emoji} to ${uniqueUsers}`);
            newConvo.next();
          }
        });
      } else {
        convo.say(`Awesome, ${emoji} given to ${uniqueUsers}`);
      }
    });
  });
};
