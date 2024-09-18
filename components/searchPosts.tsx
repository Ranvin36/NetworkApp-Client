import { rootStore } from "@/app/redux/store"
import { ipAddress } from "@/constants/ipAddress"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { View  , Dimensions, FlatList,Text, StyleSheet,TouchableOpacity} from "react-native"
import { useDispatch, useSelector, UseSelector } from "react-redux"
import PostComponent from "./postComponent"
import * as Haptics from "expo-haptics"
import Animated,{ useSharedValue,withSpring,useDerivedValue,useAnimatedStyle,useAnimatedReaction,runOnJS} from "react-native-reanimated"
import { Gesture,GestureDetector} from "react-native-gesture-handler"
import { router } from "expo-router"
import { AntDesign,Entypo,MaterialIcons,MaterialCommunityIcons } from "@expo/vector-icons"
import { setOpened } from "@/app/redux/navbarSlice"
import CommentBottomSheet from "./CommentBottomSheet"
import ActionBottomSheet from "./ActionBottomSheet"
import { BlockUser } from "./CallBacks/CallBackFunctions"
import { ToastAndroid } from "react-native"


type SearchTypes={
    searchParam: string
}

type PostTypes={
    _id: number,
    user_id: number,
    title: string,
    image: string | null,
    video: string | null,
    likes: any[],
    bookmarks: any[],
    comments: any[],
    created_at: string,
    updated_at: string,
    creator: [{
        id: number,
        creator_id: string,
        username: string,
        profile_pic: string | null,
        created_at: string,
        updated_at: string,
    }]
}

type CommentTypes={
    _id: number,
    post_id: number,
    user_id: number,
    content: string,
    created_at: string,
    updated_at: string,
    creator: [{
        id: number,
        creator_id: string,
        username: string,
        profile_pic: string | null,
        created_at: string,
        updated_at: string,
    }]
}


