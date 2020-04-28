// GuildSettings: Guild Settings

const CustomModuleBase = require('../classes/custom_module_base.js');

var _module = new CustomModuleBase('Verification');


_module.pendings = {};



 // VERIFYING
_module.onVerified = async (member, role) => {
  if (member) {
    if (role && !member.roles.cache.has(role.id)) {
      await member.roles.add(role);
    }
  
    Modules.Welcome.welcome(member);
  }
}


_module.onJoin = async (member) => {
  var verification = Modules.GuildSettings.getSetting(member.guild.id, 'verification');

  if (verification.enabled){  // If verification is enabled don't send welcome. Verification will on welcome on success
    var role = await member.guild.roles.fetch(verification.roleID);
    if (!role) {
      role = await _module.doRoles(member.guild);
      verification.roleID = role.id;
      Modules.GuildSettings.setSetting(member.guild.id, 'verification', verification);

      member.guild.members.fetch(false).then(members => {
        members.forEach(m => {
          m.roles.add(role);
        });
      });
    }

    var channel = await member.guild.channels.cache.get(verification.channelID);
    if (!channel) {
      channel = await _module.doChannel(member.guild, role);
      verification.channelID = channel.id;
      Modules.GuildSettings.setSetting(member.guild.id, 'verification', verification);
    }

    var message = await channel.messages.fetch(verification.messageID);
    if (!message) {
      message = await _module.doMessage(channel);
      verification.messageID = message.id;
      Modules.GuildSettings.setSetting(member.guild.id, 'verification', verification);
    }

    const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === member.user.id;
    const collector = message.createReactionCollector(filter);

    _module.pendings[`${member.guild.id}:${member.user.id}`] = collector;

    collector.on('collect', (r, u) => {
      collector.stop();
      _module.onVerified(member, role);
    });
  }
}

_module.onLeave = (member) => {
  const verification = Modules.GuildSettings.getSetting(member.guild.id, 'verification');

  if (verification.enabled){  // If verification is enabled don't send welcome. Verification will on welcome on success
    if (_module.pendings[`${member.guild.id}:${member.user.id}`]) {
      _module.pendings[`${member.guild.id}:${member.user.id}`].stop();
      _module.pendings[`${member.guild.id}:${member.user.id}`] = null;
    }
  }
}


// SETTING UP

_module.setup = async (guild) => {
  const verified = await _module.doRoles(guild);
  const channel = await _module.doChannel(guild, verified);
  const message = await _module.doMessage(channel);

  guild.members.fetch(false).then(members => {
    members.forEach(m => {
      m.roles.add(verified);
    });
  });

  return [verified, channel, message];
}


_module.doRoles = async (guild) => {
  const everyone = await guild.roles.fetch(guild.id);
  const verified = await guild.roles.create({
    data: {
      name: '✔️Verified',
      color: 'GREY',
      hoist: false,
      permissions: everyone.permissions,  // Set permissions to what everyone has
      mentionable: false,
    },
    reason: 'Enabling verification'
  });
  
  await everyone.setPermissions(0, 'Enabling verification');  // Set @everyone has no permissions

  return verified;
}

_module.doChannel = async (guild, verified) => {
  const channel = await guild.channels.create('verification', {
    topic: 'Verify yourself as a human before accessing to the server.',
    reason: 'Enabling verification',
    permissionOverwrites: [
      {
        id: Bot.user.id,
        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
        type: 'member'
      },
      {
        id: guild.id,
        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
        deny: ['SEND_MESSAGES', 'ADD_REACTIONS'],
        type: 'role'
      },
      {
        id: verified.id,
        deny: ['VIEW_CHANNEL', 'ADD_REACTIONS', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
        type: 'role'
      }
    ]
  });

  return channel;
}

_module.doMessage = async (channel) => {
  let message = new Discord.MessageEmbed()
    .setTitle('**Verify**')
    .setDescription('Please verify by **reacting :white_check_mark: to this message** before accessing to the server.')
    .setFooter('This protection helps stop spam bots invasions.')

  const msg = await channel.send(message); 
  msg.react('✅');

  return msg;
}

  


// UNSETTING UP
_module.unsetup = async (guild, verified, channel) => {
  await _module.undoRoles(guild, verified);
  await _module.undoChannel(channel);

  return;
}

_module.undoRoles = async (guild, verified) => {
  const everyone = await guild.roles.fetch(guild.id);

  if (verified) {
    await everyone.setPermissions(verified.permissions, 'Disabling verification');  // Set @everyone has normal permissions
    await verified.delete('Disabling verification');
  } else {
    await everyone.setPermissions(103910464, 'Disabling verification');  // Set @everyone has normal permissions
  }

  return;
}

_module.undoChannel = async (channel) => {
  if (channel) {
    await channel.delete('Disabling verification');
  }

  return;
}


_module.Init = () => {
  _module.__addListener(Bot, 'guildMemberAdd', _module.onJoin);
  _module.__addListener(Bot, 'guildMemberRemove', _module.onLeave);
}


module.exports = _module;  // Export module