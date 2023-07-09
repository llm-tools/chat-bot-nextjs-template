/** @type {import('next').NextConfig} */
const nextConfig = {
    // experimental: {
    //     serverActions: true,
    // },
    redirects: async () => {
        return [
            {
                source: '/github',
                destination: 'https://github.com/llmembed/chatbot-example',
                permanent: true,
            },
            {
                source: '/deploy',
                destination: 'https://vercel.com/templates/next.js/chatbot-example',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
