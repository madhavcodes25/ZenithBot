const discord = require('discord.js');
const User = require('../models/User');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your daily free coins!'),
        
    async execute(client, interaction) {
        await interaction.deferReply();

        try {

            let userProfile = await User.findOne({ userId: interaction.user.id });
            if (!userProfile) {
                userProfile = new User({ userId: interaction.user.id });
            }

            const now = new Date();
            
            if (userProfile.lastDaily) {
                const timeDiff = now.getTime() - userProfile.lastDaily.getTime();
                const hoursSinceLastClaim = timeDiff / (1000 * 3600);

                if (hoursSinceLastClaim < 24) {
                    const hoursLeft = (24 - hoursSinceLastClaim).toFixed(1);
                    return interaction.editReply(`⏳ You have already claimed your daily reward! Come back in **${hoursLeft} hours**.`);
                }
            }

            const dailyAmount = 500;
            userProfile.balance += dailyAmount;
            userProfile.lastDaily = now;
            await userProfile.save();

            const embed = new discord.EmbedBuilder()
                .setColor('Green')
                .setTitle('🎉 Daily Reward Claimed!')
                .setDescription(`You received **🪙 ${dailyAmount} coins**!\n\n**New Balance:** 🪙 ${userProfile.balance}`)
                .setFooter({ text: `Come back tomorrow for more!` });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error("Database Error:", error);
            await interaction.editReply('There was an error accessing the database.');
        }
    }
};