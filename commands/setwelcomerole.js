// Set welcome role Command

const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const command = {
  name: 'Set Welcome Role',  // The command's name
  description: 'Set this role as the "Welcome role". It will be added to every member that joins.',  // What the command does
  category: 'Administration', // In wich category the command is (Category must exist)
  cmd: 'setwelcomerole',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: false, // Is reserved to bot Owner
  permissions: ['MANAGE_ROLES'], // Discord permissions required for the user
  clientPermissions: ['MANAGE_ROLES'], // Discord permissions required for this command
  arguments: [
    new CommandArgument('Role', 'role', false)
  ], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    const role = await msg.guild.roles.fetch(args[0]);
    
    if (role) {
      Modules.GuildSettings.setSetting(msg.guild.id, 'welcomeRoleID', role.id);
      msg.channel.send(`**:gear: Welcome role set !**`);
    } else {
      msg.channel.send(`Role not found :'(`);
    }
  }
}

module.exports = new Command(command);  // Export command