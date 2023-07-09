/** @type {import('next').NextConfig} */
const nextConfig = {
    // experimental: {
    //     serverActions: true,
    // },
    redirects: async () => {
        return [
            {
                source: '/github',
                destination: 'https://github.com/llmembed/chat-bot-nextjs-template',
                permanent: true,
            },
            {
                source: '/deploy',
                destination: 'https://vercel.com/templates/next.js/chat-bot-exampl',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
