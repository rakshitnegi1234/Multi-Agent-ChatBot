import { createSlice } from "@reduxjs/toolkit";


// action object ke andar payload hota haii aur type hota haii . 

// Jab aap createSlice likhte hain, to Redux Toolkit aapke reducers ke naam par functions bana leta hai.

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
  },
  reducers: {
    setUserdata: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserdata } = userSlice.actions;
export default userSlice.reducer;