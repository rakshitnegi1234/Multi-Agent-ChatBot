import { Annotation } from "@langchain/langgraph";

export const agentState = Annotation.Root({
  prompt: Annotation(),
  response: Annotation(),
  aiResponse: Annotation(),
  agent: Annotation(),
  selectedAgent: Annotation(),
  searchResults: Annotation(),
  searchError: Annotation(),
  conversationId : Annotation()
});
