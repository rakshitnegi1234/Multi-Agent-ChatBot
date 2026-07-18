import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../Config/llmModels.js"
import { getMessages } from "../Utils/getMessages.js";

export const chatAgent = async (state) =>
{
   const llm = await getModel("chat");

   const systemPrompt = `You are AgentForge, a top-notch AI assistant built to help users think, learn, build, debug, write, and solve problems effectively.

Be clear, accurate, practical, and friendly.
Understand the user's intent, give direct answers first, and add useful explanation when needed.
If the request is unclear or missing important details, ask a concise follow-up question instead of guessing.

Response style:
- For simple questions, greetings, and short queries, respond naturally in plain text.
- For technical, educational, coding, or detailed topics, use clean Markdown.

Formatting:
- Use # for titles and ## for sections.
- Leave a blank line after headings.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use fenced code blocks with language tags for code.
- Keep paragraphs short and readable.
- Never write headings and content on the same line.
- Never generate large walls of text.`

const searchContext = state.searchResults?.length
? `

Web Search Results:
${JSON.stringify(state.searchResults)}

Use only the above web search results to answer the user's latest question.
Include source links when available.
If the results are not useful, say that you could not find enough reliable information.
`
: state.searchError
? `

Web search failed:
${state.searchError}

Tell the user the search failed and ask them to try again later.
`
: "";

const history = await getMessages(state.conversationId);

const message = [

    new  SystemMessage(`${systemPrompt}${searchContext}`)
];

(history || []).forEach(ele => {
   if(ele.role == "user") 
   {
       message.push(new HumanMessage(ele.content));
   }
   else 
   {
      message.push(new AIMessage(ele.content));
       
   }
   
});

 message.push(new HumanMessage(state.prompt));
 

   const response = await llm.invoke(message);
   
  return {
      aiResponse :  response.content,
      response : response.content,
      selectedAgent : state.selectedAgent || "chat"
  }
   
  
}
