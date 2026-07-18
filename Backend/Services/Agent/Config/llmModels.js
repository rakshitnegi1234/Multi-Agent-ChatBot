import { ChatGroq } from "@langchain/groq";

let groq;
const requestLimit = 10;
const waitTimeMs = 50_000;
const requestWindows = new Map();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForRequestSlot = async (provider) => {
    const requestWindow = requestWindows.get(provider) || { count: 0 };

    if (requestWindow.count >= requestLimit) {
        await sleep(waitTimeMs);
        requestWindows.set(provider, { count: 1 });
        return;
    }

    requestWindows.set(provider, { count: requestWindow.count + 1 });
};

const withRateLimit = (model, provider) => {
    if (model.__rateLimitApplied) return model;

    const invoke = model.invoke.bind(model);

    model.invoke = async (...args) => {
        await waitForRequestSlot(provider);
        return invoke(...args);
    };

    model.__rateLimitApplied = true;
    return model;
};

const getGroqModel = () => {
    groq ??= new ChatGroq({
        model: "openai/gpt-oss-120b",
        temperature: 0,
        maxTokens: undefined,
    });

    return withRateLimit(groq, "groq");
};

export const  getModel = async (agent) =>
{
   return getGroqModel();
}
