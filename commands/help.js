const discord = require('discord.js');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all available commands for the bot'),
        
    async execute(client, interaction) {
        const embed = new discord.EmbedBuilder()
            .setColor(Math.floor(Math.random() * 0xFFFFFF)) 
            .setTitle('🤖 Bot Commands List')
            .setDescription('Here are all the commands currently available on this bot. Simply type `/` to use them!')
            .addFields(
                { 
                    name: '🛡️ Moderation', 
                    value: '`/kick` - Kicks a member from the server.\n`/ban` - Bans a member from the server.', 
                    inline: false 
                },
                { 
                    name: '✨ Fun & AI', 
                    value: '`/askai` - Ask the AI a question.\n`/pokedex` - Get base stats and details of any Pokémon.\n`/jail` - Send someone to Discord prison!', 
                    inline: false 
                },
                { 
                    name: '💰 Economy & RPG', 
                    value: '`/balance` - Check your coin balance.\n`/daily` - Claim your daily free coins.\n`/pay` - Give coins to another user.\n`/work` - Grind for coins (1h cooldown).\n`/gamble` - Coinflip to double your bet.\n`/shop` - View the item catalog.\n`/buy` - Purchase an item using its ID.\n`/inventory` - Check your purchased items.\n`/fish` - Go fishing (Requires Fishing Rod).\n`/slotmachine` - Test your luck at the slots.', 
                    inline: false 
                },
                { 
                    name: 'ℹ️ Information & Utility', 
                    value: '`/userinfo` - Shows info about yourself or another user.\n`/botinfo` - Displays technical bot statistics.\n`/ping` - Check the bot\'s current latency.\n`/help` - Displays this help menu.', 
                    inline: false 
                }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};