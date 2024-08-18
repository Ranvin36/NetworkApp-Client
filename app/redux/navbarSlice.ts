import { createSlice } from "@reduxjs/toolkit";

const navbarSlice = createSlice({
    name:'navbar',
    initialState:{navbar:false},
    reducers:{
        setOpened : (state,action) =>{
            state.navbar = action.payload
        }
    }
})

export const {setOpened} = navbarSlice.actions
export default navbarSlice.reducer


