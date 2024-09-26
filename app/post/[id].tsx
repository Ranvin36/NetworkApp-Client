import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { View , Text, StyleSheet,TouchableOpacity,Image, FlatList,Dimensions,TextInput} from "react-native"
import { useSelector } from "react-redux"
import { rootStore } from "../redux/store"
import { ipAddress } from "@/constants/ipAddress"
import { AntDesign,Entypo,Ionicons,Feather} from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import Animated,{useSharedValue,withTiming,withSpring, useAnimatedStyle,useAnimatedReaction, useDerivedValue,runOnJS} from "react-native-reanimated"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import * as Haptics from 'expo-haptics'
import PostComponent from "@/components/postComponent"
const {width:SCREEN_WIDTH, height:SCREEN_HEIGHT} = Dimensions.get('window')
import { ColorPalatte } from "@/constants/Colors";
import { HandleAddBookmark, HandleFollowUser, HandleLikePost, HandleRemoveBookmark, HandleUnfollowUser, HandleUnLikePost } from "@/components/CallBacks/CallBackFunctions"
import CommentBottomSheet from "@/components/CommentBottomSheet"
import { io } from "socket.io-client"
import ActionBottomSheet from "@/components/ActionBottomSheet"
import { BlockUser } from "@/components/CallBacks/CallBackFunctions"
import { ToastAndroid } from "react-native"
const Colors = ColorPalatte()


