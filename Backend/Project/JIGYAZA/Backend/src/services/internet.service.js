import {tavily as Tavily} from '@tavily/core';
import dotenv from 'dotenv';
dotenv.config();

const tavily = Tavily({
    apiKey : process.env.TAVILY_API_KEY,
})

export const searchInternet =async ({query})=>{
    const res = await tavily.search(query ,{
        maxResults:5,
        searchDepth:"fast"
    })

    return JSON.stringify(res);
}

