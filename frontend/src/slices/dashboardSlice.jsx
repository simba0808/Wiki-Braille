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

const initialDeleteState = {
  indexesToDelete: []
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

const deleteDescSlice = createSlice({
  name: "delete",
  initialState: initialDeleteState,
  reducers: {
    setIndexesToDelete: (state, action) => {
      state.indexesToDelete = action.payload;
    }
  }
})

export const { setFilterGroup } = searchSlice.actions;
export const { setIndexesToDelete } = deleteDescSlice.actions;

const searchReducer = searchSlice.reducer;
const deleteDescReducer = deleteDescSlice.reducer;

export { searchReducer, deleteDescReducer };