// Leave command

const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const command = {
  name: 'Leave',  // The command's name
  description: 'Leave the voice channel.',  // What the command does
  category: 'Music', // In wich category the command is (Category must exist)
  cmd: 'leave',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: false, // Is reserved to bot Owner
  permissions: [], // Discord permissions required for the user
  clientPermissions: [], // Discord permissions required for this command
  arguments: [], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    const left = await Modules.Music.leave(msg.member);
    msg.channel.send(left);
  }
}

module.exports = new Command(command);  // Export command