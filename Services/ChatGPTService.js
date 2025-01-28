import axios from "axios";

const OPENAI_API_KEY = "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"; // Replace with your actual OpenAI API key.


const ChatGPTService = {
    getInsights: async (checklistData) => {
        console.log(checklistData);
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o-mini', // Use the correct model
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an assistant providing advice for vet assistants based on pet checklists.',
                        },
                        {
                            role: 'user',
                            content: `Based on the following checklist data, provide a medical Insights and advice, make it straight forward, like that thing could mean a ... and like so. (note: make it in a high level information because the one who will read the result is a veterinarian and understand high level medical info, and dont DONT SAY INTUITIVE.):\n${JSON.stringify(
                                checklistData,
                                null,
                                2
                            )}`,
                        },
                    ],
                    max_tokens: 200,
                    temperature: 0.7,
                },
                {
                    headers: {
                        Authorization: `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error fetching insights from OpenAI:', error);
            throw new Error('Failed to fetch insights from OpenAI.');
        }
    },
};


export default ChatGPTService;

