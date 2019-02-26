module.exports = {
    trimLength: function(message, emoji)
    {
      const removeEmoji = new RegExp(emoji, 'g');
      let fullMessage = message.event.text;
      // Strips users _ emoji out of message
      fullMessage = fullMessage.replace(/(\s)+(<.*?>)|(<.*?>)(\s)+/g, '');
      fullMessage = fullMessage.replace(removeEmoji, '');
      return fullMessage;
    },

    getUsers: function(message)
    {
      let fullMessage = message.event.text;
      const catchUsers = fullMessage.match(/<.*?>/g);
      const uniqueUsers = [...new Set(catchUsers)];
      return uniqueUsers;
    }



}
