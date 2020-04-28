// Set activity Command

const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const command = {
  name: 'Set Activity',  // The command's name
  description: 'Set the activity of the bot.',  // What the command does
  category: 'Owner', // In wich category the command is (Category must exist)
  cmd: 'setactivity',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: true, // Is reserved to bot Owner
  permissions: [], // Discord permissions required for the user
  clientPermissions: [], // Discord permissions required for this command
  arguments: [
    new CommandArgument('Amount', 'integer', true),
  ], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    //
  }
}

module.exports = new Command(command);  // Export command