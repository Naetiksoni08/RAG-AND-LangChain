import * as z from "zod";
// npm install @langchain/anthropic to call the model
import { createAgent, tool } from 'langchain';

const getWeather = tool(
    ({ city }) => `It's always sunny in ${city}!`,
    {
        name: "get_weather",
        description: "Get the weather for a given city",
        schema: z.object({
            city: z.string(),
        }),
    },
);

const agent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools: [getWeather],
});

async function run() {
    const respone = await agent.invoke({
        messages: [{ role: "user", content: "What's the weather in Tokyo?" }],
    })
    console.log(respone)
};

run();

