import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name:'user',
    initialState:{
        user:null,
    },
    reducers:{
        setUser : (state,action) =>{
            if(action.payload){
                state.user = action.payload
            }
            else{
                state.user = null
            }
        },
        updateProfilePic: (state,action) =>{
            state.user={
                ...state.user,
                data:{
                    ...state.user.data,
                    profilePicture:action.payload

                }
            }
        }
    }
})


export const {setUser , updateProfilePic} = userSlice.actions

export default userSlice.reducer