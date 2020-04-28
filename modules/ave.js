// Ave module

const CustomModuleBase = require('../classes/custom_module_base.js');

var _module = new CustomModuleBase('Ave');

_module.onMessage = (msg) => {
  try {
    if (msg.content.toLowerCase().split(' ')[0] == 'ave') {
      msg.reply('**Ave ✋**')
    }
  } catch (err) {
    console.log('[Module Error Ave]', err);
  }
}


_module.Init = () => {
  _module.__addListener(Bot, 'message', _module.onMessage);
}

module.exports = _module;  // Export module