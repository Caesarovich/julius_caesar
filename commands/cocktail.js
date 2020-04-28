// Cocktail Command

const Command = require('../classes/command.js')
const CommandArgument = require('../classes/command_argument.js')

const https = require('https');

function getRandomCocktail(callback){  // Thanks to https://www.thecocktaildb.com/api.php
  https.get('https://www.thecocktaildb.com/api/json/v1/1/random.php', (res) => {
    var fullData = '';
    res.on('data', (data) => {
      fullData = fullData + data;
    })
    res.on('end', () => {
      var d = JSON.parse(fullData) ; // Converting from JSON
      callback(d.drinks[0]);
    })
  });
}


function getIngredientsList(cocktail){
  let ingredients = [];

  if (cocktail.strIngredient1){ingredients.push({Name: cocktail.strIngredient1, Measure: cocktail.strMeasure1})}
  if (cocktail.strIngredient2){ingredients.push({Name: cocktail.strIngredient2, Measure: cocktail.strMeasure2})}
  if (cocktail.strIngredient3){ingredients.push({Name: cocktail.strIngredient3, Measure: cocktail.strMeasure3})}
  if (cocktail.strIngredient4){ingredients.push({Name: cocktail.strIngredient4, Measure: cocktail.strMeasure4})}
  if (cocktail.strIngredient5){ingredients.push({Name: cocktail.strIngredient5, Measure: cocktail.strMeasure5})}
  if (cocktail.strIngredient6){ingredients.push({Name: cocktail.strIngredient6, Measure: cocktail.strMeasure6})}
  if (cocktail.strIngredient7){ingredients.push({Name: cocktail.strIngredient7, Measure: cocktail.strMeasure7})}
  if (cocktail.strIngredient8){ingredients.push({Name: cocktail.strIngredient8, Measure: cocktail.strMeasure8})}
  if (cocktail.strIngredient9){ingredients.push({Name: cocktail.strIngredient9, Measure: cocktail.strMeasure9})}
  if (cocktail.strIngredient10){ingredients.push({Name: cocktail.strIngredient10, Measure: cocktail.strMeasure10})}
  if (cocktail.strIngredient11){ingredients.push({Name: cocktail.strIngredient11, Measure: cocktail.strMeasure11})}
  if (cocktail.strIngredient12){ingredients.push({Name: cocktail.strIngredient12, Measure: cocktail.strMeasure12})}
  if (cocktail.strIngredient13){ingredients.push({Name: cocktail.strIngredient13, Measure: cocktail.strMeasure13})}
  if (cocktail.strIngredient14){ingredients.push({Name: cocktail.strIngredient14, Measure: cocktail.strMeasure14})}
  if (cocktail.strIngredient15){ingredients.push({Name: cocktail.strIngredient15, Measure: cocktail.strMeasure15})}


  return ingredients;
}


const command = {
  name: 'Cocktail',  // The command's name
  description: 'Get a random cocktail recipe.',  // What the command does
  category: 'Fun', // In wich category the command is (Category must exist)
  cmd: 'cocktail',  // The actual command (Must be lowercase)
  aliases: [], // A list of aliases
  owner: false, // Is reserved to bot Owner
  permissions: [], // Discord permissions required for the user
  clientPermissions: [], // Discord permissions required for this command 
  arguments: [], // Arguments that can or must be provided

  func: async (msg, args) => {  // The function executed on call
    getRandomCocktail((cocktail) => {
      let message = new Discord.MessageEmbed()
        .setTitle(`**${cocktail.strDrink}**`)
        .setDescription(`${cocktail.strInstructions}\n\n__Ingredients:__`)
        .setAuthor(cocktail.strCategory)
        .setColor('#ffa724')
        .setThumbnail(cocktail.strDrinkThumb)
        .setFooter(`Glass: ${cocktail.strGlass}`)
      
        getIngredientsList(cocktail).forEach((ingredient) => {
          message.addField(ingredient.Measure, ingredient.Name)
        })

      msg.channel.send(message);
    });
  }
}

module.exports = new Command(command);  // Export command