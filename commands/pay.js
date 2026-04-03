const discord = require('discord.js');
const User = require('../models/User');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('pay')
        .setDescription('Give some of your coins to another user')
        .addUserOption(option => option.setName('target').setDescription('The user to pay').setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of coins to give').setRequired(true)),
        
    async execute(client, interaction) {
        await interaction.deferReply();
        
        const targetUser = interaction.options.getUser('target');
        const amount = interaction.options.getInteger('amount');

        if (amount <= 0) return interaction.editReply('You must pay an amount greater than 0!');
        if (targetUser.id === interaction.user.id) return interaction.editReply('You cannot pay yourself!');
        if (targetUser.bot) return interaction.editReply('You cannot pay a bot!');

        try {
            let sender = await User.findOne({ userId: interaction.user.id });
            let receiver = await User.findOne({ userId: targetUser.id });

            if (!sender || sender.balance < amount) {
                return interaction.editReply(`❌ You don't have enough coins! You only have **🪙 ${sender?.balance || 0}**.`);
            }
            if (!receiver) receiver = new User({ userId: targetUser.id }); 


            sender.balance -= amount;
            receiver.balance += amount;


            await sender.save();
            await receiver.save();

            const embed = new discord.EmbedBuilder()
                .setColor('Green')
                .setTitle('💸 Payment Successful')
                .setDescription(`You successfully sent **🪙 ${amount} coins** to ${targetUser}.\n\nYour new balance: 🪙 ${sender.balance}`);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred during the transaction.');
        }
    }
};