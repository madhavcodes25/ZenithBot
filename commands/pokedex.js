const discord = require('discord.js');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('pokedex')
        .setDescription('Get information of a pokemon!')
        .addStringOption(option => 
            option.setName('pokemon')
            .setDescription('The name of the pokemon to search for')
            .setRequired(true)
        ),
        
    async execute(client, interaction) {
        const pokename = interaction.options.getString('pokemon').toLowerCase().replace(/\s+/g, '-');

        try {
            await interaction.deferReply();

            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokename}`);
            
            if (!response.ok) {
                return interaction.editReply('Couldn\'t find that Pokémon. Please check the spelling!');
            }
            
            const res = await response.json();

            const name = res.name.charAt(0).toUpperCase() + res.name.slice(1);

            const types = res.types.map(t => t.type.name).join(', ');
            const abilities = res.abilities.map(a => a.ability.name).join(', ');
            const stats = res.stats.map(s => `**${s.stat.name.toUpperCase()}**: ${s.base_stat}`).join('\n');
            
            const sprite = res.sprites.other['official-artwork'].front_default || res.sprites.front_default;

            const embed = new discord.EmbedBuilder()
                .setColor(Math.floor(Math.random() * 0xFFFFFF)) 
                .setTitle(`${name} (#${res.id})`)
                .setThumbnail(sprite)
                .addFields(
                    { name: 'Type', value: types || 'Unknown', inline: true },
                    { name: 'Abilities', value: abilities || 'None', inline: true },
                    { name: 'Height / Weight', value: `${res.height / 10}m / ${res.weight / 10}kg`, inline: true },
                    { name: 'Base Stats', value: stats, inline: false }
                )
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error("Pokedex Command Error:", error);
            
            if (interaction.deferred) {
                await interaction.editReply('Oops! An error occurred while fetching data from the PokéAPI.');
            } else {
                await interaction.reply({ content: 'Oops! An error occurred while fetching data from the PokéAPI.', ephemeral: true });
            }
        }
    }
};
   