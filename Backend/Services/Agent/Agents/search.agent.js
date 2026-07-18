import { getSearchTool } from "../Config/tavily.js";

export const searchAgent = async (state) =>
{
  try {
    const searchTool = getSearchTool();
    const results = await searchTool.invoke({
      query: state.prompt,
    });

    if (results?.error) {
      return {
        selectedAgent: "search",
        searchResults: [],
        searchError: results.error,
      };
    }

    return {
      selectedAgent: "search",
      searchResults: results?.results || [],
    };
  } catch (error) {
    return {
      selectedAgent: "search",
      searchResults: [],
      searchError: error?.message || String(error),
    };
  }
}
