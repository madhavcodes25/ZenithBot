const discord = require('discord.js');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('ban')
        .setDescription('reason for the ban')
        .addUserOption(option => 
            option.setName('target')
            .setDescription('the member to ban')
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('reason')
            .setDescription('reason for the ban')
            .setRequired(false)
        ),
        
    async execute(client, interaction) {
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');
        
        let member = interaction.guild.members.cache.get(targetUser.id);

        if (!member) {
            return interaction.reply('member not found in the server');
        }

        if (!interaction.member.permissions.has('BanMembers')) {
            return interaction.reply("you don't have the permission");
        }

        if (!interaction.guild.members.me.permissions.has('BanMembers')) {
            return interaction.reply("I don't have the permission");
        }

        if (!member.bannable) {
            return interaction.reply('I cannot ban that member they may have a higher role');
        }

        try {
            await member.ban({ reason: reason });
            
            const embed = new discord.EmbedBuilder()
                .setColor('DarkRed')
                .setTitle('Member Banned')
                .setDescription(`User: ${targetUser.tag}\nID: ${targetUser.id}\nReason: ${reason}`)
                .setFooter({ text: `Banned by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('fail to ban the member');
        }
    }
};