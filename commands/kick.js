// Kick command
const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const command = {
  name: 'Kick',  // The command's name
  description: 'Kick a member from your guild.',  // What the command does
  category: 'Administration', // In wich category the command is (Category must exist)
  cmd: 'kick',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: false, // Is reserved to bot Owner
  permissions: ['KICK_MEMBERS'], // Discord permissions required for the user
  clientPermissions: ['KICK_MEMBERS'], // Discord permissions required for this command
  arguments: [
    new CommandArgument('Member', 'user', false),
    new CommandArgument('Reason', 'longstring', true)
  ], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    const member = args[0].value;

    if (member.kickable){
      member.user.send(`**You have been kicked from ${msg.guild.name}.**`);

      member.kick({reason: args[1] ? args[1].value : 'none'});

      let message = new Discord.MessageEmbed()
        .setTitle(`**${member.user.tag} has been kicked.**`)
        .setDescription(`**Reason:** ${args[1] ? args[1].value : 'none'}`)
        .setAuthor(`Kicked by ${msg.member.user.tag}`, msg.member.user.displayAvatarURL())
        .setColor('#ff0000')
        .setTimestamp(Date.now())

      msg.channel.send(message);
    } else {
      msg.reply('**this user is not kickable !**');
    }
  }
}

module.exports = new Command(command);  // Export command