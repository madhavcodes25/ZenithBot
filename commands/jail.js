const discord = require('discord.js');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('jail')
        .setDescription('Send someone to jail!')
        .addUserOption(option => 
            option.setName('target')
            .setDescription('The user to lock up')
            .setRequired(true)
        ),
        
    async execute(client, interaction) {
        await interaction.deferReply();

        const targetUser = interaction.options.getUser('target');
        const avatarUrl = targetUser.displayAvatarURL({ extension: 'png', size: 512 });

        try {
            const apiUrl = `https://some-random-api.com/canvas/overlay/jail?avatar=${avatarUrl}`;
            const attachment = new discord.AttachmentBuilder(apiUrl, { name: 'busted.png' });

            const embed = new discord.EmbedBuilder()
                .setColor('DarkButNotBlack')
                .setTitle('👮 BUSTED!')
                .setDescription(`Uh oh! ${targetUser} has been locked up in Discord prison!`)
                .setImage('attachment://busted.png')
                .setFooter({ text: `Sentenced by ${interaction.user.tag}` });

            await interaction.editReply({ embeds: [embed], files: [attachment] });

        } catch (error) {
            console.error(error);
            await interaction.editReply('Oops! The police let them go. (Image generation failed)');
        }
    }
};