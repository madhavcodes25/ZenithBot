const discord = require('discord.js');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Shows information about a specific user or yourself')
        .addUserOption(option => 
            option.setName('target')
            .setDescription('The user to get information about')
            .setRequired(false)
        ),
        
    async execute(client, interaction) {

        const targetMember = interaction.options.getMember('target') || interaction.member;
        const targetUser = targetMember.user;

        const roles = targetMember.roles.cache
            .filter(role => role.name !== '@everyone')
            .map(role => `<@&${role.id}>`)
            .join(', ') || 'None';


        const joinedAt = Math.floor(targetMember.joinedTimestamp / 1000);
        const createdAt = Math.floor(targetUser.createdTimestamp / 1000);

        const embed = new discord.EmbedBuilder()

            .setColor(targetMember.displayHexColor !== '#000000' ? targetMember.displayHexColor : 'Blue')
            .setAuthor({ name: targetUser.tag, iconURL: targetUser.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields(
                { name: 'ID', value: targetUser.id, inline: true },
                { name: 'Nickname', value: targetMember.nickname || 'None', inline: true },
                { name: 'Bot?', value: targetUser.bot ? 'Yes' : 'No', inline: true },
                { name: 'Account Created', value: `<t:${createdAt}:F>\n(<t:${createdAt}:R>)`, inline: false },
                { name: 'Joined Server', value: `<t:${joinedAt}:F>\n(<t:${joinedAt}:R>)`, inline: false },
                { name: `Roles [${targetMember.roles.cache.size - 1}]`, value: roles, inline: false }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};