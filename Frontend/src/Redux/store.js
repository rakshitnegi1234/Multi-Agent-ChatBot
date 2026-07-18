import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./userSlice";
import conversationReducer from "./conversation.Slice";
import messageReducer from "./messageSlice.js";
import artifactReducer from "./artifactSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    conversation : conversationReducer,
    message : messageReducer,
    artifact : artifactReducer
  }, 
});
