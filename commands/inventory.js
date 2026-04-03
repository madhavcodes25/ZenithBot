const discord = require('discord.js');
const User = require('../models/User');
const shopItems = require('../utils/items');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Check your purchased items'),
        
    async execute(client, interaction) {
        await interaction.deferReply();

        try {
            const userProfile = await User.findOne({ userId: interaction.user.id });

            if (!userProfile || userProfile.inventory.length === 0) {
                return interaction.editReply('🎒 Your inventory is completely empty. Go to the `/shop`!');
            }
            const itemCounts = {};
            userProfile.inventory.forEach(itemId => {
                itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
            });

            let inventoryString = '';
            for (const [id, count] of Object.entries(itemCounts)) {
                const itemData = shopItems.find(i => i.id === id);
                if (itemData) {
                    inventoryString += `${itemData.name} **x${count}**\n`;
                }
            }

            const embed = new discord.EmbedBuilder()
                .setColor('Orange')
                .setAuthor({ name: `${interaction.user.username}'s Inventory`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(inventoryString);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while fetching your inventory.');
        }
    }
};