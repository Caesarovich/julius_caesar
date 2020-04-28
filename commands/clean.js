// Set welcome channel Command

const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const command = {
  name: 'Clean',  // The command's name
  description: 'Clean a given amount of messages in the channel. *By default the amount is 15.*',  // What the command does
  category: 'Administration', // In wich category the command is (Category must exist)
  cmd: 'clean',  // The actual command (Must be lowercase)
  aliases: ['cln'], // A list of aliases
  owner: false, // Is reserved to bot Owner
  permissions: ['MANAGE_MESSAGES'], // Discord permissions required for the user
  clientPermissions: ['MANAGE_MESSAGES'], // Discord permissions required for this command
  arguments: [
    new CommandArgument('Amount', 'integer', true),
  ], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    const amount = Math.floor(Math.ceil(args[0] ? args[0].value : 15, 50), 1);

    msg.channel.bulkDelete(amount).then(messages => {
      msg.channel.send(`**:wastebasket: Cleaned ${messages.size} messages.**`).then(message => {
        setTimeout(() => {
          message.delete();
        }, 2 * 1000);
      });
    });
  }
}

module.exports = new Command(command);  // Export command