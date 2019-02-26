/*
Module for defining help command for Gratibot.
*/

module.exports = function (controller) {
  controller.hears(['help'], 'direct_message,direct_mention', (bot, message) => {
    bot.reply(message, {
      attachments: [
        {
          color: '#36a64f',
          title: 'Gratibot Repo\n',
          title_link: 'https://github.com/liatrio/gratibot',
          pretext: '\nHey there :wave: Here\'s some help with what :toast: can do.\n',
          fields: [
            {
              title: 'Commands',
              value: '*:toast: <@user>* - Specify a user and the amount of :toast:s you want to award them!\n'
                           + 'Example: _<@user> have a :toast: for demonstrating #empathy by helping me learn :vim:._\n',
            },
            {
              title: 'Details',
              value: '*#<keyword>* - Tag your message with *#* to say why they deserve your :toast:. Ex. #excellence, #energy, #empathy\n'
                           + '*:toast: limit* - Every user has a max of 5 :toast:s they can give which reset daily.',
            },
          ],
        },
      ],
    });
  });
};