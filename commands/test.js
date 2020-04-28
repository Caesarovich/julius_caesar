// Test command
const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')
const CommandArgumentList = require('../classes/command_argument_list.js')


const command = {
  name: 'Test',  // The command's name
  description: 'A usefull command for me to test stuff.',  // What the command does
  category: 'Owner', // In wich category the command is (Category must exist)
  cmd: 'test',  // The actual command (Must be lowercase)
  aliases: ['t'], // A list of aliases
  owner: true, // Is reserved to bot Owner
  permissions: [], // Discord permissions required for the user
  clientPermissions: [], // Discord permissions required for this command
  arguments: [
    new CommandArgument('Member', 'member', false),
    new CommandArgument('Reason', 'longstring', true)
    
  ], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    console.log(args)

    const member = args[0].value
    if (member){
      member.user.send(`**You have been kicked from ${msg.guild.name}.**`);



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

    msg.channel.send('Tested.')
  }
}

module.exports = new Command(command);  // Export command