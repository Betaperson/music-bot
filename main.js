const {Client , Intents} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const {token} = require('./config.json');
const {Player} = require('discord-player');
const player = new Player(client);

player.on("trackStart", (queue, track) => queue.metadata.channel.send(`🎧 | Now playing **${track.title}**! | 🎧`))

client.once('ready', () => {
	console.log(`${client.user.tag} is logged in`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    const command = interaction.commandName;
    
    switch (command){
      case 'ping':
        const sent = await interaction.reply({ content: 'Ponging...', fetchReply: true});
        interaction.editReply(`ur mom's number: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
      case 'play':
        if (!interaction.member.voice.channel) 
        return await interaction.reply({content:'You are not in a VC!'});
        
        if (interaction.guild.me.voice.channelId 
          && interaction.member.voice.channelId 
          !== interaction.guild.me.voice.channelId) 
        return await interaction.reply({content: 'I do not see thy in VC.'});
        
        const query = interaction.options.get('query').value;

        const queue = player.createQueue(interaction.guild, {
          metadata: {
            channel: interaction.channel
          }
        });
        
        try {
          if (!queue.connection) await queue.connect(interaction.member.voice.channel); 
        } catch {
          queue.destory();
          return await interaction.reply({content: 'Something went wrong....'});
        }

        await interaction.deferReply();
        const track = await player.search(query, {
          requestedBy: interaction.user
        }).then(x => x.tracks[0]);

        if (!track) return await interaction.followUp({content: `🤔 | The track, **${query}**, cannot be found! | 🤔`});

        queue.play(track);

        return await interaction.followUp({content: `Loading the track: ${track.title}.`})
    }
  });

client.login(token);
