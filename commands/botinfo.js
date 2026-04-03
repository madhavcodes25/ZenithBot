const discord = require('discord.js');
const os = require('os');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Shows technical statistics and information about the bot'),
        
    async execute(client, interaction) {
        const days = Math.floor(client.uptime / 86400000);
        const hours = Math.floor(client.uptime / 3600000) % 24;
        const minutes = Math.floor(client.uptime / 60000) % 60;
        const seconds = Math.floor(client.uptime / 1000) % 60;
        const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        const embed = new discord.EmbedBuilder()
            .setColor(Math.floor(Math.random() * 0xFFFFFF)) 
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTitle('🤖 Bot Statistics')
            .addFields(
                { name: '👨‍💻 Developer', value: 'madhavcodes25', inline: true }, 
                { name: '📊 Server Count', value: `${client.guilds.cache.size} Servers`, inline: true },
                { name: '👥 User Count', value: `${client.users.cache.size} Cached Users`, inline: true },
                { name: '⏱️ Uptime', value: uptimeString, inline: true },
                { name: '💻 Memory Usage', value: `${memoryUsed} MB`, inline: true },
                { name: '🏓 API Latency', value: `${client.ws.ping}ms`, inline: true },
                { name: '⚙️ Node.js', value: process.version, inline: true },
                { name: '📚 Discord.js', value: `v${discord.version}`, inline: true }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};