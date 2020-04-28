// Bot Infos Command

const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const command = {
  name: 'Bot Infos',  // The command's name
  description: 'Informations about Julius Cesar.',  // What the command does
  category: 'Infos', // In wich category the command is (Category must exist)
  cmd: 'botinfos',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: false, // Is reserved to bot Owner
  permissions: [], // Discord permissions required for the user
  clientPermissions: [], // Discord permissions required for this command
  arguments: [], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    var message = new Discord.MessageEmbed()
      .setTitle('**Bot\'s Informations**')
      .setDescription('Cesar is a Discord Bot made with [Discord.JS](https://discord.js.org/#/) library. See the changelogs on the support server.')
      .setThumbnail(Bot.user.displayAvatarURL)
      .setFooter(`Creator: ${Bot.owner.tag} | Version: ${Settings.Version}`, Bot.owner.displayAvatarURL());
      message['fields'] = [
        {
          name: '__Guilds:__',
          value: `The total number of joined guilds is **${Bot.guilds.cache.size}**`
        },
        {
          name: '__Users:__',
          value: `The total number of users is **${Bot.users.cache.size}**`
        },
        {
          name: '__RAM:__',
          value: `Memory used: **${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB**`
        },
        {
          name: '__API Ping:__',
          value: `Discord\'s API Latency: **${Math.round(Bot.ws.ping)} ms**`
        },
      ]

    msg.channel.send(message)
  }
}

module.exports = new Command(command);  // Export command