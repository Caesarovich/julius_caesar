// Join command

const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const command = {
  name: 'Join',  // The command's name
  description: 'Join your voice channel.',  // What the command does
  category: 'Music', // In wich category the command is (Category must exist)
  cmd: 'join',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: false, // Is reserved to bot Owner
  permissions: [], // Discord permissions required for the user
  clientPermissions: ['CONNECT', 'SPEAK'], // Discord permissions required for this command
  arguments: [], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    Modules.Music.join(msg.member, msg.channel);
  }
}

module.exports = new Command(command);  // Export command