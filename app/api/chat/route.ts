import { NextResponse } from 'next/server.js';

import { RAGApplicationBuilder, RAGApplication } from '@llm-tools/embedjs';
import { PineconeDb } from '@llm-tools/embedjs/vectorDb/pinecone';

let ragApplication: RAGApplication;
const ragBuilder = new RAGApplicationBuilder()
    .setSearchResultCount(30)
    .addLoader({ type: 'Youtube', videoIdOrUrl: 's4pVFLUlx8g' })
    .addLoader({ type: 'Youtube', videoIdOrUrl: 'JxpSuxBMVXo' })
    .addLoader({ type: 'Web', urlOrContent: 'https://www.biography.com/business-leaders/steve-jobs' })
    .addLoader({ type: 'Web', urlOrContent: 'https://en.wikipedia.org/wiki/Steve_Jobs' })
    .setVectorDb(
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

    if (!ragApplication) ragApplication = await ragBuilder.build();
    const result = await ragApplication.query(body.query);

    return NextResponse.json({ result: result.content });
}
