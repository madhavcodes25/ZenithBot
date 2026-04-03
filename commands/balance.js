const discord = require('discord.js');
const User = require('../models/User'); 

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your coin balance or another user\'s balance')
        .addUserOption(option => 
            option.setName('target')
            .setDescription('The user to check')
            .setRequired(false)
        ),
        
    async execute(client, interaction) {
        await interaction.deferReply();

        const targetUser = interaction.options.getUser('target') || interaction.user;

        try {

            let userProfile = await User.findOne({ userId: targetUser.id });

            if (!userProfile) {
                userProfile = new User({ userId: targetUser.id });
                await userProfile.save();
            }

            const embed = new discord.EmbedBuilder()
                .setColor('Gold')
                .setAuthor({ name: `${targetUser.username}'s Wallet`, iconURL: targetUser.displayAvatarURL() })
                .setDescription(`**Balance:** 🪙 ${userProfile.balance} coins`)
                .setFooter({ text: 'Economy System' });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error("Database Error:", error);
            await interaction.editReply('There was an error accessing the database.');
        }
    }
};