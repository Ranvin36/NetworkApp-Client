import { View,Text, StyleSheet, StatusBar,Image, FlatList ,TextInput, TouchableOpacity ,ScrollView , RefreshControl, Dimensions,ImageBackground, ToastAndroid} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { router } from "expo-router";
import axios from "axios";
import { useEffect, useState,useCallback, useRef  } from "react";
import { Audio } from 'expo-av';
import { Gesture } from "react-native-gesture-handler"
import Animated , { useAnimatedStyle, useSharedValue, withSpring, runOnJS, withTiming, withRepeat, withSequence, Easing} from "react-native-reanimated";
import { io } from "socket.io-client";
import * as Haptics from "expo-haptics"
import React from "react";
import * as ImagePicker from "expo-image-picker"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipAddress } from "@/constants/ipAddress";
import { rootStore } from "../redux/store";
import PostComponent from "@/components/postComponent";
import { CreateComment, FollowUser, LikePost, UnBlockUser, UnFollowUser, UnlikePost } from "@/components/CallBacks/CallBackFunctions";
import { setOpened } from "../redux/navbarSlice";

// Icon Packs
import { AntDesign,MaterialIcons,Entypo,Feather,Ionicons,EvilIcons,MaterialCommunityIcons} from '@expo/vector-icons';

//  Callback Functions
import StoriesComp from "@/components/storiesComp";
import { ColorPalatte } from "@/constants/Colors";
import CommentBottomSheet from "@/components/CommentBottomSheet";
import ActionBottomSheet from "@/components/ActionBottomSheet";
import { BlockUser } from "@/components/CallBacks/CallBackFunctions";



const Colors = ColorPalatte()
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

