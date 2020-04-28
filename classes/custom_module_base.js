// Custom Module class

class CustomModuleBase{
  __listeners = [];
  __backups = {};

  __addListener(emitter, event, callback){
    emitter.on(event, callback);
    this.__listeners.push({emitter: emitter, event: event, callback: callback})
  }

  __removeListeners(){
    this.__listeners.forEach(v => {
      v.emitter.off(v.event, v.callback);
    });
  }

  __addBackedUpVar(name, defaultValue){
    if (!this.__backups[name]){
      this.__backups[name] = defaultValue;
    }

    return this.__backups[name]; 
  }

  constructor(name){
    this.Name = name;
  }
}

module.exports = CustomModuleBase;