import axios from "axios"
import * as Haptics from "expo-haptics"
import { ipAddress } from "@/constants/ipAddress"
import RefreshToken from "../RefreshToken"

export async function LikePost(uid:number,user,dummyData,setDummyData){
    try{
        const response = await axios.post(`http://${ipAddress}:3001/posts/like-posts/${uid}`,null,{
            headers:{
                Authorization:`Bearer ${user.user.token}`
            }
        })
        console.log(response.data)
        setDummyData((prevData:any) => [...prevData, `Item ${dummyData.length+1}`]) 
    }
    catch(error){
        console.log(user.user.data.refreshToken , "REFRESH")
        // RefreshToken(user.user.data.refreshToken)
    }
}


export async function UnFollowUser(uid:number,user:any){
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    const response = await axios.delete(`http://${ipAddress}:3001/users/remove-follower/${uid}`,{
        headers:{
            Authorization:`Bearer ${user.user.token}`
        }
    })
}

export async function UnlikePost(uid:number,user:any,dummyData:any,setDummyData:any){
    const response = await axios.post(`http://${ipAddress}:3001/posts/unlike-posts/${uid}`,null,{
        headers:{
            Authorization:`Bearer ${user.user.token}`
        }
    })
    setDummyData((prevData:any) => [...prevData, `Item ${dummyData.length+1}`]) 
}

export async function FollowUser(uid:number,user:any){
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    try{
        const response = await axios.post(`http://${ipAddress}:3001/users/add-follower/${uid}`,null,{
            headers:{
                Authorization:`Bearer ${user.user.token}`
            }
        })    }
    catch(error){
        console.log(error)
    }
}

export async function CreateComment(activePost:number,comment,user){
    const data = {"message":comment}
    console.log(user.user.token)
    const response = await axios.post(`http://${ipAddress}:3001/posts/add-comment/${activePost}`,data,{
        headers:{
            Authorization: `Bearer ${user.user.token}`
        }
    })
}


export async function BlockUser(uid:any,token:any){
    const response =await axios.post(`http://${ipAddress}:3001/users/block/${uid}`,null,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    return response.data
}