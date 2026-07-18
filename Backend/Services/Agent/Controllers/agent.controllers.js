import axios from "axios";
import graph from "../Graph/graphBuilder.js";
import { addMessage } from "../Config/memory.js";

const allowedAgents = ["auto", "chat", "search", "coding"];

export const  agent = async (req,res) =>
{
   try{
       // USER

    const {prompt,conversationId} = req.body;
    const requestedAgent = req.body?.agent || "auto";
    const agent = String(requestedAgent).toLowerCase();

    if (!allowedAgents.includes(agent)) {
      return res.status(400).json({"message" : "Invalid agent selected"});
    }

     await addMessage(conversationId,"user",prompt);

    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role : "user",
      content : prompt
    });

    const result = await graph.invoke({
      prompt,
      agent,
      conversationId,
    });

     // AI

   const response =  result.aiResponse || result.response;

 await addMessage(conversationId,"assistant",response);

    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role : "assistant",
      content: response
    });

   return res.status(200).json({
      response,
      aiResponse: response,
      selectedAgent: result.selectedAgent || "chat"
   });

  

   }catch(err)
   {
     return res.status(500).json({"message" : `${err}`});
   }
}
