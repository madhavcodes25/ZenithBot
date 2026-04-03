const discord = require('discord.js');
const User = require('../models/User');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('work')
        .setDescription('Work to earn some coins! (1 hour cooldown)'),
        
    async execute(client, interaction) {
        await interaction.deferReply();

        try {
            let userProfile = await User.findOne({ userId: interaction.user.id });
            if (!userProfile) userProfile = new User({ userId: interaction.user.id });

            const now = new Date();

            if (userProfile.lastWorked) {
                const timeDiff = now.getTime() - userProfile.lastWorked.getTime();
                const minutesSinceLastWork = timeDiff / (1000 * 60);

                if (minutesSinceLastWork < 60) {
                    const minutesLeft = Math.ceil(60 - minutesSinceLastWork);
                    return interaction.editReply(`⏳ You are too tired to work! Come back in **${minutesLeft} minutes**.`);
                }
            }

            const earnedCoins = Math.floor(Math.random() * 151) + 50; 
            
            const jobs = ['mowed a lawn', 'fixed a computer bug', 'flipped burgers', 'invested in stocks', 'walked a dog'];
            const randomJob = jobs[Math.floor(Math.random() * jobs.length)];

            userProfile.balance += earnedCoins;
            userProfile.lastWorked = now;
            await userProfile.save();

            const embed = new discord.EmbedBuilder()
                .setColor('Blue')
                .setTitle('💼 Hard Work Pays Off!')
                .setDescription(`You ${randomJob} and earned **🪙 ${earnedCoins} coins**!\n\n**New Balance:** 🪙 ${userProfile.balance}`);

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while trying to work.');
        }
    }
};