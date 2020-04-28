// Dice Command

const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const command = {
  name: 'Dice',  // The command's name
  description: 'Throw a dice on the table.',  // What the command does
  category: 'Fun', // In wich category the command is (Category must exist)
  cmd: 'dice',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: false, // Is reserved to bot Owner
  permissions: [], // Discord permissions required for the user
  clientPermissions: [], // Discord permissions required for this command
  arguments: [], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    msg.channel.send(`:game_die: ${msg.member.displayName} rolls the dice...  **${Math.ceil(Math.random() * 6)}**`);
  }
}

module.exports = new Command(command);  // Export command