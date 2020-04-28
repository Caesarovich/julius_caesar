// Music Play Command

const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const command = {
  name: 'Play',  // The command's name
  description: 'Play a music / add it to queue.',  // What the command does
  category: 'Music', // In wich category the command is (Category must exist)
  cmd: 'play',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: false, // Is reserved to bot Owner
  permissions: [], // Discord permissions required for the user
  clientPermissions: ['CONNECT', 'SPEAK'], // Discord permissions required for this command
  arguments: [
    new CommandArgument('Music', 'url', false)
  ], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    const joined = await Modules.Music.join(msg.member, msg.channel, false);
    if (joined) {
      Modules.Music.addSong(msg.member, msg.channel, args[0].value, !Modules.Music.getGuild(msg.guild).playing);
    }
  }
}

module.exports = new Command(command);  // Export command