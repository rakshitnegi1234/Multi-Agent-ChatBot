import { TavilySearch } from "@langchain/tavily";

let searchTool;

export const getSearchTool = () => {
  if (!process.env.TAVILY_API_KEY) {
    throw new Error("TAVILY_API_KEY is missing");
  }

  searchTool ??= new TavilySearch({
    maxResults: 5,
    searchDepth: "advanced",
    includeAnswer: false,
    includeRawContent: false,
    includeImages: false,
  });

  return searchTool;
};
