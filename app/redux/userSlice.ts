import { createSlice } from "@reduxjs/toolkit";

type UserData ={
    username: string,
    profilePicture: string,
    bio:string,
    _id: string
}

type User = {
    data: UserData,
    token: string
} | null

const initialState : {user:User} = {
    user:null
}

const userSlice = createSlice({
    name:'user',
    initialState,
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