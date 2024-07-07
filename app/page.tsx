'use client';

import { useRef, useState } from 'react';
import va from '@vercel/analytics';
import clsx from 'clsx';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Textarea from 'react-textarea-autosize';
import { toast } from 'sonner';
import { VercelIcon, GithubIcon, LoadingCircle, SendIcon } from './icons.tsx';

const examples = [
    'Tell me about the early life of Steve Jobs',
    'Did Steve Jobs have any children?',
    'Who was Steve Jobs?',
];

export default function Chat() {
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const [input, setInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

    const callAPI = async () => {
        const data = { query: input };

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data);

        // API endpoint where we send form data.
        const endpoint = '/api/chat';

        // Form the request for sending data to the server.
        const options = {
            // The method is POST because we are sending data.
            method: 'POST',
            // Tell the server we're sending JSON.
            headers: {
                'Content-Type': 'application/json',
            },
            // Body of the request is the JSON data we created above.
            body: JSONdata,
        };

        // Send the form data to our forms API on Vercel and get a response.
        return fetch(endpoint, options);
    };

    const handleSubmit = async (event: any) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault();

        setLoading(true);

        messages.push({ role: 'user', content: input });
        setMessages([...messages]);
        setInput('');

        const response = await callAPI();

        if (response.status !== 200) {
            toast.error('Something went wrong. Try again later.');
            va.track('GPT error');
        } else {
            messages.push({ role: 'assistant', content: (await response.json()).result });
            setMessages([...messages]);
            va.track('GPT success');
        }

        setLoading(false);
    };

    const disabled = isLoading || input.length === 0;

    return (
        <main className="flex flex-col items-center justify-between pb-40">
            <div className="absolute top-5 hidden w-full justify-between px-5 sm:flex">
                <a
                    href="/deploy"
                    target="_blank"
                    className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto"
                >
                    <VercelIcon />
                </a>
                <a
                    href="/github"
                    target="_blank"
                    className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto"
                >
                    <GithubIcon />
                </a>
            </div>

            {messages.length > 0 ? (
                messages.map((message, i) => (
                    <div
                        key={i}
                        className={clsx(
                            'flex w-full items-center justify-center border-b border-gray-200 py-8',
                            message.role === 'user' ? 'bg-white' : 'bg-gray-100',
                        )}
                    >
                        <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
                            <div
                                className={clsx(
                                    'p-1.5 text-white',
                                    message.role === 'assistant' ? 'bg-green-500' : 'bg-black',
                                )}
                            >
                                {message.role === 'user' ? <User width={20} /> : <Bot width={20} />}
                            </div>
                            <ReactMarkdown
                                className="prose mt-1 w-full break-words prose-p:leading-relaxed"
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    // open links in new tab
                                    a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))
            ) : (
                <div className="border-gray-200sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border sm:w-full">
                    <div className="flex flex-col space-y-4 p-7 sm:p-10">
                        <h1 className="text-lg font-semibold text-black">Welcome to EmbedJs Chat example!</h1>
                        <p className="text-gray-500">
                            This is an{' '}
                            <a
                                href="https://github.com/llmembed/chat-bot-nextjs-template"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium underline underline-offset-4 transition-colors hover:text-black"
                            >
                                open-source
                            </a>{' '}
                            AI chatbot that uses{' '}
                            <a
                                href="https://github.com/llmembed/embedjs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium underline underline-offset-4 transition-colors hover:text-black"
                            >
                                EmbedJS
                            </a>{' '}
                            and{' '}
                            <a
                                href="https://platform.openai.com/docs/guides/gpt/function-calling"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium underline underline-offset-4 transition-colors hover:text-black"
                            >
                                Open AI
                            </a>{' '}
                            to answer questions about Steve Jobs
                        </p>
                    </div>
                    <div className="flex flex-col space-y-4 border-t border-gray-200 bg-gray-50 p-7 sm:p-10">
                        {examples.map((example, i) => (
                            <button
                                key={i}
                                className="rounded-md border border-gray-200 bg-white px-5 py-3 text-left text-sm text-gray-500 transition-all duration-75 hover:border-black hover:text-gray-700 active:bg-gray-50"
                                onClick={() => {
                                    setInput(example);
                                    inputRef.current?.focus();
                                }}
                            >
                                {example}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
                >
                    <Textarea
                        ref={inputRef}
                        tabIndex={0}
                        required
                        rows={1}
                        autoFocus
                        placeholder="Send a message"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                formRef.current?.requestSubmit();
                                e.preventDefault();
                            }
                        }}
                        spellCheck={false}
                        className="w-full pr-10 focus:outline-none"
                    />
                    <button
                        className={clsx(
                            'absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all',
                            disabled ? 'cursor-not-allowed bg-white' : 'bg-green-500 hover:bg-green-600',
                        )}
                        disabled={disabled}
                    >
                        {isLoading ? (
                            <LoadingCircle />
                        ) : (
                            <SendIcon
                                className={clsx('h-4 w-4', input.length === 0 ? 'text-gray-300' : 'text-white')}
                            />
                        )}
                    </button>
                </form>
                <p className="text-center text-xs text-gray-400">
                    Built with{' '}
                    <a
                        href="https://github.com/llmembed/embedjs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-black"
                    >
                        EmbedJs
                    </a>
                    .{' '}
                    <a
                        href="https://github.com/llmembed/chat-bot-nextjs-template"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-black"
                    >
                        View the repo
                    </a>{' '}
                    or{' '}
                    <a
                        href="https://vercel.com/new/clone?repository-url=https://github.com/llmembed/chat-bot-nextjs-template&env=OPENAI_API_KEY,PINECONE_API_KEY,PINECONE_ENVIRONMENT&envDescription=OpenAPI and Pinecone both provide free accounts. Check the documentation link on how to get these access tokens.&envLink=https://github.com/llmembed/chat-bot-nextjs-template#readme&project-name=chat-bot&demo-title=Steve Jobs Example Chat Bot&demo-description=This example chat bot is trained to answer questions on Steve Jobs. &demo-url=https://gpt-chat-bot-nextjs.vercel.app/&demo-image=https://avatars.githubusercontent.com/u/138303766?s=48&v=4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-black"
                    >
                        deploy your own
                    </a>
                    .
                </p>
            </div>
        </main>
    );
}
