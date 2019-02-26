/*

Module for defining help command for Gratibot.

*/

module.exports = function(controller) {

    emoji = process.env.EMOJI

    controller.hears(['help'], 'direct_message,direct_mention', (bot, message) => {
        bot.reply(message, {
          attachments: [
            {
              color: '#36a64f',
              title: 'Gratibot Repo\n',
              title_link: 'https://github.com/liatrio/gratibot',
              pretext: '\nHey there :wave: Here\'s some help with what ' + emoji + ' can do.\n',
              fields: [
                {
                  'title': 'Commands',
                  'value': '*' + emoji + ' \<@user\>* - Specify a user and the amount of ' + emoji + ' you want to award them!\n' +
                           'Example: _\<@user\> have a ' + emoji + ' for demonstrating #empathy by helping me learn :vim:._\n',
                },
                {
                  'title': 'Details',
                  'value': '*#<keyword>* - Tag your message with *#* to say why they deserve your ' + emoji + '. Ex. #excellence, #energy, #empathy\n' +
                           '*' + emoji + ' limit* - Every user has a max of 5 ' + emoji + 's they can give which reset daily.',
                }
              ],
            }
          ],
        });
      });
};


