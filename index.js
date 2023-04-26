const { Client, Intents, Collection, MessageEmebd, MessageButton, MessageActionRow, Message, MessageAttachment, MessageEmbed  } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.MESSAGE_CONTENT,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.DIRECT_MESSAGES
    ]
});
const prefix = "!"
const Canvas = require('canvas');
const fetch = require("node-fetch");


async function getExchangeRates(base) {
  const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
  const data = await response.json();
  return data.rates;
}
console.log(`Bot is ready`)

async function convertToCurrenciesImage(number, base) {
  const canvas = Canvas.createCanvas(600, 400);
  const context = canvas.getContext('2d');
  context.font = '30px Arial';
  const rates = await getExchangeRates(base);
  const currencies = ['SAR', 'OMR', 'QAR', 'AED'];
  const results = currencies.map((currency, index) => {
    const price = number * rates[currency];
    context.fillText(`${currency}: ${price.toFixed(2)}`, 50, 50 + 50 * index);
    return `${currency}: ${price.toFixed(2)}`;
  });
  const attachment = new MessageAttachment(canvas.toBuffer(), 'currency.png');
  return { results: results.join('\n'), attachment };
}
      

      
      client.on('messageCreate', async (message) => {
        if (message.content.startsWith(prefix + 'convert')) {
          
          const args = message.content.split(' ');
          const number = parseFloat(args[1]);
          const base = args[2] || 'USD';
          if (isNaN(number)) {  
            const ErrMsg = new MessageEmbed()
            .setDescription(`You need to add a number to see it's currency exchange\n\nExample: \`${prefix}convert 10\` [10 USD]`)
            .setColor('RED')
            message.channel.send({embds: [ErrMsg]});
            return;
          }
          const ErrMsg = new MessageEmbed()
            .setDescription(`You need to add a number to see it's currency exchange\n\nExample: \`${prefix}convert 10\` [10 USD]`)
            .setColor('RED')
          if (!number) return message.channel.send({embeds: [ErrMsg]})
          const { results, attachment } = await convertToCurrenciesImage(number, base);
          message.channel.send({ content:`**Currency Amount \`${number}$\` Converted to:\n\n\`\`\`fix\n${results}\`\`\`**`, files: [attachment]});
        }
      });
      
    

client.login("yourbottoken")
