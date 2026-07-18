import { createSlice } from "@reduxjs/toolkit";

const artifactSlice = createSlice({
  name: "artifact",
  initialState: {
    activeArtifact: null,
    activeConversationId: null,
    dismissedByConversation: {},
    isOpen: true,
  },
  reducers: {
    
    setArtifact: (state, action) => {
      const artifact = action.payload?.artifact || action.payload;
      const conversationId = action.payload?.conversationId;

      state.activeArtifact = artifact;
      state.activeConversationId = conversationId || null;
      state.isOpen = true;

      if (conversationId) {
        delete state.dismissedByConversation[conversationId];
      }
    },
    clearArtifact: (state, action) => {
      const conversationId =
        action.payload?.conversationId || state.activeConversationId;

      state.activeArtifact = null;
      state.activeConversationId = null;

      if (conversationId) {
        state.dismissedByConversation[conversationId] =
          action.payload?.dismissedAt || Date.now();
      }
    },
    setArtifactOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setArtifact, clearArtifact, setArtifactOpen } =
  artifactSlice.actions;
export default artifactSlice.reducer;
