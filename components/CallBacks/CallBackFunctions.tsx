import axios from "axios"
import * as Haptics from "expo-haptics"
import { ipAddress } from "@/constants/ipAddress"
import { io } from "socket.io-client"
import RefreshToken from "../RefreshToken"

export async function LikePost(uid:number,user:any,dummyData:any,setDummyData:any){
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
        console.log(user.user.data.refreshToken)
    }
}


export async function UnFollowUser(uid:number,user:any){
    const token =  user.token ? user.token  : user.user.token
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    const response = await axios.delete(`http://${ipAddress}:3001/users/remove-follower/${uid}`,{
        headers:{
            Authorization:`Bearer ${token}`
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

export async function CreateComment(activePost:number,comment:string,user:any){
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

export async function UnBlockUser(uid:any,token:any){
    const response =await axios.post(`http://${ipAddress}:3001/users/block/${uid}`,null,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    return response.data
}

export async function HandleFollowUser(userData:any,setFollows:any,token:any){
    const data  ={"_id":userData.creator_id, "name":userData.username,"profilePicture":userData.profilePicture}
    setFollows((follows:any) => [...follows,data])
    try{
        const response = await axios.post(`http://${ipAddress}:3001/users/add-follower/${data._id}`,null,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })    
    }
    catch(error){
        console.log(error)
    }
}

export async function HandleUnfollowUser(uid:number,setFollows:any,follows:any,token:any){
    setFollows((follow:any) => follows.filter((item:any) =>{
    return item._id.toString() != uid.toString()
    }))

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    const response = await axios.delete(`http://${ipAddress}:3001/users/remove-follower/${uid}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
}

export async function HandleLikePost(uid:number, setPostData:any,user:any){
    const socket = io(`http://${ipAddress}:3001`)
    const data = {"postId":uid , "userId":user?.data._id}
    setPostData((prev:any) => prev.map((item:any) => item._id == data.postId ?{ 
        ...item ,
        likes:item.likes ? [...item.likes,data.userId] :[data.userId]} : item) )
        socket.emit("likePost",data)
        // await LikePost(uid,user,dummyData,setDummyData)
    }
    
export async function HandleUnLikePost(uid:number,setPostData:any,user:any){
        const socket = io(`http://${ipAddress}:3001`)
        const data = {"postId":uid , "userId":user?.data._id}
    setPostData((prev:any) => prev.map((post:any) => post._id == data.postId?{
        ...post,
        likes:post.likes ? post.likes.filter((likes:number) => likes.toString() != data.userId) : null  

    }:post))
    socket.emit("unlikePost",data)
}

export async function HandleAddBookmark(uid:number,setPostData:any,user:any){
    const socket = io(`http://${ipAddress}:3001`)
    const data = {"postId":uid , "userId":user?.data._id}
    setPostData((prev:any) => prev.map((item:any) =>  item._id == data.postId ?{
        ...item,
        bookmarks: item.bookmarks ? [...item.bookmarks,data.userId] :[data.userId]} :  item))
        socket.emit("createBookmark",data)
    }
    
export async function HandleRemoveBookmark(uid:number,setPostData:any,user:any){
    const socket = io(`http://${ipAddress}:3001`)
    const data ={"postId" : uid  , "userId":user?.data._id}
    setPostData((prev:any) => prev.map((post:any) => post._id == data.postId?{
        ...post,
         bookmarks:post.bookmarks ? post.bookmarks.filter((likes:number) => likes.toString()!= data.userId) : null  
     }:post))
    socket.emit("removeBookmark",data)
}