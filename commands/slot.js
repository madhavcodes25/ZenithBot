const discord = require('discord.js');
const User = require('../models/User');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('slotmachine')
        .setDescription('Test your luck at the slots!')
        .addIntegerOption(option => 
            option.setName('bet')
            .setDescription('Amount of coins to bet')
            .setRequired(true)
        ),
        
    async execute(client, interaction) {
        await interaction.deferReply();
        const bet = interaction.options.getInteger('bet');

        if (bet <= 0) return interaction.editReply('You must bet at least 1 coin!');

        try {
            let userProfile = await User.findOne({ userId: interaction.user.id });

            if (!userProfile || userProfile.balance < bet) {
                return interaction.editReply(`❌ You don't have enough coins! Your balance is **🪙 ${userProfile?.balance || 0}**.`);
            }

            const symbols = ['🍒', '🍋', '🍇', '🔔', '💎'];
            
            const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
            const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
            const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

            let multiplier = 0;
            let resultText = '';
            let embedColor = 'Red';

            if (slot1 === slot2 && slot2 === slot3) {

                multiplier = slot1 === '💎' ? 10 : 5; 
                resultText = '🎉 **JACKPOT!!!** 🎉';
                embedColor = 'Gold';
            } else {
                multiplier = 0;
                resultText = '💀 **You lost.**';
            }

            const winnings = Math.floor(bet * multiplier);
            userProfile.balance = (userProfile.balance - bet) + winnings;
            await userProfile.save();

            const embed = new discord.EmbedBuilder()
                .setColor(embedColor)
                .setTitle('🎰 Slot Machine 🎰')
                .setDescription(`
**[ ${slot1} | ${slot2} | ${slot3} ]**

${resultText}
**Bet:** 🪙 ${bet}
**Won:** 🪙 ${winnings}
**New Balance:** 🪙 ${userProfile.balance}
                `);

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while spinning the slots.');
        }
    }
};