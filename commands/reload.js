// Reload Command
const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const command = {
  name: 'Reload',  // The command's name
  description: 'A command to refresh the bot\'s commands and settings.',  // What the command does
  category: 'Owner', // In wich category the command is (Category must exist)
  cmd: 'reload',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: true, // Is reserved to bot Owner
  permissions: [], // Discord permissions required for the user
  clientPermissions: [], // Discord permissions required for this command
  arguments: [], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    try {  // Useful not to crash the Bot while developping
      reloadBot();
      var message = new Discord.MessageEmbed()
        .setAuthor('Reload succes')
        .setTitle(`🔄 **Succesfully reloaded settings, ${Object.keys(Commands).length} commands and ${Object.keys(Modules).length} modules.**`)

      msg.channel.send(message);
    } catch(err) {
      console.log('Reload error: ', err)
      var message = new Discord.MessageEmbed()
        .setAuthor('Error while trying to reload')
        .setTitle(`**${err.message}**`)
        .setDescription(`*${err.stack}*`)
        .setColor('#ff0000')
        .setFooter('Please check console.')

      msg.channel.send(message);
    }
  }
}

module.exports = new Command(command);  // Export command