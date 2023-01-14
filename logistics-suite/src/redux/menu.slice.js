import { createSlice } from "@reduxjs/toolkit";
const menuSlice = createSlice({
  name: "menu",
  initialState: { activeMenu: true },
  reducers: {
    setActiveMenu(state, action) {
      state.activeMenu = action.payload;
    },
  },
});
export const { setActiveMenu } = menuSlice.actions;
export default menuSlice.reducer;
