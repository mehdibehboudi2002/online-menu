import { createSlice } from "@reduxjs/toolkit";
import { getThemeFromCookie, setThemeCookie } from "../../themeCookie";

const initialState = {
  dark: getThemeFromCookie() === "dark",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.dark = !state.dark;
      setThemeCookie(state.dark ? "dark" : "light");
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
