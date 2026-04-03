const discord = require('discord.js');
const User = require('../models/User');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('fish')
        .setDescription('Go fishing! (Requires a Fishing Rod)'),
        
    async execute(client, interaction) {
        await interaction.deferReply();

        try {
            const userProfile = await User.findOne({ userId: interaction.user.id });

            if (!userProfile || !userProfile.inventory.includes('fishing_rod')) {
                return interaction.editReply('❌ You don\'t have a Fishing Rod! Buy one from the `/shop` first.');
            }

            // Fishing logic!
            const catchChance = Math.random();
            let embed = new discord.EmbedBuilder();

            if (catchChance > 0.3) { 
                const fishCoins = Math.floor(Math.random() * 200) + 50;
                userProfile.balance += fishCoins;
                await userProfile.save();

                embed.setColor('Blue')
                     .setTitle('🎣 You caught a fish!')
                     .setDescription(`You sold the fish at the market for **🪙 ${fishCoins} coins**!\nNew Balance: 🪙 ${userProfile.balance}`);
            } else { 
                embed.setColor('Grey')
                     .setTitle('🌊 Not a bite...')
                     .setDescription('You sat by the water for hours but didn\'t catch anything. Try again later!');
            }

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while fishing.');
        }
    }
};