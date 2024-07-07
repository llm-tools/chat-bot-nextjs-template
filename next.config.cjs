/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => {
        return [
            {
                source: '/github',
                destination: 'https://github.com/llmembed/chat-bot-nextjs-template',
                permanent: true,
            },
            {
                source: '/deploy',
                destination:
                    'https://vercel.com/new/clone?repository-url=https://github.com/llm-tools/chat-bot-nextjs-template&env=OPENAI_API_KEY,PINECONE_API_KEY&envDescription=OpenAPI and Pinecone both provide free accounts. Check the documentation link on how to get these access tokens.&envLink=https://github.com/llmembed/chat-bot-nextjs-template#readme&project-name=chat-bot&demo-title=Steve Jobs Example Chat Bot&demo-description=This example chat bot is trained to answer questions on Steve Jobs. &demo-url=https://gpt-chat-bot-nextjs.vercel.app/&demo-image=https://avatars.githubusercontent.com/u/138303766?s=48&v=4',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
