// Music Module

const CustomModuleBase = require('../classes/custom_module_base.js');
const youtubedl = require('youtube-dl');

var _module = new CustomModuleBase('Music');

_module.guilds = {};
/*
guildID: {
  queue: [
    {
      member: GuildMember,
      title: 'Video Title',
      thumbnail: '.../thumbnail.jpg,
      webpage: 'https://youtube.com/v=Zjka5859',
      duration: {
        raw: '1526',
        hms: '1:05:23'
      },
      videoFileURL: info.url
    },
  ],
  playing: false,
  textChannel: TextChannel
}
*/

_module.initGuild = (guild) => {
  if (_module.guilds[guild.id] == null){
    _module.guilds[guild.id] = {
      queue: [],
      playing: false,
      textChannel: null,
      leaveTimer: null
    }
  }
}

_module.getGuild = (guild) => {
  if (_module.guilds[guild.id] == null) {_module.initGuild(guild)}
  return _module.guilds[guild.id];
}


_module.leaveMember = async (member) => {
  if (!member.guild.voice.channel) {
    return '❕ I am not in a voice channel !';
  } else if (member.guild.voice.channel !== member.voice.channel) {
    return '❌ You are not in the same voice channel as me !';
  } else {
    _module.leave(member.guild);
    return null;
  }  
}

_module.leave = async (guild) => {
  if (guild.voice.connection && guild.voice.connection.dispatcher) {
    guild.voice.connection.dispatcher.end();
  }
  const vcName = guild.voice.channel.name;

  await guild.voice.channel.leave();

  if (_module.getGuild(guild).textChannel) {
    _module.getGuild(guild).textChannel.send( `❕ Left channel **${vcName}**`)
  }
}

_module.join = async (member, textChannel, shouldAdvertSucces) => {
  if (member.voice.channel && member.guild.voice && member.voice.channel === member.guild.voice.channel) {
    if (shouldAdvertSucces){
      textChannel.send('❕ I am already in your voice channel !');
    }
    return true;
  } else if (!member.voice.channel) {
    textChannel.send('❌ You are not in a voice channel !');
    return false;
  } else {
    const voiceConnection = await member.voice.channel.join();
    textChannel.send(`🔉 Joined **${voiceConnection.channel.name}**`);
    voiceConnection.voice.setSelfDeaf(true);  // Make the bot deaf
    return true;
  }  
}

_module.setTextChannel = (textChannel) => {
  _module.getGuild(textChannel.guild).textChannel = textChannel;
}

_module.addSong = async (member, textChannel, url, playAfter) => {
  const ytRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/g
  if (url.match(ytRegex)){
    _module.setTextChannel(textChannel);

    youtubedl.getInfo(url, [], function(err, info) {
      if (err) {
        console.log('[YoutubeDL Error] ', err);
        textChannel.send('📡 Sadly, an error occured while trying to fetch this video from youtube !');
        return;
      }

    
      if (info._duration_raw < 7200) {
        _module.getGuild(member.guild).queue.push({
          member: member,
          title: info.title,
          thumbnail: info.thumbnail,
          webpage: info.webpage_url,
          duration: {
            raw: info._duration_raw,
            hms: info._duration_hms
          },
          videoFileURL: info.url,
          url: url
        });
        textChannel.send(`🎵 Added **${info.title}** to queue !`);
        if (playAfter) {
          _module.playNextSong(member.guild);
        }
        if (_module.getGuild(member.guild).leaveTimer) {
          clearTimeout(_module.getGuild(member.guild).leaveTimer);
          _module.getGuild(member.guild).leaveTimer = null;
        }
      } else {
        textChannel.send(`⏳ This song is too long (2 Hours max) !`);
      }
    });
  } else {
    textChannel.send('Not a valid Youtube URL');
  }
}

_module.skip = async (guild, textChannel) => {
  if (guild.voice.connection){
    if (_module.getGuild(guild).playing){
      _module.getGuild(guild).textChannel = textChannel;
      textChannel.send(`Skipped **${_module.getGuild(guild).currentSong.title}**`);
      guild.voice.connection.dispatcher.end();
    } else {
      textChannel.send(`I'm not playing any music.`);
    }
  }
}


_module.playNextSong = async (guild) => {
  if (guild.voice.connection != null){
    if (_module.getGuild(guild).queue.length >= 1) {
      const currentSong = _module.getGuild(guild).queue.shift();
      _module.getGuild(guild).currentSong = currentSong;

      _module.getGuild(guild).playing = true;
      

      var message = new Discord.MessageEmbed()
        .setAuthor('Youtube')
        .setTitle(`🎵 Now playing: ${currentSong.title}`)
        .setColor('#ff0000')
        .setThumbnail(currentSong.thumbnail)
        .setURL(currentSong.webpage)
        .addField('Song duration:', currentSong.duration.hms, true)
        .addField('Songs in queue:', _module.getGuild(guild).queue.length, true)

      _module.getGuild(guild).textChannel.send(message);

      guild.voice.connection.play(currentSong.videoFileURL).on("finish", () => {
        _module.getGuild(guild).playing = false;
        _module.getGuild(guild).currentSong = null;
        _module.playNextSong(guild);
      }).on("error", error => {
        console.error('[Music Error] ', error);
        _module.getGuild(guild).playing = false;
        _module.getGuild(guild).currentSong = null;
      }).setVolume(Modules.GuildSettings.getSetting(guild.id, 'volume') / 100);
    } else {
      _module.getGuild(guild).queue.shift();  // No more song to play
      _module.getGuild(guild).textChannel.send('No more songs.');
      _module.getGuild(guild).leaveTimer = setTimeout(() => {
        _module.leave(guild);
      }, 180 * 1000);
      
    }
  }
}


_module.Init = () => {
  _module.guilds = _module.__addBackedUpVar('guilds', {});
  _module.__addListener(Bot, 'channelDisconnect', (oldState) => {
    if (oldState.member === oldState.guild.me) {
      _module.getGuild(oldState.guild).playing = false;
      _module.getGuild(oldState.guild).currentSong = null;
    }
  });
}

module.exports = _module;  // Export module
