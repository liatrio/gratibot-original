/*
 * Module for checking description length.
 */

module.exports = function(controller) {

    controller.hears(process.env.EMOJI || ':toast:','ambient', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            //console.log(message)
            var emoji = process.env.EMOJI || ':toast:'
            var remove_emoji = new RegExp(emoji, "g");

            full_message = message.event.text;
            //Gets all users mentioned
            var catch_Users = full_message.match(/<.*?>/g);

            let unique_Users = [...new Set(catch_Users)];

            //Strips users _ emoji out of message
            full_message = full_message.replace(/(\s)+(<.*?>)|(<.*?>)(\s)+/g,'');
            full_message = full_message.replace(remove_emoji,'');

            console.log(full_message)

            if (full_message.length < 40)
            {
                convo.ask('Why is ' + unique_Users + ' deserving of ' + emoji +"?", function(response, convo) {
                    if (response.text.length < 40)
                    {
                        convo.say('Distributing ' + emoji + ' requires a description greater than 40 characters. Please try again');
                        convo.next();
                    }
                    else
                    {
                        convo.say('Awesome! Giving ' + emoji + " to " + unique_Users);
                        convo.next();
                    }
                });
            }
            else
            {
                convo.say('Awesome, ' + emoji + ' given to ' + unique_Users);
            }
        });

    });

};
