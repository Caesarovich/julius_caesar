// Invite Command
const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const command = {
  name: 'Invite',  // The command's name
  description: 'Invite Julius Caesar to you server.',  // What the command does
  category: 'Other', // In wich category the command is (Category must exist)
  cmd: 'invite',  // The actual command (Must be lowercase)
  aliases: ['inv'], // A list of aliases
  owner: true, // Is reserved to bot Owner
  permissions: [], // Discord permissions required for the user
  clientPermissions: [], // Discord permissions required for this command 
  arguments: [], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    msg.author.send(`**Here's my invite link:** ${Settings.InviteLink}`);
    msg.channel.send(`:mailbox_with_mail: I sent you my invite link __in DM__.`);
  }
}

module.exports = new Command(command);  // Export command