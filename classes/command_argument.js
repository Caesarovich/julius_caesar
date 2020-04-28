// Argument class
// This class allows you to make powerfull Arguments for your commands.
// You can add any type you want or use the ones integrated.
// 
// ArgumentType data class:
//  - Name (string): The name displayed for help. Ex: "..expected argument of type URL...".
//  - Validate (function): This function should return a boolean of wether the provided data matches the expected Argument.
//  - Get (function): Always called after Validate ! This function should parse the data and return it so it's not needed to do it in the command. Ex:
//      The 'user' ArgumentType parses mention and returns a DiscordUser object.
//     Get also returns a newPos wich is a the pos the command handler should look to for the next arguments, useful for ArgumentTypes that take more than on arg
// 
//  Argument class: 
//  - validate (function): Returns the result of it's ArgumentType's Validate method.
//  - get (function): Returns the result of it's ArgumentType's Get method.
//  - constructor (function) [name, type, optionnal]: 
//    - name (string): The name of the Argument. It's used in help. Ex: "c!help (Command)" | Where Command is the name of the Optionnal Argument.
//    - type (string): The ArgumentType key from 'argumentTypes' of the choosen ArgumentType.
//    - optionnal (boolean): Wether or not this is an optionnal Argument.
//
//
//  [args, position]: these are the arguments passed trough all the chain.
//  - args (Array<string>): This is the array of the primarly parsed 'arguments' by the command handler. It's just the message content splitted by spaces.
//  - position (int): It's the expected position of the argument's data in 'args'.
//
//

const argumentTypes = {
  string: {
    Name: 'Text',
    Validate: async (args, position, ctx) => {
      if (args[position] == null || typeof args[position] != 'string'){return [false]}
      return [true];
    },
    Get: async (args, position, ctx) => {
      return [args[position]];
    }
  },
  longstring: {
    Name: 'Long Text',
    Validate: async (args, position, ctx) => {
      let strings = [];
      for (i = position; i < args.length; i++){
        if (args[i] == null || typeof args[i] != 'string'){break}
        strings.push(args[i]);
      }

      if (strings.length > 0) {
        return [true, position + strings.length];
      } else {
        return [false];
      }    
    },
    Get: async (args, position, ctx) => {
      let strings = [];
      for (i = position; i < args.length; i++){
        if (args[i] == null || typeof args[i] != 'string'){break}
        strings.push(args[i]);
      }
      return [strings.join(' '), position + strings.length];
    }
  },
  integer: {
    Name: 'Integer',
    Validate: async (args, position, ctx) => {
      if (args[position] == null || isNaN(args[position])){return [false]}
      return [true];
    },
    Get: async (args, position, ctx) => {
      return [parseInt(args[position], 10)];
    }
  },
  number: {
    Name: 'Number',
    Validate: async (args, position, ctx) => {
      if (args[position] == null || isNaN(args[position])){return [false]}
      return [true];
    },
    Get: async (args, position, ctx) => {
      return [Number(args[position])];
    }
  },
  url: {
    Name: 'URL',
    Validate: async (args, position, ctx) => {
      if (args[position] == null || !args[position].match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm)){return [false]}
      return [true];
    },
    Get: async (args, position, ctx) => {
      return [args[position]];
    }
  },
  user: {
    Name: 'User',
    Validate: async (args, position, ctx) => {
      if (args[position] == null || !args[position].match(/^<@!?(\d+)>$/)){return [false]}
      return [true];
    },
    Get: async (args, position, ctx) => {
      id = args[position].slice(2, -1);
    
      if (id.startsWith('!')) {
        id = id.slice(1);
      }

      const user = await Bot.users.fetch(id);

      return [user];
    }
  },

  member: {
    Name: 'Member',
    Validate: async (args, position, ctx) => {
      if (args[position] == null || !args[position].match(/^<@!?(\d+)>$/)){return [false]}
      return [true];
    },
    Get: async (args, position, ctx) => {
      id = args[position].slice(2, -1);
    
      if (id.startsWith('!')) {
        id = id.slice(1);
      }

      const member = await ctx.guild.members.fetch(id);

      return [member];
    }
  },

  role: {  // Return role id
    Name: 'Role',
    Validate: async (args, position, ctx) => {
      if (args[position] == null || !args[position].match(/^<@&(\d+)>$/)){return [false]}
      return [true];
    },
    Get: async (args, position, ctx) => {
      const role = await ctx.guild.roles.fetch(args[position].slice(3, -1));

      return [role];
    }
  },
  channel: {
    Name: 'Channel',
    Validate: async (args, position, ctx) => {
      if (args[position] == null || !args[position].match(/^<#(\d+)>$/)){return [false]}
      return [true];
    },
    Get: async (args, position, ctx) => {
      const channel = await ctx.guild.channels.cache.get(args[position].slice(2, -1));
      return [channel];
    }
  },
  guildemoji: {
    Name: 'Guild Emoji',
    Validate: async (args, position, ctx) => {
      if (args[position] == null || !args[position].match(/^<:[A-Za-z0-9]+:[0-9]+>$/)){return [false]}
      return [true];
    },
    Get: async (args, position, ctx) => {
      const id = args[position].match(/:[0-9]+>/)[0].slice(1, -1);
      const guildemoji = await ctx.guild.emojis.resolve(id);
      return [guildemoji];
    }
  },
}


class CommandArgument{
  async validate(args, position, msg){
    return await this.Type.Validate(args, position, msg)
  }

  async get(args, position, msg){
    return {name: this.Name, type: this.Type.Name, value: await this.Type.Get(args, position, msg)}
  }

  getTypeName(){
    return this.Type.Name;
  }

  constructor(name, type, optionnal){
    // Check Null
    if (name == null){throw 'Missing Name option to create a new CommandArgument'}
    if (type == null){throw 'Missing Type option to create a new CommandArgument'} 
    if (optionnal == null){optionnal = false}

    // Check Type
    if (typeof name != 'string'){throw 'Wrong option type for Name. Expected: string'}
    if (typeof type != 'string'){throw 'Wrong option type for Type. Expected: string'}
    if (typeof optionnal != 'boolean'){throw 'Wrong option type for Optionnal. Expected: boolean'}

    if (argumentTypes[type] == null){throw 'Invalid Argument Type. Please refer to the class CommandArgument.'}

    // Assign properties
    this.Name = name;
    this.Type = argumentTypes[type];
    this.Optionnal = optionnal;
  }
}

module.exports = CommandArgument;