const {height : SCREEN_HEIGHT , width : SCREEN_WIDTH} = Dimensions.get('window')
export default function Home(){
    const socket = io(`http://${ipAddress}:3001`)
    const dispatch = useDispatch()
    const user = useSelector((state:rootStore)=>state.user)
    const translateY = useSharedValue(SCREEN_HEIGHT)
    const actionSheetY = useSharedValue(399)
    const context = useSharedValue({y:0})
    const actionContext = useSharedValue(0)
    const [posts,setPosts] = useState<PostTypes[]>([])
    const [comment,setComment] = useState('')
    let [activePost,setActivePost] = useState({index:0,id:0})
    const [isSheetOpened,setIsSheetOpened] = useState(false)
    const [loading,setLoading] = useState(false)
    const [follows,setFollows] = useState([])
    const [blocked,setBlocked] = useState([])
    const [refresh,setRefresh] = useState(false)
    const [dummyData,setDummyData] = useState(['Item 1'])
    const [activeComments,setActiveComments] = useState([]) 
    const [storyVisible,setStoryVisisble] = useState(false) 
    const [stories, setStories] = useState([])
    const [storyMedia,setStoryMedia] = useState([])
    const [activeStory , setActiveStory] = useState(0)
    const [activeClip , setActiveClip] = useState(0)
    const [page,setPage]=  useState(1)
    const [contentLoading,setContentLoading] = useState(false)
    const scaleAnim = useSharedValue(0)
    const lineWidth = useSharedValue(10)
    const snapsRef = useRef(0)

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

    function ViewProfile(id:number){
        router.push({ pathname: `viewProfile/${id}`, params: { id } });
    }

    const sheetStyle = useAnimatedStyle(() =>{
        return{
            transform:[{translateY:actionSheetY.value}]
        }
    })

    const Refresh = useCallback(()=>{
        setRefresh(true)
        setPage(1)
        setPosts([])
        setTimeout(()=>{
            setDummyData((prevData) => [...prevData, `Item ${dummyData.length+1}`]) 
            setRefresh(false)
        },2000)
    },[])

    const rBottomSheetStyle = useAnimatedStyle(() =>{
        return{
            transform : [{translateY: translateY.value}]
        }
    })

    const getPosts = useCallback(async() => {
        setContentLoading(true)
        const response = await axios.get(`http://${ipAddress}:3001/posts/get-posts?page=${page}`,{
            headers:{
                Authorization:`Bearer ${user?.user?.token}`
            }
        }) 
        const newData = response.data.data
        setContentLoading(false)
        setPosts((prev) =>  [...prev,...newData])
    },[page,user?.user?.token])
    
    function Reaction(){
        if(isSheetOpened){
            dispatch(setOpened(true))
        }
        else{
            dispatch(setOpened(false))
        }
    }
    async function PlaySound(){
        const {sound}  = await Audio.Sound.createAsync(require('../../assets/videos/ding.mp3'))
        await sound.playAsync();
    }

    async function HandleBlockUser(){
        const response = await axios.get(`http://${ipAddress}:3001/users/block`,{
            headers:{
                Authorization : `Bearer ${user?.user?.token}`
            }
        })

        setBlocked(response.data.findBlocked.blocked)
    }
    

    const toggleBottomSheet = async(index:number,id:number) =>{
        // dispatch(setOpened(false))
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
    async function HandleFollowUser(userData:any){
        const data  ={"_id":userData.creator_id, "name":userData.username,"profilePicture":userData.profilePicture}
        setFollows((follows:any) => [...follows,data])
        await FollowUser(userData.creator_id,user)
    }
    async function HandleUnfollowUser(uid:number){
        setFollows((follow:any) => follows.filter((item) =>{
            return item._id.toString() != uid.toString()
        }))
        await UnFollowUser(uid,user)
    }

    async function HandleLikePost(uid:number){
        const data = {"postId":uid , "userId":user?.user?.data._id}
        setPosts((prev) => prev.map((item) => item._id == data.postId ?{ 
                ...item ,
                likes:item.likes ? [...item.likes,data.userId] :[data.userId]} : item) )
        socket.emit("likePost",data)
        // await LikePost(uid,user,dummyData,setDummyData)
    }
    
    async function HandleUnLikePost(uid:number){
        const data = {"postId":uid , "userId":user?.user?.data._id}
        setPosts((prev:any) => prev.map((post:any) => post._id == data.postId?{
            ...post,
            likes:post.likes ? post.likes.filter((likes:number) => likes.toString() != data.userId) : null  

        }:post))
        socket.emit("unlikePost",data)
    }

    async function AddBookmark(uid:number){
        // const response = await axios.post(`http://${ipAddress}:3001/posts/bookmark/create/${uid}`,null,{
        //     headers:{
        //         Authorization : `Bearer ${user?.user?.token}`
        //     }
        // })
        const data = {"postId":uid , "userId":user?.user?.data._id}
        setPosts((prev) => prev.map((item) =>  item._id == data.postId ?{
            ...item,
            bookmarks: item.bookmarks ? [...item.bookmarks,data.userId] :[data.userId]} :  item))
        socket.emit("createBookmark",data)
    }
    
    async function RemoveBookmark(uid:number){
        // const response = await axios.post(`http://${ipAddress}:3001/posts/bookmark/delete/${uid}`,null,{
        //     headers:{
        //         Authorization: `Bearer ${user?.user?.token}`
        //     }
        // })
        const data ={"postId" : uid  , "userId":user?.user?.data._id}
        setPosts((prev:any) => prev.map((post:any) => post._id == data.postId?{
            ...post,
             bookmarks:post.bookmarks ? post.bookmarks.filter((likes:number) => likes.toString()!= data.userId) : null  
         }:post))
        socket.emit("removeBookmark",data)
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

    const GetFollowers = useCallback(async () =>{
         const response = await axios.get(`http://${ipAddress}:3001/users/get-followers/${user?.user?.data._id}`,{
             headers:{
                 Authorization:`Bearer ${user?.user?.token}`
             }
         })
         setFollows(response.data[0].followersDetails)
     },[user?.user?.data._id, user?.user?.token,Refresh])

    async function GetStories(){
        const response = await axios.get(`http://${ipAddress}:3001/snapshot/`,{
            headers:{
                Authorization: `Bearer ${user?.user?.token}`
            }
        })
        setStories(response.data.getSnapShots)
    }

    async function uploadSnapShot(uri:string,name:string,type:string){
        const formData = new FormData()
        formData.append('image',{
            uri,
            name,
            type
        })
        ToastAndroid.show("Uploading snapshot", ToastAndroid.SHORT)
        const response = await axios.post(`http://${ipAddress}:3001/snapshot/create`,formData,{
            headers:{
                'Content-Type': 'multipart/form-data',
                Authorization:`Bearer ${user?.user?.token}`
            }
        })
        ToastAndroid.show("Snapshot Uploaded Succesfully", ToastAndroid.SHORT)
        console.log(response.data)
    }

    async function OpenLibrary(){
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1
        })

        console.log(result.assets)
        const uri = result.assets && result.assets[0].uri
        const name = result.assets && result.assets[0].fileName
        const type = result.assets && result.assets[0].mimeType
        setStoryMedia({
            uri,
            name,
            type
        })
        uploadSnapShot(uri,name,type)
    }

   const scaleDown = () =>{
        scaleAnim.value = withTiming(0,{duration:200})
        dispatch(setOpened(false))
        setTimeout(()=>{
            setStoryVisisble(false)
        },500)
    }
    const scaleUp = (index:number) =>{
        setActiveStory(index)
        setActiveClip(0)
        setStoryVisisble(true)
        scaleAnim.value = withTiming(1,{duration:200})
        dispatch(setOpened(true))
   }

    const interpolateScale = useAnimatedStyle(()=>{
        return{
            transform:[{scale:scaleAnim.value}]
        }

    })
    
    function isCloseToBottom({layoutMeasurement, contentOffset, contentSize}){
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
    }   
    
        const rotateSpinner = useAnimatedStyle(() =>{
            return{
                transform:[{
                    rotate: withRepeat(
                            withTiming(360+'deg',{duration:1000, easing: Easing.linear}),-1)
                    
                }]
            }
        })

        async function GetLocalStorageUser(){
            const getUser = await AsyncStorage.getItem('user')
            return getUser != null ? JSON.parse(getUser) : null;
        }

        const completionLineAnimation = useAnimatedStyle(() =>{
            return{
                width: lineWidth.value
            }
        },[activeStory])
        function handleNextStory(){
            const totalClips = stories[activeStory]?.snaps.length -1
            if(activeClip < totalClips){
                // setActiveStory((prev) => prev+1)
                setActiveClip((prev)=>prev+1)
                snapsRef.current?.scrollToIndex({
                    index: activeClip+1,
                    animated: true,
                    useNativeDriver: true
                })
            }

            else if(activeStory < stories.length-1){
                setActiveStory((prev) => prev+1)
                setActiveClip(0)
                snapsRef.current?.scrollToIndex({
                    index: 0,
                    animated: true,
                    useNativeDriver: true
                })
            }

            else{
                scaleDown()
            }
        }

        function CloseBottomSheet(){
            // setActionSheet(false)
            dispatch(setOpened(false))
            actionSheetY.value = withSpring(SCREEN_HEIGHT, {damping:50})
        }
        function OpenBottomSheet(index:number , id:number){
            dispatch(setOpened(true))
            setActivePost({index:index,id})
            actionSheetY.value = withSpring(0, {damping:50})
        }

    
        useEffect(() =>{
            GetStories()
        },[dummyData])
        
        useEffect(()=>{
            GetFollowers()
        },[GetFollowers])
        
        useEffect(()=>{
            getPosts()
        },[dummyData])
        useEffect(() =>{
            lineWidth.value=0
            lineWidth.value = withTiming(140/2  ,{duration:9000},(isFinished) =>{
                if(isFinished){
                    runOnJS(handleNextStory)()
                }
            })

        },[storyVisible,activeStory,activeClip])

        
    async function BlockUserController(creator:any){
        try{
            const data ={"_id":creator._id,"profilePicture":creator.profilePicture,"userId":creator.creator_id[0],"userName":creator.username}
            const response = await BlockUser(creator.creator_id,user?.user?.token)
            ToastAndroid.show("User Blocked Successfully" ,ToastAndroid.SHORT)
            setBlocked((prev) => [...prev,data])
        }
        catch(error){
            console.log(error)
        }
    }
    
    async function UnBlockController(id:any){
        try{
            const response = await UnBlockUser(id,user?.user?.token)
            ToastAndroid.show("User Unblocked Successfully" ,ToastAndroid.SHORT)
            setBlocked((prev) => prev.filter((item) =>{
                item.userId.toString() != id.toString()
            }))
        }
        catch(error){
            console.log(error)
        }
    }
    

        // useEffect(() =>{
        //     socket.on("receivePost" , (data) =>{
        //         setPosts((prev) => prev.map((item) => item._id == data.postId ?{ 
        //         ...item ,
        //         likes:item.likes ? [...item.likes,data.userId] :[data.userId]} : item) )
        //     })
        //     return () =>{
        //         socket.off("receivePost")
        //     }
        // },[])

        // useEffect(() =>{
        //     socket.on("receiveBookmark" , (data)=>{
        //         setPosts((prev) => prev.map((item) =>  item._id == data.postId ?{
        //         ...item,
        //         bookmarks: item.bookmarks ? [...item.bookmarks,data.userId] :[data.userId]} :  item))
        //     })

        //     return () =>{
        //         socket.off("receiveBookmark")
        //     }


        // },[])

        // useEffect(() => {
        //     socket.on("receiveUnlikedPost" , (data) =>{
        //         setPosts((prev:any) => prev.map((post:any) => post._id == data.postId?{
        //             ...post,
        //             likes:post.likes ? post.likes.filter((likes:number) => likes.toString() != data.userId) : null  

        //         }:post))
        //     })
        //     return() =>{
        //         socket.off("receiveUnlikedPost")
        //     }
        // },[])

        useEffect(() =>{
            socket.on("receiveComment", (data) =>{
                setPosts((prev) => prev.map((item) => item._id == data.postId ?{ 
                    ...item ,
                    comments:item.comments ? [...item.comments,data] :[data]} : item) )
                setActiveComments((prev) => [...prev,data])
            })
            return()=>{
                socket.off("receiveComment")
            }
        },[])

        // useEffect(() =>{
        //     socket.on("receiveRemoveBookmark"  , (data) =>{
        //         setPosts((prev:any) => prev.map((post:any) => post._id == data.postId?{
        //            ...post,
        //             bookmarks:post.bookmarks ? post.bookmarks.filter((likes:number) => likes.toString()!= data.userId) : null  
        //         }:post))
        //     })

        //     return()=>[
        //         socket.off("receiveRemoveBookmark")
        //     ]
        // },[])

        useEffect(() =>{
            Reaction()
        },[isSheetOpened])

        useEffect(() =>{
            HandleBlockUser()
        },[contentLoading])

    return(
        <View>
        <ScrollView style={styles.container} onScroll={({nativeEvent}) =>{
            if(isCloseToBottom(nativeEvent)){
                setPage((prev)=> prev+1)
                getPosts()
            }
        }}  showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={Refresh}/>
            }
            
        >
        <StatusBar barStyle="dark-content" />
        <View style={styles.homeHeader}>
            <TouchableOpacity>
                <Text style={{fontFamily:"PlaywriteSK-Regular",fontSize:27, color:"#d92b68"}}>Fleexy</Text>
            </TouchableOpacity>
            <View style={{flexDirection:"row"}}>
                <TouchableOpacity style={styles.headerIcon} onPress={() => router.push("/notifications")}> 
                    <Ionicons name="notifications-outline" size={23} color={Colors.theme.fontColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIcon} onPress={()=> router.push('/chats')}>
                    <AntDesign name="message1" size={20} color={Colors.theme.fontColor} />   
                </TouchableOpacity>
            </View>
        </View>
        <View style={{marginBottom:90}}>
        <ScrollView  horizontal style={{paddingLeft:20}} showsHorizontalScrollIndicator={false}>
            <View style={styles.contentScroller}>
                <TouchableOpacity onPress={OpenLibrary}>
                    <View style={{backgroundColor:"#d92b68",
                                    width:65,
                                    height:65,
                                    borderRadius:50,
                                    justifyContent:"center",
                                    alignItems:"center"
                    }}>
                        <AntDesign name="plus" size={24} color="#fff" />
                    </View>

                </TouchableOpacity>

                    <FlatList data={stories} horizontal renderItem={({item,index}) =>{
                        return(
                            <View key={index}>
                                <StoriesComp item={item} onPress={() => scaleUp(index)}/>
                            </View>
                        )
                    }}/>                    
                    
            </View>
            </ScrollView>
              
            <View style={styles.postsContainer}>
                <FlatList data={posts} showsVerticalScrollIndicator={false} renderItem={({item,index}) =>{
                        return(
                         <PostComponent  item={item} index={index} openBottomSheet={OpenBottomSheet} follows={follows} UnFollowUser={HandleUnfollowUser} FollowUser={HandleFollowUser} unlikePost={HandleUnLikePost} LikePost={HandleLikePost} toggleBottomSheet={toggleBottomSheet} AddBookmark={AddBookmark} RemoveBookmark={RemoveBookmark}/>
                        )
                }}/>
                {contentLoading 
                    &&                    
                    <Animated.View style={[{paddingBottom:30,alignItems:"center"},rotateSpinner]}>
                        <EvilIcons name="spinner-3" size={47} color="black" />
                    </Animated.View>
                }


            </View>
        </View>
        </ScrollView>
        {storyVisible && 
            
                <Animated.View style={[styles.snapShotLayout,interpolateScale]}>
                    <View style={styles.snapheader}>
                        <TouchableOpacity style={[styles.storySection,styles.closeBtn]} onPress={scaleDown}> 
                            <Ionicons name="close-outline" size={24} color={Colors.theme.fontColor}  />
                        </TouchableOpacity>
                        <View style={[styles.storySection,{flexDirection:"row"}]}>
                            <View style={styles.lineContainer}>
                                  {stories.length>0 && stories[activeStory].snaps.map((story:any,index:number) =>{
                                   
                                    return(                                        
                                            <View style={[styles.storyLine,{width:140/stories[activeStory].snaps.length}]} key={index}>           
                                                <Animated.View style={[styles.completionLine,activeClip>=index? completionLineAnimation : null,{maxWidth:140/stories[activeStory].snaps.length}]}></Animated.View>  
                                            </View>
                                    )
                                    })} 
                            </View>
                        </View>
                        <View style={[styles.storySection,styles.storyClock]}>
                            <View style={{marginRight:5}}>
                                <MaterialCommunityIcons name="clock-time-eight-outline" size={20} color={Colors.theme.fontColor} />
                            </View>
                            <View>
                                <Text style={{color:Colors.theme.fontColor,fontFamily:"Poppins-Light",fontSize:13}}>7s</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={{borderWidth:2,borderColor:Colors.theme.primary,borderRadius:50}} onPress={() =>ViewProfile(stories[activeStory].creator[0].creator_id)}>
                            {stories[activeStory].creator[0].profilePicture ? 
                            <Image source={{uri:stories[activeStory].creator[0].profilePicture}} style={{width:40,height:40,margin:2,borderRadius:50}}/>
                                            :
                            <Image source={require("../../assets/images/model.jpg")} style={{width:40,height:40,margin:2,borderRadius:50}}/>
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.storyContent}>
                        <FlatList ref={snapsRef} data={stories[activeStory].snaps} keyExtractor={(item) =>item} onMomentumScrollEnd={(e) => {
                            const offset = Math.round(e.nativeEvent.contentOffset.x/SCREEN_WIDTH)
                            setActiveClip(offset)
                        }}  horizontal pagingEnabled renderItem={({item,index})  =>{
                            
                            return(
                                    <View style={{width:Dimensions.get('window').width-20}}>
                                            <Image source={{uri: item.image}} style={{width:"100%",height:500,borderRadius:30}} />
                                            <View style={{marginVertical:10}}>
                                                <Text style={{fontFamily:"Poppins-Light",color:"#fff"}}>Introducing Our New Beveraging Partner "Eluphant Housy"</Text>
                                            </View>
                                    </View>
                            )
                        }}/>
                        
                    </View>

                </Animated.View>
        }
                
                    <CommentBottomSheet gesture={gesture} translateY={translateY} activeComments={activeComments} isSheetOpened={isSheetOpened} HandleCreateComment={HandleCreateComment} comment={comment} loading={loading} setComment={setComment}/>
                                
                <ActionBottomSheet SheetGesture={SheetGesture} BlockUser={BlockUserController} UnblockUser={UnBlockController} CloseBottomSheet={CloseBottomSheet} posts={posts} actionTranslateY={actionSheetY} activePost={activePost} blocked={blocked} follows={follows} HandleFollowUser={HandleFollowUser} HandleUnfollowUser={HandleUnfollowUser}/>
            </View>

    )
}


