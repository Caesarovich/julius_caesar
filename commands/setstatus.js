// Set status Command

const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const command = {
  name: 'Set Status',  // The command's name
  description: 'Set the status of the bot.\nStatus: **`online`, `idle`, `invisible`, `dnd`**',  // What the command does
  category: 'Owner', // In wich category the command is (Category must exist)
  cmd: 'setstatus',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: true, // Is reserved to bot Owner
  permissions: [], // Discord permissions required for the user
  clientPermissions: [], // Discord permissions required for this command
  arguments: [
    new CommandArgument('Status', 'string', false),
  ], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    if (args[0].value.toLowerCase() != 'online' && args[0].value.toLowerCase() != 'idle' && args[0].value.toLowerCase() != 'invisible' && args[0].value.toLowerCase() != 'dnd'){
      msg.reply('wrong status type !');
    } else {
      Bot.user.setStatus(args[0].value.toLowerCase());
      msg.channel.send('**Status changed**')
    }
  }
}

module.exports = new Command(command);  // Export command