function Page(){
    const socket = io(`http://${ipAddress}:3001`)

    const user = useSelector((state:rootStore)=>state.user.user)
    const translateY = useSharedValue(SCREEN_HEIGHT)
    const actionSheetY = useSharedValue(399)
    const context = useSharedValue({y:0})
    const actionContext = useSharedValue(0)
    const {id,index} = useLocalSearchParams()
    const [posts,setPosts] = useState([])
    const [activePost,setActivePost] = useState({index:0,id:0})
    const [comment,setComment] = useState('')
    const [isSheetOpened,setIsSheetOpened] = useState(true)
    const isSheetOpenedDerived = useDerivedValue(() => translateY.value < -SCREEN_HEIGHT / 3)
    const [follows,setFollows] = useState([])
    const [blocked,setBlocked] = useState([])
    const [loading,setLoading] = useState(false)
    const [activeComments,setActiveComments] = useState([]) 
    const dynamicIndex = useRef(null)
    useAnimatedReaction(
        () => isSheetOpenedDerived.value,
        (isOpen)=>{
            runOnJS(setIsSheetOpened)(isOpen)
        } 
    )
    const gesture = Gesture.Pan().onStart(()=>{
        context.value = {y:translateY.value}
    }).onUpdate((event)=>{
        translateY.value = event.translationY + context.value.y
        translateY.value = Math.max(translateY.value, -SCREEN_HEIGHT)
    }).onEnd(()=>{
        if(translateY.value > -SCREEN_HEIGHT/2){
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

    async function GetPosts(){
        try{

            const response = await axios.get(`http://${ipAddress}:3001/posts/${id}`,{
                headers:{
                    Authorization:`Bearer ${user?.token}`
                }
            })
    
            setPosts(response.data.data)
        }

        catch(error){
            console.log(error)
        }
    }
    
    
    async function GetFollowers(){
        try{
            const response = await axios.get(`http://${ipAddress}:3001/users/get-followers/${user?.data._id}`,{
                headers:{
                    Authorization:`Bearer ${user?.token}`
                }
            })
            setFollows(response.data[0].followingDetails)
        }

        catch(error){
            console.log(error)
        }
    }
    async function LikePost(uid:number){
        try{
            await HandleLikePost(uid,setPosts,user)
        }
        catch(error){
            console.log(error)
        }
    }
    async function unlikePost(uid:number){
        try{
            await HandleUnLikePost(uid,setPosts,user)
        }
        catch(error){
            console.log(error)
        }
    }

    const rBottomSheetStyle = useAnimatedStyle(()=>{
        return{
            transform:[{translateY:translateY.value}]
        }
    })

    
    function OpenBottomSheet(index:number,id:number){
        // dispatch(setOpened(true))
        setActivePost({index,id})
        console.log(index)
        actionSheetY.value = withSpring(0, {damping:50})
    }

    function CloseBottomSheet(){
        actionSheetY.value = withSpring(SCREEN_HEIGHT, {damping:50})
    }

    const toggleBottomSheet = async(index:any,id:any) =>{
        setActivePost({id,index})
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        if(isSheetOpened){
            translateY.value = withSpring(0,{damping:50})
        }
        else{
            translateY.value = withSpring(-SCREEN_HEIGHT+50,{damping:50})
            setActiveComments(posts[index].comments ? posts[index].comments : [])

        }
    }
    async function HandleCreateComment(){
        setLoading(true)
        const data = {"message":comment}
        socket.emit("createComment",{"message":comment, "userId":user?.data._id,"postId":activePost.id})
        setLoading(false)
    }

    async function AddBookmark(uid:any){
        try{

            await HandleAddBookmark(uid,setPosts,user)
        }
        catch(error){
            console.log(error)
        }
    }
    async function RemoveBookmark(uid:any){
        try{

            await HandleRemoveBookmark(uid,setPosts,user)
        }
        catch(error){
            console.log(error)
        }
    }

    async function UnFollowUser(uid:number){
        try{
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            await HandleUnfollowUser(uid,setFollows,follows,user?.token)
        }
        catch(error){
            console.log(error)
        }
    }
    async function FollowUser(userData:any){
        try{
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            await HandleFollowUser(userData,setFollows,user?.token)
        }
        catch(error){
            console.log(error)
        }
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

    function ScrollToPost(){
        dynamicIndex && dynamicIndex.current.scrollToIndex({
            index:index,
            animated:true
        })
    }

    
        useEffect(() =>{
            GetPosts()
        },[])

        useEffect(() =>{
            try{
                ScrollToPost()
            }
            catch(error){
                console.log(error)
            }
        },[posts])
    
        useEffect(() =>{
            GetFollowers()
        },[posts])

        useEffect(() =>{
            socket.on("receiveComment", (data) =>{
                setPosts((prev:any) => prev.map((item:any) => item._id == data.postId ?{ 
                    ...item ,
                    comments:item.comments ? [...item.comments,data] :[data]} : item) )
                setActiveComments((prev) => [...prev,data])
            })
            return()=>{
                socket.off("receiveComment")
            }
        },[])

    return(
        <View style={styles.layout}>
            <View style={styles.container}>
                <Text style={[styles.textColor,{fontFamily:"Poppins-Bold",fontSize:25}]}>Posts</Text>
                <FlatList ref={dynamicIndex} initialScrollIndex={0} showsVerticalScrollIndicator={false} data={posts} renderItem={({item,index}) =>{
                        return(
                            <PostComponent item={item} index={index} follows={follows} unlikePost={unlikePost} UnFollowUser={UnFollowUser} openBottomSheet={OpenBottomSheet} LikePost={LikePost} FollowUser={FollowUser} toggleBottomSheet={toggleBottomSheet} AddBookmark={AddBookmark} RemoveBookmark={RemoveBookmark}/>
                        )
                }} onScrollToIndexFailed={(info) =>{
                    const wait = new Promise((resolve) => setTimeout(resolve,500))
                    wait.then(() =>{
                        dynamicIndex && dynamicIndex.current.scrollToIndex({
                            index,
                            animated:true
                        })
                    })
                }}/>
            </View>
            <CommentBottomSheet gesture={gesture} translateY={translateY} activeComments={activeComments} HandleCreateComment={HandleCreateComment} comment={comment} loading={loading} setComment={setComment}/>
            <ActionBottomSheet SheetGesture={SheetGesture} BlockUser={BlockUserController} follows={follows} blocked={blocked} actionTranslateY={actionSheetY} posts={posts} HandleFollowUser={FollowUser} HandleUnfollowUser={UnFollowUser} activePost={activePost} CloseBottomSheet={CloseBottomSheet} />

        </View>
    )
}
export default Page


const styles = StyleSheet.create({
    layout:{
        paddingTop:35,
        flex:1,
        backgroundColor:Colors.theme.backgroundColor,
        height:"100%"
    },
    container:{
        paddingHorizontal:20,
    },   
    contentScroller:{
        flexDirection:"row",
        marginVertical:5
    },
    homeHeader:{
        paddingHorizontal:20,
        marginBottom:15,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    profilePic:{
        width:65,
        height:65,
        borderRadius:50,
        objectFit:"cover",
        margin:2
    },
    posts:{
        backgroundColor:"#f2f2f2",
        padding:10,
        paddingVertical:15,
        borderRadius:5,
        marginBottom:25
    },
    postHeader:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    postsContainer:{
        paddingHorizontal:20,
        marginVertical:15
    },
    imageCont:{
        marginVertical:10
    },
    bottomSheet:{
        position:"absolute",
        width:SCREEN_WIDTH,
        backgroundColor:"#ffffffff",
        height:SCREEN_HEIGHT,
        top:SCREEN_HEIGHT,
        borderRadius:25,
        shadowColor:"#000",
        elevation:10,
        zIndex:1
    },interactions:{
        marginTop:5,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    icons:{
        flexDirection:"row",
        alignItems:"center",
        marginHorizontal:5
    },
    headerIcon:{
        margin:5,
        backgroundColor:"#ebe6e6",
        width:35,
        height:35,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:50
    },
    iconsText:{
        fontFamily:'Poppins-Light',
        marginHorizontal:5
    },
    line:{
        width:75,
        height:4,
        backgroundColor:"#000",
        alignSelf:"center",
        borderRadius:10,
        marginVertical:10
    },
    sheetLayout:{
        paddingVertical:5,
        paddingHorizontal:20
    },
    video:{
        width:100,
        height:100
    },
    textColor:{
        color:Colors.theme.fontColor
    }
})