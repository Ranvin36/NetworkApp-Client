import axios from "axios"
import * as Haptics from "expo-haptics"
import { ipAddress } from "@/constants/ipAddress"

export async function LikePost(uid,user,dummyData,setDummyData){
    const response = await axios.post(`http://${ipAddress}:3001/posts/like-posts/${uid}`,null,{
        headers:{
            Authorization:`Bearer ${user.user.token}`
        }
    })
    console.log(response.data)
    setDummyData((prevData:any) => [...prevData, `Item ${dummyData.length+1}`]) 
}


export async function UnFollowUser(uid,user,setFollowCount){
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    const response = await axios.delete(`http://${ipAddress}:3001/users/remove-follower/${uid}`,{
        headers:{
            Authorization:`Bearer ${user.user.token}`
        }
    })

    setFollowCount((prev:any) => [...prev,1])
}

export async function UnlikePost(uid,user,dummyData,setDummyData){
    const response = await axios.post(`http://${ipAddress}:3001/posts/unlike-posts/${uid}`,null,{
        headers:{
            Authorization:`Bearer ${user.user.token}`
        }
    })
    setDummyData((prevData:any) => [...prevData, `Item ${dummyData.length+1}`]) 
}

export async function FollowUser(uid:number,user,setFollowCount){
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    try{
        const response = await axios.post(`http://${ipAddress}:3001/users/add-follower/${uid}`,null,{
            headers:{
                Authorization:`Bearer ${user.user.token}`
            }
        })
        setFollowCount((prev:any) => [...prev, 1])
    }
    catch(error){
        console.log(error)
    }
}

export async function CreateComment(activePost:number,comment,user){
    const data = {"message":comment}
    const response = await axios.post(`http://${ipAddress}:3001/posts/add-comment/${activePost}`,data,{
        headers:{
            Authorization: `Bearer ${user.user.token}`
        }
    })
}