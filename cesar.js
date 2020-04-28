// Bot base by Caesarovich

console.log('[Bot] Starting...');

Discord = require('discord.js');
fs = require('fs');
mysql = require('mysql');
path = require('path');


// Globals

Bot = require('./classes/discord_client.js');
Settings = {};
Modules = {};
Commands = {};
DB = null;

requireUncached = function(module) {  // Allow to require a file without caching it
  delete require.cache[require.resolve(module)];
  return require(module);
}


// Load settings

function loadSettings(){
  console.log('[Bot] Loading Settings\n')
  Settings = JSON.parse(fs.readFileSync(path.join(__dirname, 'settings.json')));  // Replacing Global Settings
}


// Load modules 

function loadModules(){
  var _mods = {};  // Temporary list
  var files = fs.readdirSync(path.join(__dirname, './modules'));  // Get a list of module files
  console.log(`[Bot] Loading ${files.length} modules:`);  

  files.forEach((v) => {
    var mod = requireUncached(`./modules/${v}`);  // Load the file

    if (!Settings.DisabledModules.includes(mod.Name)){
      _mods[mod.Name] = mod;  // Add it to temporary list
      if (Modules[mod.Name]) {
        Modules[mod.Name].__removeListeners();
        _mods[mod.Name].__backups = Modules[mod.Name].__backups;
      }
      console.log(`[Bot] Loaded ${mod.Name}`);
    } else {
      console.log(`[Bot] Not loaded ${mod.Name} (Disabled)`);
    }
  });
  Modules = _mods;  // Replace Global modules
}

function initModules(){
  for (let [_, v] of Object.entries(Modules)){
    v.Init();  // Init Module
  }
}


// Load commands

function loadCommands(){  // Refresh Commands
  var _cmds = {};  // Temporary list
  var files = fs.readdirSync(path.join(__dirname, 'commands'));  // Get a list of command files
  console.log(`[Bot] Loading ${files.length} commands:`);  

  files.forEach((v) => {
    var command = requireUncached(`./commands/${v}`);  // Load the file
    if (!Settings.DisabledCommands.includes(command.name)) {
      _cmds[command.cmd] = command;  // Add it to temporary list
      console.log(`[Bot] Loaded ${command.name}`);
    } else {
      console.log(`[Bot] Not loaded ${command.name} (Disabled)`);
    }
  });
  Commands = _cmds;  // Replace Global commands
}


// Reload

reloadBot = function(){
  // Setting
  loadSettings();
  // Modules
  loadModules();
  // Commands
  loadCommands(); 
  // Database
  if (Settings.Database.enabled){
    DB = mysql.createPool(Settings.Database);
  }
  // Init Modules
  initModules();
}
reloadBot();



// Util



// Commands

var coolDownList = {};

async function CommandHandler(msg, args) {  // This is the command handler | Already parsed args must be passed
  const now = Date.now();
  for (let [_, command] of Object.entries(Commands)){
    if (command.getCmds().includes(args[0])){  // Find matching command or alias
      if (!coolDownList[msg.author.id] || coolDownList[msg.author.id] + Settings.CommandDelay * 1000 < now ) {
        coolDownList[msg.author.id] = now;
        const validate = await command.validate(args.slice(1, args.length), msg);
        if (validate === true){
          console.log(`${msg.member.user.tag} >> Executed command >> ${command.name}`);
          try {
            await command.func(msg, await command.getArgmuments(args.slice(1, args.length), msg));  // Executes the command's function      
          } catch(error) {  // prevent from crashing bot while developing new commands
            console.log(error);
            msg.channel.send(':interrobang: An error occured while executing the command. Please contact the Bot\'s creator or join the support server.');
          }
        } else {
          let message = new Discord.MessageEmbed()
            .setTitle(validate[0])
            .setFooter(validate[1])
            .setColor('#ff3333')

          msg.channel.send(message);
        }
      } else {
        msg.reply(`**cooldown ! Please wait ${Math.ceil((coolDownList[msg.author.id] + Settings.CommandDelay * 1000 - now) / 1000)} seconds before calling a command :hourglass:**`)
      }      
    }
  }
}

function onMessage(message) {  // On message received or updated
  if (message.channel.type != 'text') return;  // Only working in Guild text Channel
  if (message.author == Bot.user) return;  // Not responding to itself
  if (message.content.toLowerCase().startsWith('<@688417101643513952>')) {Commands['help'].func(message); return;} // Mention to get help
  if (!message.content.toLowerCase().startsWith(Settings.Prefix.toLowerCase())){return;}  // Check for prefix.

  var args = message.content.split(' ');  // Split the messages in arguments
  args[0] = args[0].toLowerCase().replace(Settings.Prefix.toLowerCase(), '');  // Strip the prefix as we don't need it now 
  CommandHandler(message, args);  // Pass to the handler
}


// Events 

Bot.on('ready', async () => {
  console.log(`[Bot] Logged in as ${Bot.user.tag}!`);

  Bot.owner = await Bot.users.fetch(Settings.OwnerID);
});

Bot.on('message', onMessage);  // On new message
Bot.on('messageUpdate', (oldMessage, newMessage) => {
  if (newMessage.content != oldMessage.content){
    onMessage(newMessage);
  }
}); 


// Database

if (DB) {
  DB.on('error', (err) => {  // Database Error
    console.log(`[Database] Error: ${err}`);
  });
}



// Start client

Bot.login(Settings.BotToken);