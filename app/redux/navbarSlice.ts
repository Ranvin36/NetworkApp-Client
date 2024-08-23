import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    navbar: false,
  };

const navbarSlice = createSlice({
    name:'navbar',
    initialState,
    reducers:{
        setOpened : (state,action) =>{
            state.navbar = action.payload
        }
    }
})

export const {setOpened} = navbarSlice.actions
export default navbarSlice.reducer


