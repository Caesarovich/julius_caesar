// Verification command

const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const command = {
  name: 'Verification',  // The command's name
  description: 'Enable/Disable verification process for your guild. While enabled, every new members must verify being humans, despite they won\'t be able to do anything.\n*This creates a new role **\'verified\'** given to verified members and a channel.*',  // What the command does
  category: 'Administration', // In wich category the command is (Category must exist)
  cmd: 'verification',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: false, // Is reserved to bot Owner
  permissions: ['MANAGE_GUILD'], // Discord permissions required for the user
  clientPermissions: ['MANAGE_ROLES', 'MANAGE_CHANNELS', 'ADD_REACTIONS'], // Discord permissions required for this command
  arguments: [
    new CommandArgument('Enable/Disable', 'string', false)
  ], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    const Verification = Modules.Verification;
    const verification = Modules.GuildSettings.getSetting(msg.guild.id, 'verification');

    if (args[0].value.toLowerCase() === 'enable') {  // ENABLING
      if (!verification.enabled) {
        const [verified, channel, message] = await Verification.setup(msg.guild);
          
        const verif = {
          enabled: true,
          channelID: channel.id,
          roleID: verified.id,
          messageID: message.id     
        }

        Modules.GuildSettings.setSetting(msg.guild.id, 'verification', verif);


        let _message = new Discord.MessageEmbed()
          .setTitle('**Verification enabled !**')
          .setDescription('Verification has been enabled on your server. New users will now have to verify.')
          .addField('Role', verified, false)
          .addField('Channel', channel, false)
          .setTimestamp(Date.now())

        msg.channel.send(_message);
      } else {  // Already enabled
        msg.reply('verification is already enabled !');
      }
    } else if (args[0].value.toLowerCase() === 'disable') {  // DISABLING
      if (verification.enabled) {
        const channel = await msg.guild.channels.cache.get(verification.channelID);
        const verified = await msg.guild.roles.fetch(verification.roleID); 

        await Verification.unsetup(msg.guild, verified, channel);

        const verif = {  // Preset of setting
          enabled: false,
          channelID: null,
          roleID: null,
          messageID: null     
        }

        Modules.GuildSettings.setSetting(msg.guild.id, 'verification', verif);

        let message = new Discord.MessageEmbed()
          .setTitle('**Verification disabled !**')
          .setDescription('Verification has been disabled on your server. New users no longer need to verify.')
          .setTimestamp(Date.now())

        msg.channel.send(message);
      } else { // Already disabled
        msg.reply('verification is already disabled !');
      }
    } else {  // Wrong arg format
      msg.reply('wrong option **Enable** / **Disable** !');
    }
  }
}

module.exports = new Command(command);  // Export command//