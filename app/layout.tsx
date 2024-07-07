import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';

import Toaster from './toaster.tsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'EmbedJs Chat example This is an open source chat bot that is trained on Steve Jobs',
    description: 'Built with Embedjs (https://github.com/llmembed/embedjs)',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
                <Toaster />
            </body>
            <Analytics />
        </html>
    );
}
