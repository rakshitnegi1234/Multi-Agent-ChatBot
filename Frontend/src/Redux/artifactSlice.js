import { createSlice } from "@reduxjs/toolkit";

const artifactSlice = createSlice({
  name: "artifact",
  initialState: {
    activeArtifact: null,
    isOpen: true,
  },
  reducers: {
    setArtifact: (state, action) => {
      state.activeArtifact = action.payload;
      state.isOpen = true;
    },
    clearArtifact: (state) => {
      state.activeArtifact = null;
    },
    setArtifactOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setArtifact, clearArtifact, setArtifactOpen } =
  artifactSlice.actions;
export default artifactSlice.reducer;
