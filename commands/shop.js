const discord = require('discord.js');
const shopItems = require('../utils/items');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('shop')
        .setDescription('View the item shop!'),
        
    async execute(client, interaction) {
        const embed = new discord.EmbedBuilder()
            .setColor('Blurple')
            .setTitle('🛒 Welcome to the Shop!')
            .setDescription('Use `/buy <item_id>` to purchase an item.');

        shopItems.forEach(item => {
            embed.addFields({ 
                name: `${item.name} — 🪙 ${item.price}`, 
                value: `*ID: \`${item.id}\`*\n${item.description}`, 
                inline: false 
            });
        });

        await interaction.reply({ embeds: [embed] });
    }
};