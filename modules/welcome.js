// Welcome Module

const CustomModuleBase = require('../classes/custom_module_base.js');


var _module = new CustomModuleBase('Welcome');


_module.welcome = async (member) => {
  if (!member){return;}

  const welcomeChannelID = Modules.GuildSettings.getSetting(member.guild.id, 'welcomeChannelID');
  const welcomeRoleID = Modules.GuildSettings.getSetting(member.guild.id, 'welcomeRoleID');

  if (welcomeChannelID) {
    const welcomeChannel = await member.guild.channels.cache.get(welcomeChannelID);
    if (!welcomeChannel) {   // Is channel with such ID existing
      Modules.GuildSettings.setSetting(member.guild.id, 'welcomeChannelID', null)  // When not exist set to null
      return;
    }
    
    welcomeChannel.send(`** ${member} just joined the server.**`);
  }

  if (welcomeRoleID) {  
    const welcomeRole = await member.guild.roles.fetch(welcomeRoleID);
    if (!welcomeRole) {  // Is role with such ID existing
      Modules.GuildSettings.setSetting(member.guild.id, 'welcomeRoleID', null)  // When not exist set to null
      return;
    }
    
    member.roles.add(welcomeRole);
  }
}


_module.onJoin = (member) => {
  const verification = Modules.GuildSettings.getSetting(member.guild.id, 'verification');

  if (!verification.enabled){  // If verification is enabled don't send welcome. Verification will on welcome on success
    _module.welcome(member);
  }
}


_module.onLeave = async (member) => {
  const welcomeChannelID = Modules.GuildSettings.getSetting(member.guild.id, 'welcomeChannelID');

  if (welcomeChannelID) {
    const welcomeChannel = await member.guild.channels.cache.get(welcomeChannelID);
    if (!welcomeChannel) {   // Is channel with such ID existing
      Modules.GuildSettings.setSetting(member.guild.id, 'welcomeChannelID', null)  // When not exist set to null
      return;
    }
    
    welcomeChannel.send(`** ${member.user.tag} just left the server.**`);
  }
}


_module.Init = () => {
  _module.__addListener(Bot, 'guildMemberAdd', _module.onJoin);
  _module.__addListener(Bot, 'guildMemberRemove', _module.onLeave);
}


module.exports = _module;  // Export module