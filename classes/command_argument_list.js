// Command Argument List class
// This Class allows you to make a powerful list of expected CommandArgument.
// The best exemple is the following: 
//   You're making a music play command that adds a music to a queue.
//   The user should be able to input a direct link or a music name
//   So you check if the the input is of URL type or you get the name

const CommandArgument = require('./command_argument.js');

class CommandArgumentList{
  Arguments = [];

  async validate(args, position, msg){
    for(let i = 0; i < this.Arguments.length; i++){
      const [valid, newPos] = await this.Arguments[i].validate(args, position, msg)
      if (valid){
        return [valid, newPos];
      }
    }
    return [false];
  }

  async get(args, position, msg){
    for(let i = 0; i < this.Arguments.length; i++){
      const [valid, newPos] = await this.Arguments[i].validate(args, position, msg)
      if (valid){
        return await this.Arguments[i].get(args, position, msg);
      }
    }
    return;
  }

  getTypesNames(){
    let list = [];
    this.Arguments.forEach(v => {
      list.push(v.Type.Name);
    });
    return list;
  }

  getTypeName(){
    return this.getTypesNames().join('/');
  }

  constructor(options, args){
    // Check Null
    if (options == null){throw 'Missing options to create a new CommandArgumentList'}
    if (typeof options == 'string'){options = {name: options}}
    if (options.name == null){throw 'Missing Name option to create a new CommandArgumentList'}
    if (options.optionnal == null){options.optionnal = false}
    //if (options.infinite == null){options.infinite = false}

    // Check Type
    if (typeof options != 'object'){throw 'Wrong type for Options. Expected: Object/String'}
    if (typeof options.name != 'string'){throw 'Wrong option type for Name. Expected: string'}
    if (typeof options.optionnal != 'boolean'){throw 'Wrong option type for Optionnal. Expected: boolean'}
    //if (typeof options.infinite != 'boolean'){throw 'Wrong option type for Infinite. Expected: boolean'}


    // Arguments
    args.forEach(v => {
      if (v instanceof CommandArgument) {
        this.Arguments.push(v);
      } else {
        throw 'Passed Object isn\'t expected. Expected: CommandArgument';
      }
    });

    // Assign properties
    this.Name = options.name;
    this.Optionnal = options.optionnal;
    //this.Infinite = options.infinite;
  }
}

module.exports = CommandArgumentList;