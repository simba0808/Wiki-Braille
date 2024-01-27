import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filterGroup: {
  word: "",
  advance: "Descrição",
  searchin: 0,
  pageIndex: 1,
  numberPerPage: 10,
  filteredCount: null,}
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setFilterGroup: (state, action) => {
      state.filterGroup = action.payload;
    },
  },
});

export const { setFilterGroup } = searchSlice.actions;

const searchReducer = searchSlice.reducer;
export default searchReducer;