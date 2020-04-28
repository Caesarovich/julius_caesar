// Set welcome channel Command

const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const command = {
  name: 'Set Welcome Channel',  // The command's name
  description: 'Set this channel as the "Welcome channel". When a new member join he will be greated.',  // What the command does
  category: 'Administration', // In wich category the command is (Category must exist)
  cmd: 'setwelcomechannel',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: false, // Is reserved to bot Owner
  permissions: ['MANAGE_GUILD'], // Discord permissions required for the user
  clientPermissions: [], // Discord permissions required for this command
  arguments: [], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    Modules.GuildSettings.setSetting(msg.guild.id, 'welcomeChannelID', msg.channel.id);

    msg.channel.send(`**:gear: Welcome channel set !**`);
  }
}

module.exports = new Command(command);  // Export command