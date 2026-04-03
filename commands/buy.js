const discord = require('discord.js');
const User = require('../models/User');
const shopItems = require('../utils/items');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buy an item from the shop')
        .addStringOption(option => 
            option.setName('item_id')
            .setDescription('The ID of the item you want to buy (check /shop)')
            .setRequired(true)
        ),
        
    async execute(client, interaction) {
        await interaction.deferReply();
        const itemId = interaction.options.getString('item_id').toLowerCase();

        const itemToBuy = shopItems.find(i => i.id === itemId);
        if (!itemToBuy) {
            return interaction.editReply('❌ That item does not exist! Check `/shop` for valid IDs.');
        }

        try {
            let userProfile = await User.findOne({ userId: interaction.user.id });
            if (!userProfile) userProfile = new User({ userId: interaction.user.id });

            if (userProfile.balance < itemToBuy.price) {
                return interaction.editReply(`❌ You cannot afford this! You need **🪙 ${itemToBuy.price - userProfile.balance}** more coins.`);
            }

            userProfile.balance -= itemToBuy.price;
            userProfile.inventory.push(itemToBuy.id);
            await userProfile.save();

            const embed = new discord.EmbedBuilder()
                .setColor('Green')
                .setTitle('🛍️ Purchase Successful!')
                .setDescription(`You bought a **${itemToBuy.name}** for 🪙 ${itemToBuy.price}.\nYour remaining balance is 🪙 ${userProfile.balance}.`);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred during purchase.');
        }
    }
};