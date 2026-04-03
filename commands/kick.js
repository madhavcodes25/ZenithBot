const discord = require('discord.js');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('kick')
        .setDescription('kicks a member from the server')
        .addUserOption(option => 
            option.setName('target')
            .setDescription('the member to kick')
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('reason')
            .setDescription('reason for kicking the member')
            .setRequired(false)
        ),
        
    async execute(client, interaction) {
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');
        
        let member = interaction.guild.members.cache.get(targetUser.id);

        if (!member) {
            return interaction.reply('member not found in the server');
        }

        if (!interaction.member.permissions.has('KickMembers')) {
            return interaction.reply("you don't have the permission");
        }

        if (!interaction.guild.members.me.permissions.has('KickMembers')) {
            return interaction.reply("I don't have the permission");
        }

        if (!member.kickable) {
            return interaction.reply('I cannot kick that member they may have a higher role');
        }

        try {
            await member.kick(reason);
            
            const embed = new discord.EmbedBuilder()
                .setColor('Green')
                .setTitle('member kicked')
                .setDescription(`User: ${targetUser.tag}\nID: ${targetUser.id}\nReason: ${reason}`)
                .setFooter({ text: `Kicked by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('failed to kick member');
        }
    }
};