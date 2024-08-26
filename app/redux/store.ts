import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'
import otpReducer from './otpSlice'
import navbarReducer from './navbarSlice'
import colorsReducer from './colorsSlice'

const store = configureStore({
    reducer:{
        user:userReducer,
        otp:otpReducer,
        navbar:navbarReducer,
        colors:colorsReducer
    }
})

export type rootStore = ReturnType<typeof store.getState>
export default store
