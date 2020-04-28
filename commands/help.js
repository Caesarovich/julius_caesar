// Help Command
const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')



function _GetCategories(commands, member){
  let categories = {};

  for (let [k, command] of Object.entries(commands)){
    if (!command.getMissingPermissions(member) && (!command.owner || member.user === Bot.owner)){
      categories[command.category] ? categories[command.category][k] = command : categories[command.category] = {[k]: command};
    }
  }

  return categories;
}

function _FancyCommandsArray(commands){
  let list = [];

  for (let [k, command] of Object.entries(commands)){
    list.push(`\`${command.cmd}\``);
  }

  return list;
}


function _MakeHelpFields(categories){
  let fields = [];

  for (let [category, commands] of Object.entries(categories)){

    fields.push({
      name: `**${category}**`,
      value: _FancyCommandsArray(commands).join(', ')
    });
  }

  return fields;
}

function _getAliasesStrings(command){
  let aliases = []

  command.aliases.forEach(alias => {
    aliases.push(`\`${alias}\``);
  });
  return aliases;
}


function _getUsageString(command, guild){
  const prefix = guild ? '' : 'c!';
  let str = `**${prefix + command.cmd}**`;

  command.arguments.forEach(v => {
    if (v.Optionnal) {
      str = str + ` (${v.Name})`
    } else {
      str = str + ` {${v.Name}}`
    }
  });

  return str;
}

const command = {
  name: 'Help',  // The command's name
  description: 'A command that lists all the commands or gives detailled informations about a specific command.',  // What the command does
  category: 'Other', // In wich category the command is (Category must exist)
  cmd: 'help',  // The actual command (Must be lowercase)
  aliases: ['h'], // A list of aliases
  owner: false, // Is reserved to bot Owner
  permissions: [], // Discord permissions required for the user
  clientPermissions: [], // Discord permissions required for this command 
  arguments: [
    new CommandArgument('Command', 'string', true)
  ], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    if (args.length == 0) {  // Help List
      const categories = _GetCategories(Commands, msg.member);
      const fields = _MakeHelpFields(categories);

      let message = new Discord.MessageEmbed()
        .setTitle('**Commands list**')
        .setDescription('This is a list of available commands. Commands you aren\'t authorised to use may not be visible to you.\nUse `help command` to get help about a specific command.')
        .setColor('#ffa724')
        message['fields'] = fields;

      msg.channel.send(message);
    } else {  // Help specific command
      for (let [_, command] of Object.entries(Commands)) {
        if (command.getCmds().includes(args[0].value)){  // Find matching command or alias
          let message = new Discord.MessageEmbed()
            .setAuthor(command.category)
            .setTitle(`**${command.name}**`)
            .setDescription(command.description)
            .setColor('#ffa724')
            .setFooter('Arguments: {} = Required, () = Optionnal')
            .addField('Usage:', _getUsageString(command, null))

          if (command.aliases.length > 0){
            message.addField('Aliases:', _getAliasesStrings(command).join(', '));
          }

          msg.channel.send(message);
          return;
        }
      }     
      msg.reply('command name doesn\'t exists.');
    } 
  }
}

module.exports = new Command(command);  // Export command