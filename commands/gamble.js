const discord = require('discord.js');
const User = require('../models/User');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('gamble')
        .setDescription('Gamble your coins for a chance to double them!')
        .addIntegerOption(option => option.setName('amount').setDescription('Amount to bet').setRequired(true)),
        
    async execute(client, interaction) {
        await interaction.deferReply();
        const bet = interaction.options.getInteger('amount');

        if (bet <= 0) return interaction.editReply('You must bet more than 0 coins!');

        try {
            let userProfile = await User.findOne({ userId: interaction.user.id });

            if (!userProfile || userProfile.balance < bet) {
                return interaction.editReply(`❌ You don't have enough coins to make that bet. Your balance is **🪙 ${userProfile?.balance || 0}**.`);
            }

            const isWinner = Math.random() >= 0.5;

            if (isWinner) {
                userProfile.balance += bet; 
                await userProfile.save();
                
                const winEmbed = new discord.EmbedBuilder()
                    .setColor('Green')
                    .setTitle('🎰 You Won!')
                    .setDescription(`The coin landed on heads! You won **🪙 ${bet} coins**.\nNew Balance: 🪙 ${userProfile.balance}`);
                return interaction.editReply({ embeds: [winEmbed] });
            } else {
                userProfile.balance -= bet; 
                await userProfile.save();
                
                const loseEmbed = new discord.EmbedBuilder()
                    .setColor('Red')
                    .setTitle('💀 You Lost!')
                    .setDescription(`The coin landed on tails. You lost **🪙 ${bet} coins**.\nNew Balance: 🪙 ${userProfile.balance}`);
                return interaction.editReply({ embeds: [loseEmbed] });
            }

        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while gambling.');
        }
    }
};