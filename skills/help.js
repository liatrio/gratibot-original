/*
Module for defining help command for Gratibot.
*/
module.exports = function helper(controller) {
  const emoji = process.env.EMOJI || ':toast:';
  controller.hears(['help'], 'direct_message, direct_mention', (bot, message) => {
    bot.whisper(message, {
      attachments: [
        {
          color: '#36a64f',
          title: 'Gratibot Repo\n',
          title_link: 'https://github.com/liatrio/gratibot',
          pretext: `\nHey there :wave: Here's some help with what ${emoji} can do.\n`,
          fields: [
            {
              title: 'Commands',
              value: `*${emoji} <@user>* - Specify a user and the amount of ${emoji} you want to award them!\nExample: _<@user> have a ${emoji} for demonstrating #empathy by helping me learn :vim:._`,
            },
            {
              title: 'Details',
              value: `*#<keyword>* - Tag your message with *#* to say why they deserve your ${emoji}.\nExample: #excellence, #energy, #empathy\n*${emoji} limit* - Every user has a max of 5 ${emoji}s they can give which reset daily.`,
            },
          ],
        },
      ],
    });
  });
};
