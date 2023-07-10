import { NextResponse } from 'next/server';

const { LLMApplicationBuilder, WebLoader, YoutubeLoader, LLMApplication } = require('@llmembed/embedjs');
const { PineconeDb } = require('@llmembed/embedjs/databases/pinecone');

let llmApplication: typeof LLMApplication;
const llmBuilder = new LLMApplicationBuilder()
    .setSearchResultCount(30)
    .addLoader(new YoutubeLoader({ videoIdOrUrl: 'https://www.youtube.com/watch?v=s4pVFLUlx8g' }))
    .addLoader(new YoutubeLoader({ videoIdOrUrl: 'https://www.youtube.com/watch?v=JxpSuxBMVXo' }))
    .addLoader(new WebLoader({ url: 'https://www.biography.com/business-leaders/steve-jobs' }))
    .addLoader(new WebLoader({ url: 'https://en.wikipedia.org/wiki/Steve_Jobs' }))
    .setVectorDb(new PineconeDb({ projectName: 'test', namespace: 'dev' }))
    .setLoaderInit(false); //We have already initialized Pinecone during local development

export async function POST(req: Request) {
    const body = await req.json();

    if (!llmApplication) llmApplication = await llmBuilder.build();
    const result = await llmApplication.query(body.query);

    return NextResponse.json({ result });
}
