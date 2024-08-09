import { createSlice } from "@reduxjs/toolkit";

const OtpSlice = createSlice({
    name:"otp",
    initialState:{otp:null},
    reducers:{
        setOtp: (state,action) =>{
            state.otp = action.payload
        }
    }
})

export const {setOtp} = OtpSlice.actions

export default OtpSlice.reducer