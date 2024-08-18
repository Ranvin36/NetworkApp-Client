import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'
import otpReducer from './otpSlice'
import navbarReducer from './navbarSlice'

const store = configureStore({
    reducer:{
        user:userReducer,
        otp:otpReducer,
        navbar:navbarReducer
    }
})

export type rootStore = ReturnType<typeof store.getState>
export default store
