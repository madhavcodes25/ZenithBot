const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const discord = require('discord.js');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('askai')
        .setDescription('The query to ask AI')
        .addStringOption(option => 
            option.setName('query')
            .setDescription('the query to ask AI')
            .setRequired(true)
        ),
          /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
    async execute(clinet, interaction) {
        const query = interaction.options.getString('query');
        
        await interaction.deferReply();

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' }); 
            
            const result = await model.generateContent(query);
            const response = await result.response.text();

            let replyContent = response;

            if (replyContent.length > 1900) {
                replyContent = replyContent.slice(0, 1900) + '\n\n... (truncated due to Discord\'s message length limit)';
            }

            const embed = new discord.EmbedBuilder()
                .setColor(Math.floor(Math.random() * 0xFFFFFF)) 
                .setTitle('AI Response')
                .setDescription(replyContent)
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL() 
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error while processing request:', error);
            
            const errorEmbed = new discord.EmbedBuilder()
                .setColor('Red')
                .setTitle('Error')
                .setDescription('There was an error while processing your request.')
                .addFields({ name: 'Error details', value: error.message || 'Unknown error' });

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};