import axios from "axios"
import { useEffect, useState } from "react"
import { View , Text, StyleSheet,TouchableOpacity,Image, FlatList,Dimensions,TextInput, ToastAndroid} from "react-native"
import { Video,ResizeMode } from "expo-av"
import { useSelector } from "react-redux"
import { rootStore } from "./redux/store"
import { ipAddress } from "@/constants/ipAddress"
import { AntDesign,Entypo,Ionicons,Feather} from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import Animated,{useSharedValue,withTiming,withSpring, useAnimatedStyle,useAnimatedReaction, useDerivedValue,runOnJS} from "react-native-reanimated"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import * as Haptics from 'expo-haptics'
import PostComponent from "@/components/postComponent"
const {width:SCREEN_WIDTH, height:SCREEN_HEIGHT} = Dimensions.get('window')
import { ColorPalatte } from "@/constants/Colors";
import ActionBottomSheet from "@/components/ActionBottomSheet"
import { BlockUser, UnBlockUser } from "@/components/CallBacks/CallBackFunctions"
import CommentBottomSheet from "@/components/CommentBottomSheet"
import { io } from "socket.io-client"
const Colors = ColorPalatte()


function ProfileLiked(){
    const user = useSelector((state:rootStore)=>state.user.user)
    const socket  = io(`http://${ipAddress}:3001`)
    const translateY = useSharedValue(SCREEN_HEIGHT)
    const actionContext = useSharedValue(0)
    const actionSheetY = useSharedValue(SCREEN_HEIGHT)
    const context = useSharedValue({y:0})
    const [posts,setPosts] = useState([])
    const [comment,setComment] = useState('')
    const [activePost,setActivePost] = useState({index:0,id:0})
    const [isSheetOpened,setIsSheetOpened] = useState(true)
    const isSheetOpenedDerived = useDerivedValue(() => translateY.value < -SCREEN_HEIGHT / 3)
    const [follows,setFollows] = useState([])
    const [blocked,setBlocked] = useState([])
    const [loading,setLoading] = useState(false)
    const [actionSheet,setActionSheet] = useState(false)
    const [activeComments,setActiveComments] = useState([]) 
    useAnimatedReaction(
        () => isSheetOpenedDerived.value,
        (isOpen)=>{
            runOnJS(setIsSheetOpened)(isOpen)
        } 
    )

    const gesture = Gesture.Pan().onStart((event)=>{
        context.value = {y:translateY.value}
    }).onUpdate((event)=>{
        translateY.value = event.translationY + context.value.y
        translateY.value = Math.max(translateY.value, -SCREEN_HEIGHT)
    }).onEnd(()=>{
        if(translateY.value > -SCREEN_HEIGHT/2){
            runOnJS(setIsSheetOpened)(false)
            translateY.value = withSpring(SCREEN_HEIGHT,{damping:50})
        }
        else if(translateY.value < -SCREEN_HEIGHT/1.7){
            translateY.value = withSpring(-SCREEN_HEIGHT+50,{damping:50})
        }
    })

    const SheetGesture = Gesture.Pan().onStart((event) =>{
        actionContext.value = event.translationY
    }).onUpdate((event) =>{
        actionSheetY.value = event.translationY + actionContext.value
        actionSheetY.value = Math.max(actionSheetY.value ,10)  
    }).onEnd((event) =>{
        if(actionSheetY.value < SCREEN_HEIGHT/8){
            actionSheetY.value = withSpring(10, {damping:50})
        }
        else{
            runOnJS(CloseBottomSheet)()
        }
    })
    async function GetLikedPosts(){
        const response = await axios.get(`http://${ipAddress}:3001/users/get-user/${user?.data._id}`,{
            headers:{
                Authorization:`Bearer ${user?.token}`
            }
        })

        const likedPost = response.data.data.likes
        const data = {IDS : likedPost}
        const posts = await axios.post(`http://${ipAddress}:3001/posts/liked`,data,{
            headers:{
                Authorization:`Bearer ${user?.token}`
            }
        })
        setPosts(posts.data.data)
    }
    

    useEffect(() => {
        GetLikedPosts()
    },[])
    

    async function UnFollowUser(uid:number){
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        const response = await axios.delete(`http://${ipAddress}:3001/users/remove-follower/${uid}`,{
            headers:{
                Authorization:`Bearer ${user?.token}`
            }
        })

    }
    async function FollowUser(uid:number){
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        try{
            const response = await axios.post(`http://${ipAddress}:3001/users/add-follower/${uid}`,null,{
                headers:{
                    Authorization:`Bearer ${user?.token}`
                }
            })
        }
        catch(error){
            console.log(error)
        }
    }   
    
    async function GetFollowers(){
        const response = await axios.get(`http://${ipAddress}:3001/users/get-followers/${user?.data._id}`,{
            headers:{
                Authorization:`Bearer ${user?.token}`
            }
        })
        setFollows(response.data[0].followersDetails)
    }
    
    const toggleBottomSheet = async(index:number,id:number) =>{
        // dispatch(setOpened(false))
        console.log(index,id)
        setActivePost({index:id,id})
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        if(isSheetOpened){
            setIsSheetOpened(false)
            translateY.value = withSpring(0,{damping:50})
        }
        else{
            setIsSheetOpened(true)
            translateY.value = withSpring(-SCREEN_HEIGHT+50,{damping:50})
            setActiveComments(posts[index].comments ? posts[index].comments : [])
        }
    }

    async function HandleCreateComment(){
        setLoading(true)
        const data = {"message":comment}
        // const response = await axios.post(`http://${ipAddress}:3001/posts/add-comment/${activePost}`,data,{
            //     headers:{
                //         Authorization: `Bearer ${user?.user?.token}`
                //     }
                // })
        socket.emit("createComment",{"message":comment, "userId":user?.user?.data._id,"postId":activePost.id})
        setLoading(false)
    }

    function CloseBottomSheet(){
        setActionSheet(false)
        actionSheetY.value = withSpring(SCREEN_HEIGHT, {damping:50})
    }
    function OpenBottomSheet(index:number , id:number){
        setActionSheet(true)
        setActivePost({index,id})
        actionSheetY.value = withSpring(0, {damping:50})
    }

    async function HandleLikePost(uid:number){
        const data = {"postId":uid , "userId":user?.data._id}
        setPosts((prev:any) => prev.map((item:any) => item._id == data.postId ?{ 
                ...item ,
                likes:item.likes ? [...item.likes,data.userId] :[data.userId]} : item) )
        socket.emit("likePost",data)
        // await LikePost(uid,user,dummyData,setDummyData)
    }
    
    async function HandleUnLikePost(uid:number){
        const data = {"postId":uid , "userId":user?.data._id}
        setPosts((prev:any) => prev.map((post:any) => post._id == data.postId?{
            ...post,
            likes:post.likes ? post.likes.filter((likes:number) => likes.toString() != data.userId) : null  

        }:post))
        socket.emit("unlikePost",data)
    }

    async function BlockUserController(creator:any){
        try{
            const data ={"_id":creator._id,"profilePicture":creator.profilePicture,"userId":creator.creator_id[0],"userName":creator.username}
            const response = await BlockUser(creator.creator_id,user?.token)
            ToastAndroid.show("User Blocked Successfully" ,ToastAndroid.SHORT)
            setBlocked((prev) => [...prev,data])
        }
        catch(error){
            console.log(error)
        }
    }
    
    async function UnBlockController(id:any){
        try{
            const response = await UnBlockUser(id,user?.token)
            ToastAndroid.show("User Unblocked Successfully" ,ToastAndroid.SHORT)
            setBlocked((prev) => prev.filter((item) =>{
                item.userId.toString() != id.toString()
            }))
        }
        catch(error){
            console.log(error)
        }
    }

    async function AddBookmark(uid:number){
        const data = {"postId":uid , "userId":user?.data._id}
        setPosts((prev:any) => prev.map((item:any) =>  item._id == data.postId ?{
            ...item,
            bookmarks: item.bookmarks ? [...item.bookmarks,data.userId] :[data.userId]} :  item))
        socket.emit("createBookmark",data)
    }
    
    async function RemoveBookmark(uid:number){
        const data ={"postId" : uid  , "userId":user?.data._id}
        setPosts((prev:any) => prev.map((post:any) => post._id == data.postId?{
            ...post,
             bookmarks:post.bookmarks ? post.bookmarks.filter((likes:number) => likes.toString()!= data.userId) : null  
         }:post))
        socket.emit("removeBookmark",data)
    }

    async function HandleFollowUser(userData:any){
        const data  ={"_id":userData.creator_id, "name":userData.username,"profilePicture":userData.profilePicture}
        setFollows((follows:any) => [...follows,data])
        await FollowUser(userData.creator_id)
    }
    async function HandleUnfollowUser(uid:number){
        setFollows((follow:any) => follows.filter((item) =>{
            return item._id.toString() != uid.toString()
        }))
        await UnFollowUser(uid)
    }
        useEffect(() =>{
            GetFollowers()
        },[])

    return(
        <View style={styles.container}>
            <TouchableOpacity style={{backgroundColor:"#000",position:"absolute",display:actionSheet?"flex":"none",top:0,left:0,width:"100%",height:"100%",opacity:0.5,zIndex:1}}></TouchableOpacity>
            <View style={styles.containerLayout}>
                <Text style={[styles.textColor,{fontFamily:"Poppins-Bold",fontSize:25}]}>Liked</Text>
                <FlatList showsVerticalScrollIndicator={false} data={posts} renderItem={({item,index}) =>{
                        return(
                            <PostComponent item={item}index={index} follows={follows} unlikePost={HandleUnLikePost} UnFollowUser={HandleUnfollowUser} toggleBottomSheet={toggleBottomSheet} LikePost={HandleLikePost} FollowUser={HandleFollowUser} openBottomSheet={OpenBottomSheet} AddBookmark={AddBookmark} RemoveBookmark={RemoveBookmark}/>
                        )
                }}/>
                
            </View>
            <CommentBottomSheet gesture={gesture} translateY={translateY} activeComments={activeComments} HandleCreateComment={HandleCreateComment} loading={loading} setComment={setComment}/>
            <ActionBottomSheet SheetGesture={SheetGesture} actionTranslateY={actionSheetY} posts={posts} activePost={activePost} follows={follows} blocked={blocked} BlockUser={BlockUserController} UnblockUser={UnBlockController} HandleFollowUser={HandleFollowUser} HandleUnfollowUser={HandleUnfollowUser} CloseBottomSheet={CloseBottomSheet}/>

        </View>
    )
}
export default ProfileLiked


const styles = StyleSheet.create({
    container:{
        backgroundColor:Colors.theme.backgroundColor,
        height:"100%"
    },   
    containerLayout:{
        paddingVertical:45,
        paddingHorizontal:20,
    },
    contentScroller:{
        flexDirection:"row",
    },
    posts:{
        backgroundColor:"#f2f2f2",
        padding:10,
        paddingVertical:15,
        borderRadius:5,
        marginBottom:25
    },
    textColor:{
        color:Colors.theme.fontColor
    }
})