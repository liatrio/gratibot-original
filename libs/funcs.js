module.exports = {
    trimLength: function (message, emoji)
    {
      const removeEmoji = new RegExp(emoji, 'g');
      let fullMessage = message.text;
      // Strips users _ emoji out of message
      fullMessage = fullMessage.replace(/(\s)+(<.*?>)|(<.*?>)(\s)+/g, '');
      fullMessage = fullMessage.replace(removeEmoji, '');
      return fullMessage;
    },

    getUsers: function (message)
    {
      let fullMessage = message.text;
      const catchUsers = fullMessage.match(/<.*?>/g);
      const uniqueUsers = [...new Set(catchUsers)];
      return uniqueUsers;
    }
}

function trimLength(message, emoji)
    {
      const removeEmoji = new RegExp(emoji, 'g');
      let fullMessage = message;
      // Strips users _ emoji out of message
      fullMessage = fullMessage.replace(/(\s)+(<.*?>)|(<.*?>)(\s)+/g, '');
      fullMessage = fullMessage.replace(removeEmoji, '');
      return fullMessage;
    };


    function getUsers(message)
    {
      let fullMessage = message;
      const catchUsers = fullMessage.match(/<.*?>/g);
      const uniqueUsers = [...new Set(catchUsers)];
      return uniqueUsers;
    };