// Command class

class Command{
  getCmds(){  // Returns an array of the cmd + aliases
    let _cmds = [this.cmd];
    Array.prototype.push.apply(_cmds, this.aliases);
    return _cmds;
  }

  getMissingPermissions(member){
    let _Missing = [];
    this.permissions.forEach((v) => {
      if (!member.hasPermission(v)) {_Missing.push(v)}
    });
    return _Missing.length > 0 ? _Missing : null;  // Return null if there is no permission missing
  }

  getMissingClientPermissions(member){
    let _Missing = [];
    this.clientPermissions.forEach((v) => {
      if (!member.hasPermission(v)) {_Missing.push(v)}
    });
    return _Missing.length > 0 ? _Missing : null;  // Return null if there is no permission missing
  }

  async getMissingArguments(args, msg){
    if (this.arguments.length == 0){return null;}

    for (let i = 0, expectedPos = 0; i < this.arguments.length; i++, expectedPos++){
      const optionnal = this.arguments[i].Optionnal;
      var [valid, newPos] = await this.arguments[i].validate(args, expectedPos, msg);

      if (!optionnal && !args[expectedPos]) {
        return `❓ Missing required argument **${this.arguments[i].Name}** of type: ${this.arguments[i].getTypeName()}.`;
      } else if (!optionnal && !valid) {
        return `❓ Invalid required argument **${this.arguments[i].Name}** type: ${this.arguments[i].getTypeName()}.`;
      } else if (optionnal && args[expectedPos] != null && !valid) {
        return `❓ Invalid optionnal argument **${this.arguments[i].Name}** type: ${this.arguments[i].getTypeName()}.`;
      } else {
        expectedPos = newPos || expectedPos;
        continue;
      }
    }
    return null;
  }

  async validate(args, msg){
    if (this.owner && msg.member.user !== msg.client.owner){return ['❌ **You\'re not allowed to do that. This command is reserved to my owner.**', 'Don\'t try to use this command.']}
    if (this.getMissingClientPermissions(msg.me)){return [`🚫 **I am missing the following permissions: ${this.getMissingClientPermissions(msg.me).join(', ')}.**`, 'Please contact an administrator.']}
    if (this.getMissingPermissions(msg.member)){return [`⛔ **You are missing the following permissions: ${this.getMissingPermissions(msg.member).join(', ')}.**`,'This command is reserved to members having these permissions.']}

    const missingsArgument = await this.getMissingArguments(args, msg);
    if (missingsArgument){return [missingsArgument, 'Try reading help.']}
    
    return true;
  }

  async getArgmuments(args, msg){
    let finalArgs = [];
    for (let i = 0, expectedPos = 0; i < this.arguments.length; i++, expectedPos++){
      const validate = await this.arguments[i].validate(args, expectedPos, msg);
      if (!validate[0]){continue}
      const Argument = await this.arguments[i].get(args, expectedPos, msg);
      finalArgs.push({name: Argument.name, type: Argument.type, value: Argument.value[0]});
      expectedPos = Argument.value[1] || expectedPos;
    }

    return finalArgs;
  }

  

  constructor(options){
    for (let [k, v] of Object.entries(options)) {
      this[k] = v;
    }
  }
}


module.exports = Command;