// Flip Command
const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const _Coins = [
  {
    Name: 'Augustus',
    Date: 'Struck circa 25-20 BC',
    Description: 'CAE SAR, bare head right / AVGVSTVS, altar hung with wreaths and garlanded; on front are two hinds standing right and left facing one another; all within linear border.',
    Link: 'https://www.cngcoins.com/Coin.aspx?CoinID=393472',
    Sides: [
      {
        Name: 'Head',
        ImageURL: 'https://i.imgur.com/LgzivjE.jpg'
      },
      {
        Name: 'Tail',
        ImageURL: 'https://i.imgur.com/GzWHpUK.jpg'
      }
    ]
  },
  {
    Name: 'Tiberius, with Divus Augustus',
    Date: 'Struck circa 14-16',
    Description: 'TI CΛESΛR DIVI ΛVG F ΛVGVSTVS, laureate head of Tiberius right / DIVOS ΛVGVST DIVI F, laureate head of Divus Augustus right; six-pointed star above. ',
    Link: 'https://www.cngcoins.com/Coin.aspx?CoinID=3934732',
    Sides: [
      {
        Name: 'Head',
        ImageURL: 'https://i.imgur.com/BTafCZX.jpg'
      },
      {
        Name: 'Tail',
        ImageURL: 'https://i.imgur.com/m7Nwrj5.jpg'
      }
    ]
  },
  {
    Name: 'Tiberius',
    Date: 'Struck circa AD 14-37',
    Description: '“Tribute Penny” type. Laureate head right; long, parallel ribbons / Livia, as Pax, seated right, holding scepter and olive branch, feet on footstool; ornate chair legs, single line below.',
    Link: 'https://www.cngcoins.com/Coin.aspx?CoinID=393297',
    Sides: [
      {
        Name: 'Head',
        ImageURL: 'https://i.imgur.com/2Z1aDCl.jpg'
      },
      {
        Name: 'Tail',
        ImageURL: 'https://i.imgur.com/lAPaWdN.jpg'
      }
    ]
  },       
]

const command = {
  name: 'Flip coin',  // The command's name
  description: 'Throw an antic coin in the air. ^^\' Please note that i\'m not an expert and I may have missed some informations.',  // What the command does
  category: 'Fun', // In wich category the command is (Category must exist)
  cmd: 'flip',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: false, // Is reserved to bot Owner
  permissions: [], // Discord permissions required for the user
  clientPermissions: [], // Discord permissions required for this command
  arguments: [], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    const coin = _Coins[Math.floor(Math.random() * _Coins.length)];
    const side = coin.Sides[Math.floor(Math.random() * coin.Sides.length)];

    let message = new Discord.MessageEmbed()
      .setTitle(`**${side.Name}**`)
      .setAuthor(coin.Name)
      .setDescription(`${coin.Description}\n[Source](${coin.Link})`)
      .setColor('#ffa724')
      .setThumbnail(side.ImageURL)
      .setFooter(coin.Date)

    msg.channel.send(message);
  }
}

module.exports = new Command(command);  // Export command