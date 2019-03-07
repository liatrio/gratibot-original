/*
Module for defining help command for Gratibot.
*/
module.exports = function helper(controller, context) {
  const { emoji } = context;
  controller.hears(['help'], 'direct_message, direct_mention', (bot, message) => {
    bot.whisper(message, {
      attachments: [
        {
          color: '#36a64f',
          title: 'Gratibot Repo\n',
          title_link: 'https://github.com/liatrio/gratibot',
          pretext: '\nHey there :wave: Here\'s some help with what Gratibot can do.\n',
          fields: [
            {
              title: 'Commands:',
              short: false,
              value:
`• ${emoji} <@user>  -  Specify a user and the amount of ${emoji} you want to award them!
      Example: _<@user> ${emoji} ${emoji} for demonstrating #empathy by helping me learn :vim:._
• @gratibot balance  -  Shows your balance of recognitions received and recognitions left to give today.`,
            },
            {
              title: 'Details:',
              short: false,
              value:
`• #<keyword>  -  Tag your message with *#* to say why they deserve your ${emoji}
      Example: _#excellence, #energy, #empathy_
• limit  -  Every user has a max of 5 ${emoji}s they can give which reset daily.`,
            },
          ],
        },
      ],
    });
  });
};
