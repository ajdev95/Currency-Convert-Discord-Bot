const { Client, Intents, Collection, MessageEmebd ,MessageButton,MessageActionRow,Message, MessageAttachment, MessageEmbed  } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.MESSAGE_CONTENT,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.DIRECT_MESSAGES
    ],
    partials: ["CHANNEL", "MESSAGE", "REACTION"]
});
const prefix = "!"
const Canvas = require('canvas');
const fetch = require("node-fetch");
const { EmbedBuilder } = require('@discordjs/builders');

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
  const attachment = new MessageAttachment(canvas.toBuffer(), 'downtown.png');
  return { results: results.join('\n'), attachment };
}



// client.on('ready', async() => {
//     let servers = await client.guilds.cache.size
//     let servercount = await client.guilds.cache.reduce((a,b) => a+b.memberCount, 0)
  
//     const activites = [
//         `servers ${servers}`,
//         `members ${servercount}`
//       ]
    
//       setInterval(()=>{
//           const status = activites[Math.floor(Math.random()*activites.length)]
//           client.user.setPresence({activities: [{name: `${status}`, type: 'WATCHING'}]})
//         }, 5000)
//       })
      
      
      client.on('ready', async() => {
        
        setInterval(()=>{
          client.user.setPresence({activities: [{name: `${prefix}help`, type: 'PLAYING'}]})
        }, 5000)
      })
      
      

      
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
          message.channel.send({ content:`**تحويل \`${number}$\` ل العملات الأتية:\n\n\`\`\`fix\n${results}\`\`\`**`, files: [attachment]});
        }
      });
      


      // Info Commands
      
      const copyright = ["Unity Bots"]

      client.on('messageCreate', message => {
        if(message.content.startsWith(prefix + "help")){
          const row1 = new MessageActionRow()
          .addComponents(
            new MessageButton()
            .setLabel('❔')
            .setCustomId('who')
            .setStyle('SECONDARY')
            )
            
            let Embed = new MessageEmbed()
            .setAuthor({ name: `${copyright}`, url: `https://discord.gg/utb`, iconURL: message.author.avatarURL({ dynamic: true, size: 1024, format: 'png' })})
            .setTitle('Here is my help command')
            .setDescription(`**PUBLIC: [ 4 ]**\n\`convert\` | \`ping\` | \`uptime\` | \`help\``)
            .setColor('BLURPLE')
            .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
            message.channel.send({embeds: [Embed], components: [row1]})
          }
        })



        
        
        
    client.on('messageCreate', message => {
    if(message.content.startsWith(prefix + "uptime")){
      let totalSeconds = (client.uptime / 1000);
      let days = Math.floor(totalSeconds / 86400);
      totalSeconds %= 86400;
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = Math.floor(totalSeconds % 60);
            let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;      
      
      let Embed = new MessageEmbed()
      .setDescription(`My uptime is: \n\`\`\`fix\n${uptime}\`\`\``)
      .setColor('BLURPLE')
    message.channel.send({embeds: [Embed]})
  }
})





client.on('messageCreate', message => {
  if(message.content.startsWith(prefix + "ping")){
    let Embed = new MessageEmbed()
    .setDescription(`Discord API ping: \`${client.ws.ping}\``)
    .setColor('BLURPLE')
  message.channel.send({embeds: [Embed]})
}
})






client.on("interactionCreate", (Interaction, message) => {
  if (!Interaction.isButton()) return;
  if (Interaction.customId === 'who') {
    Interaction.reply({content: `**مرحبا!\n\هذا البوت تمت صناعته من فريق [Unity Bots](https://discord.gg/utb) الذي قامة بصناعة بوتات أخرى!\nانعجبت من قدرات هذا البوت؟ يمكنك شراء نسخة منه بأرخص الاسعار!\n\nSupport:** [discord.gg/utb](https://discord.gg/utb)`, ephemeral: true})
  }
})
    

    
client.login(process.env.token)
