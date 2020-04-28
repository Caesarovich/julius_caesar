// Meme Command
const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const https = require('https');

function getRandomMeme(callback){  // Thanks to R3l3ntl3ss's Meme Api
  https.get('https://meme-api.herokuapp.com/gimme/1', (res) => {
    var fullData = '';
    res.on('data', (data) => {
      fullData = fullData + data;
    })
    res.on('end', () => {
      var d = JSON.parse(fullData) ; // Converting from JSON
      callback(d.memes[0]);
    })
  });
}

const command = {
  name: 'Meme',  // The command's name
  description: 'See a random meme from Reddit.',  // What the command does
  category: 'Fun', // In wich category the command is (Category must exist)
  cmd: 'meme',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: false, // Is reserved to bot Owner
  permissions: [], // Discord permissions required for the user
  clientPermissions: [], // Discord permissions required for this command
  arguments: [], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    getRandomMeme((meme) => {
      var message = new Discord.MessageEmbed()
      .setAuthor(meme.title, 'https://s18955.pcdn.co/wp-content/uploads/2017/05/Reddit.png', meme.postLink)
      .setImage(meme.url)
      .setColor('#ff5700')
      .setFooter('Thanks to R3l3ntl3ss\'s Meme_Api')

      msg.channel.send(message);
    });    

  }
}

module.exports = new Command(command);  // Export command