const styles = StyleSheet.create({
        container:{
            backgroundColor:Colors.theme.backgroundColor,
            height:"100%",
            paddingTop:40,
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
        posts:{
            backgroundColor:"#efefef",
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
            marginVertical:10
        },
        imageCont:{
            marginVertical:10
        }
        ,interactions:{
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
            backgroundColor:Colors.theme.backgroundTransparent,
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
        bottomSheet:{
            position:"absolute",
            width:SCREEN_WIDTH,
            backgroundColor:Colors.theme.commentsBg,
            height:SCREEN_HEIGHT,
            top:SCREEN_HEIGHT,
            borderRadius:25,
            shadowColor:"#000",
            elevation:10,
            zIndex:1
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
        snapShotLayout:{
            position:"absolute",
            width:SCREEN_WIDTH,
            borderRadius:20,
            top:0,
            left:0,
            backgroundColor:"#000",
            height:"100%",
        },
        textColor:{
            color:Colors.theme.fontColor
        },
        snapheader:{
            paddingHorizontal:10,
            paddingVertical:40,
            flexDirection:"row",
            alignItems:"center",
            width:SCREEN_WIDTH
        },
        storyLine:{
            width:140,
            height:2,
            backgroundColor: "#1d1d1d",
            borderRadius:20,
            marginRight:5
        },
        storySection:{
            marginHorizontal:7
        },
        closeBtn:{
            backgroundColor:Colors.theme.backgroundTransparent,
            padding:5,borderRadius:50
        },
        storyClock:{
            backgroundColor:Colors.theme.backgroundTransparent,
            flexDirection:"row",
            borderRadius:20,
            paddingVertical:8,
            paddingHorizontal:10,
            alignItems:"center"
        },
        storyContent:{
            marginTop:-10,
            marginHorizontal:10,
            flexDirection:"row",
            alignItems:"center",
            justifyContent:"center",
            alignSelf:"center"
        },
        completionLine:{
            position:"absolute",
            height:2,
            borderRadius:20,
            backgroundColor:"#fff"
        },
        lineContainer:{
            flexDirection:"row"
        },    
        bottomSheetText:{
            fontFamily:"Poppins-Light",
            color:Colors.theme.fontColor
        },
        sheetOption:{
            marginVertical:2,
            flexDirection:"row",
            justifyContent:"space-between"
        },
})