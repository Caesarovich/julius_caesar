// GuildSettings: Guild Settings

const CustomModuleBase = require('../classes/custom_module_base.js');

var _module = new CustomModuleBase('GuildSettings');

_module.Guilds = {};

_module.DefaultSettings = {
  welcomeChannelID: null,
  welcomeRoleID: null,
  verification: {
    enabled: false,
    channelID: null,
    roleID: null,
    messageID: null
  }
}

_module.initSettings = (GuildID) => {
  try {
    _module.Guilds[GuildID] = _module.DefaultSettings;
    _module.saveSettings(GuildID);
  } catch (err) {
    console.log('[Module Error GuildSettings]', err);
  }
}

_module.getSettings = (GuildID) => {  // Get ALL settings
  try {
    if (_module.Guilds[GuildID] == null){
      _module.initSettings(GuildID);
    }
    return _module.Guilds[GuildID];
  } catch (err) {
    console.log('[Module Error GuildSettings]', err);
  }
}

_module.getSetting = (GuildID, Setting) => {  // Get a setting
  try {
    return _module.getSettings(GuildID)[Setting] || _module.DefaultSettings[Setting];
  } catch (err) {
    console.log('[Module Error GuildSettings]', err);
  }
}

_module.setSettings = (GuildID, Settings) => {  // Set settings
  try {
    if (_module.Guilds[GuildID] == null){
      _module.initSettings(GuildID);
    }
    _module.Guilds[GuildID] = Settings;
    _module.saveSettings(GuildID);
  } catch (err) {
    console.log('[Module Error GuildSettings]', err);
  }
}

_module.setSetting = (GuildID, Setting, value) => {  // Set a setting
  try {
    if (_module.Guilds[GuildID] == null){
      _module.initSettings(GuildID);
    }
    _module.Guilds[GuildID][Setting] = value;
    _module.saveSettings(GuildID);
  } catch (err) {
    console.log('[Module Error GuildSettings]', err);
  }
},

_module.saveSettings = (GuildID) => {  // Save Settings into DB 
  DB.query(`REPLACE INTO GuildSettings(GuildID, Settings) VALUES (${DB.escape(GuildID)}, ${DB.escape(JSON.stringify(_module.getSettings(GuildID)))})`, (err) =>{
    if (err) {console.log('[DB Error]:', err)}
  });
}


_module.Init = () => {
  DB.query("SELECT GuildID, Settings FROM GuildSettings", function(err, data){
    if (err){return}
    data.forEach(row => {
      _module.Guilds[row.GuildID] = JSON.parse(row.Settings);
    });
  });
}


module.exports = _module;  // Export module