const SearchPosts:React.FC<SearchTypes> =({searchParam}) => {
    const user = useSelector((state:rootStore)=>state.user.user)
    const [postData,  setPostData] = useState<PostTypes[]>([])
    const [followCount,  setFollowCount] = useState([0])
    const [follows, setFollows] = useState([])
    const [posts, setPosts] = useState([])
    const [activePost, setActivePost] = useState({index:0,id:0})
    const [activateBottomPost, setActiveBottomPost] = useState(0)
    const [activeComments, setActiveComments] = useState<CommentTypes[]>([])
    const [comments,setComment] = useState("")
    const [isSheetOpened, setIsSheetOpened] = useState(false)
    const [bottomSheetOpened, setBottomSheetOpened] = useState(false)
    const [sheetOpened,setSheetOpened] = useState(false)
    const offSet = useSharedValue(0)
    const {width:SCREEN_WIDTH, height:SCREEN_HEIGHT} = Dimensions.get('window')
    const translateY = useSharedValue(SCREEN_HEIGHT)
    const context = useSharedValue({y:0})
    const actionContext = useSharedValue({y:0})
    const dispatch = useDispatch()

    const SheetGesture = Gesture.Pan().onStart((event) =>{
        actionContext.value = {y:offSet.value}
    }).onUpdate((event) =>{
        offSet.value = event.translationY + actionContext.value.y
        offSet.value = Math.max(offSet.value , -SCREEN_HEIGHT/30)  
    }).onEnd((event) =>{
        if(offSet.value < SCREEN_HEIGHT/8){
            offSet.value = withSpring(0, {damping:50})
        }
        else{
            runOnJS(CloseBottomSheet)()
        }
    })

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


    async function GetSearchPost(){
        if(searchParam){
            const response = await axios.get(`http://${ipAddress}:3001/posts/search?title=${searchParam}`,{
                headers:{
                    Authorization:`Bearer ${user?.token}`
                }
            })
            setPostData(response.data.findPost)
        }
    }

    useEffect(()=> {
        GetSearchPost()
    },[searchParam])

      const sheetStyle = useAnimatedStyle(() =>{
        return{
            transform:[{translateY:translateY.value}]
        }
    })


    async function CreateComment(){
        const data = {"message":comments}
        const response = await axios.post(`http://${ipAddress}:3001/posts/add-comment/${activePost.id}`,data,{
            headers:{
                Authorization: `Bearer ${user?.token}`
            }
        })
    }
    async function UnFollowUser(uid:number){
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        const response = await axios.delete(`http://${ipAddress}:3001/users/remove-follower/${uid}`,{
            headers:{
                Authorization:`Bearer ${user?.token}`
            }
        })

        setFollowCount((prev) => [...prev,1])
    }
    async function FollowUser(uid:number){
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        try{
            const response = await axios.post(`http://${ipAddress}:3001/users/add-follower/${uid}`,null,{
                headers:{
                    Authorization:`Bearer ${user?.token}`
                }
            })
            setFollowCount((prev) => [...prev, 1])
        }
        catch(error){
            console.log(error)
        }
    }    async function GetPosts(){
        const response = await axios.get(`http://${ipAddress}:3001/posts/${id}`,{
            headers:{
                Authorization:`Bearer ${user?.token}`
            }
        })

        setPosts(response.data.data)
    }
    
    
    async function GetFollowers(){
        const response = await axios.get(`http://${ipAddress}:3001/users/get-followers/${user?.data._id}`,{
            headers:{
                Authorization:`Bearer ${user?.token}`
            }
        })
        setFollows(response.data)
    }
    async function LikePost(uid:number){
        const response = await axios.post(`http://${ipAddress}:3001/posts/like-posts/${uid}`,null,{
            headers:{
                Authorization:`Bearer ${user?.token}`
            }
        })

    }
    async function unlikePost(uid:number){
        const response = await axios.post(`http://${ipAddress}:3001/posts/unlike-posts/${uid}`,null,{
            headers:{
                Authorization:`Bearer ${user?.token}`
            }
        })
    }    
        useEffect(() =>{
            GetFollowers()
        },[])

        function CloseBottomSheet(){
            setSheetOpened(false)
            dispatch(setOpened(false))
            offSet.value = withSpring(SCREEN_HEIGHT, {damping:50})
        }
    
        function OpenBottomSheet(index:number,id:number){
            dispatch(setOpened(true))
            setActivePost({index:index,id})
            offSet.value = withSpring(0, {damping:50})
        }

        function HandleCreateComment(){

        }

        function Reaction(){
            if(isSheetOpened){
                dispatch(setOpened(false))
            }
            else{
                dispatch(setOpened(true))

            }
        }

        const toggleBottomSheet = async(index:number,id:number) =>{
            // dispatch(setOpened(false))
            setActivePost({index:id,id})
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            if(isSheetOpened){
                setIsSheetOpened(false)
                translateY.value = withSpring(SCREEN_HEIGHT,{damping:50})
            }
            else{
                setIsSheetOpened(true)
                translateY.value = withSpring(-SCREEN_HEIGHT+50,{damping:50})
                
                setActiveComments(postData[index].comments ? postData[index].comments : [])
            }
        }

        async function BlockUserController(id:number){
            try{
                const response = await BlockUser(id,user?.token)
                ToastAndroid.show("User Blocked Successfully" ,ToastAndroid.SHORT)
            }
            catch(error){
                console.log(error)
            }
        }

        useEffect(() =>{
            Reaction()
        },[isSheetOpened])
    return(
        <View style={{paddingBottom:150}}>
            <TouchableOpacity onPress={() =>CloseBottomSheet()} style={{backgroundColor:"#000",display:sheetOpened ?"flex" : "none",width:'100%',height:Dimensions.get('window').height,opacity:0.5,position:"absolute",left:0,top:0,zIndex:1}}></TouchableOpacity>
            <FlatList data={postData} showsVerticalScrollIndicator={false} renderItem={({item,index}) => {
                return(
                    <View style={{paddingHorizontal:20}}>
                        <PostComponent item={item} index={index} LikePost={LikePost} unlikePost={unlikePost} follows={follows} FollowUser={FollowUser} UnFollowUser={UnFollowUser} toggleBottomSheet={toggleBottomSheet}  openBottomSheet={OpenBottomSheet} setActivePost={setActiveBottomPost}/> 

                    </View>
                )
            }}/>
                 <ActionBottomSheet SheetGesture={SheetGesture} BlockUser={BlockUserController} CloseBottomSheet={CloseBottomSheet} posts={postData} actionTranslateY={offSet} activePost={activePost}/>
                <CommentBottomSheet gesture={gesture}  translateY={translateY} activeComments={activeComments} HandleCreateComment={HandleCreateComment} setComment={setComment}/>

        </View>
    )


}

export default   SearchPosts

const styles= StyleSheet.create({
    bottomSheet:{
        position:"absolute",
        backgroundColor:"#f2f2f2",
        bottom:30,
        width:Dimensions.get('window').width,
        alignSelf:"center",
        borderRadius:20,
        height:Dimensions.get('window').height/1.8
      },
      bottomSheetLayout:{
        paddingHorizontal:20,
        paddingVertical:10
      },
      bottomSheetText:{
        fontFamily:"Poppins-Light",
        fontSize:15
      },
      textWrap:{
        marginVertical:6
      },
      sheetOption:{
        marginVertical:2,
        flexDirection:"row",
        justifyContent:"space-between"
    }
})