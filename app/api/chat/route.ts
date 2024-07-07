import { NextResponse } from 'next/server.js';

import { RAGApplicationBuilder, RAGApplication } from '@llm-tools/embedjs';
import { PineconeDb } from '@llm-tools/embedjs/vectorDb/pinecone';

let ragApplication: RAGApplication;
const ragBuilder = new RAGApplicationBuilder().setSearchResultCount(30).setVectorDb(
    new PineconeDb({
        projectName: 'test',
        namespace: 'dev',
        indexSpec: {
            serverless: {
                region: 'us-east-1',
                cloud: 'aws',
            },
        },
    }),
);

export async function POST(req: Request) {
    const body = await req.json();

    //This will actually timeout when running in Vercel, the example is only working in local atm
    //Move to something like Inngest if you want to run this as is on vercel or refactor to your need
    if (!ragApplication) {
        ragApplication = await ragBuilder.build();
        await ragApplication.deleteAllEmbeddings(true);

        await Promise.all([
            ragApplication.addLoader({ type: 'Youtube', videoIdOrUrl: 's4pVFLUlx8g' }),
            ragApplication.addLoader({ type: 'Youtube', videoIdOrUrl: 'JxpSuxBMVXo' }),
            ragApplication.addLoader({
                type: 'Web',
                urlOrContent: 'https://www.biography.com/business-leaders/steve-jobs',
            }),
            ragApplication.addLoader({ type: 'Web', urlOrContent: 'https://en.wikipedia.org/wiki/Steve_Jobs' }),
        ]);
    }

    const result = await ragApplication.query(body.query);
    return NextResponse.json({ result: result.content });
}
