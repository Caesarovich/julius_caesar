// Support Command
const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const command = {
  name: 'Support server',  // The command's name
  description: 'Join the official support server.',  // What the command does
  category: 'Other', // In wich category the command is (Category must exist)
  cmd: 'support',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: false, // Is reserved to bot Owner
  permissions: [], // Discord permissions required for the user
  clientPermissions: [], // Discord permissions required for this command 
  arguments: [], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    msg.channel.send(`:shield: Join the support server here:\n${Settings.SupportInviteLink}`);
  }
}

module.exports = new Command(command);  // Export command