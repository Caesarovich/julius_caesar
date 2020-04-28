// Ban command
const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const command = {
  name: 'Ban',  // The command's name
  description: 'Ban a member from your guild.',  // What the command does
  category: 'Administration', // In wich category the command is (Category must exist)
  cmd: 'ban',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: false, // Is reserved to bot Owner
  permissions: ['BAN_MEMBERS'], // Discord permissions required for the user
  clientPermissions: ['BAN_MEMBERS'], // Discord permissions required for this command
  arguments: [
    new CommandArgument('Member', 'member', false),
    new CommandArgument('Reason', 'longstring', true)
  ], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    const member = args[0].value;

    if (member.bannable){
      member.user.send(`**You have been banned from ${msg.guild.name}.**`);

      member.ban({reason: args[1] ? args[1].value : 'none'}).then(() => {
        let message = new Discord.MessageEmbed()
        .setTitle(`**${member.user.tag} has been banned.**`)
        .setDescription(`**Reason:** ${args[1] ? args[1].value : 'none'}`)
        .setAuthor(`Banned by ${msg.member.user.tag}`, msg.member.user.displayAvatarURL())
        .setColor('#ff0000')
        .setTimestamp(Date.now())

        msg.channel.send(message);
      });
    } else {
      msg.reply('**this user is not bannable !**');
    }
  }
}

module.exports = new Command(command);  // Export command