import { createSlice } from "@reduxjs/toolkit";

const ColorSlice = createSlice({
    name:"ColorPalette",
    initialState:{mode:0},
    reducers:{
        setColor : (state,action) =>{
            state.mode = action.payload
        }
    }
})


export const {setColor} = ColorSlice.actions
export default ColorSlice.reducer