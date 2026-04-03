const discord = require('discord.js');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong and shows the bot\'s latency!'),
        
    async execute(client, interaction) {
        const sentMessage = await interaction.reply({ content: 'Pinging...', fetchReply: true });

        const roundtripLatency = sentMessage.createdTimestamp - interaction.createdTimestamp;

        const apiLatency = client.ws.ping;

        const embed = new discord.EmbedBuilder()
            .setColor(Math.floor(Math.random() * 0xFFFFFF)) 
            .setTitle('Pong! 🏓')
            .addFields(
                { name: 'Bot Latency', value: `\`${roundtripLatency}ms\``, inline: true },
                { name: 'API Latency', value: `\`${apiLatency}ms\``, inline: true }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.editReply({ content: null, embeds: [embed] });
    }
};