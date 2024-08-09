import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'
import otpReducer from './otpSlice'

const store = configureStore({
    reducer:{
        user:userReducer,
        otp:otpReducer
    }
})

export type rootStore = ReturnType<typeof store.getState>
export default store
