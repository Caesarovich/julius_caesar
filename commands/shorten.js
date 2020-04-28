// Shorten Command
const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const BitlyClient = require('../node_modules/bitly').BitlyClient;
const bitly = new BitlyClient(Settings.Commands.BitLyToken);

const command = {
  name: 'Shorten',  // The command's name
  description: 'Shorten links using [Bit.ly](https://bitly.com).',  // What the command does
  category: 'Other', // In wich category the command is (Category must exist)
  cmd: 'shorten',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: false, // Is reserved to bot Owner
  permissions: [], // Discord permissions required for the user
  clientPermissions: [], // Discord permissions required for this command
  arguments: [
    new CommandArgument('URL', 'url', false)
  ], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    const response = await bitly.shorten(args[0].value);

    let message = new Discord.MessageEmbed()
      .setAuthor('Here\'s your shortened link:')
      .setTitle(`**${response.link}**`)
      .setColor('#ffa724')
      
    msg.channel.send(message);
  }
}

module.exports = new Command(command);  // Export command