import { View,Text, StyleSheet, StatusBar,Image, FlatList ,TextInput, TouchableOpacity ,ScrollView , RefreshControl, Dimensions,ImageBackground} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { router } from "expo-router";
import axios from "axios";
import { useEffect, useState,useCallback, useRef  } from "react";
import { Audio } from 'expo-av';
import { Gesture, GestureDetector, GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler"
import Animated , { useAnimatedStyle, useSharedValue, withSpring,scrollTo, useDerivedValue, useAnimatedReaction, runOnJS, withTiming, withRepeat, withSequence, Easing} from "react-native-reanimated";
import { io, Socket } from "socket.io-client";
import * as Haptics from "expo-haptics"
import { CameraView , useCameraPermissions } from "expo-camera"
import  {Video,ResizeMode} from  'expo-av'
import React from "react";
import * as ImagePicker from "expo-image-picker"
import AsyncStorage from '@react-native-async-storage/async-storage';


import { ipAddress } from "@/constants/ipAddress";
import { rootStore } from "../redux/store";
import { Colors } from "@/constants/Colors";
import PostComponent from "@/components/postComponent";
import { CreateComment, FollowUser, LikePost, UnFollowUser, UnlikePost } from "@/components/CallBacks/CallBackFunctions";
import { setOpened } from "../redux/navbarSlice";

// Icon Packs
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons,EvilIcons } from '@expo/vector-icons';
import StoriesComp from "@/components/storiesComp";

const {height : SCREEN_HEIGHT , width : SCREEN_WIDTH} = Dimensions.get('window')
export default function Home(){
    const socket = io(`http://${ipAddress}:3001`)
    const dispatch = useDispatch()
    const user = useSelector((state:rootStore)=>state.user)
    const translateY = useSharedValue(0)
    const context = useSharedValue({y:0})
    const [posts,setPosts] = useState([])
    const [comment,setComment] = useState('')
    const [activePost,setActivePost] = useState(0)
    const [isSheetOpened,setIsSheetOpened] = useState(true)
    const isSheetOpenedDerived = useDerivedValue(() => translateY.value < -SCREEN_HEIGHT / 3)
    const [follows,setFollows] = useState([])
    const [refresh,setRefresh] = useState(false)
    const [dummyData,setDummyData] = useState(['Item 1'])
    const [followCount,setFollowCount] =  useState([0])
    const [activeComments,setActiveComments] = useState([]) 
    const [storyVisible,setStoryVisisble] = useState(false) 
    const [permission,requestPermission] = useCameraPermissions()
    const [stories, setStories] = useState([])
    const [storyMedia,setStoryMedia] = useState([])
    const [activeStory , setActiveStory] = useState(0)
    const [page,setPage]=  useState(1)
    const [contentLoading,setContentLoading] = useState(false)
    const scaleAnim = useSharedValue(0)
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
            translateY.value = withSpring(0,{damping:50})
        }
        else if(translateY.value < -SCREEN_HEIGHT/1.7){
            translateY.value = withSpring(-SCREEN_HEIGHT+50,{damping:50})
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
                Authorization:`Bearer ${user.user.token}`
            }
        }) 
        const newData = response.data.data
        setContentLoading(false)
        setPosts((prev) =>  [...prev,...newData])
    },[page,user.user.token])
    


    async function PlaySound(){
        const {sound}  = await Audio.Sound.createAsync(require('../../assets/videos/ding.mp3'))
        await sound.playAsync();
    }

    const toggleBottomSheet = async(id) =>{
        dispatch(setOpened(false))
        setActivePost(id)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        if(isSheetOpened){
            translateY.value = withSpring(0,{damping:50})
        }
        else{
            translateY.value = withSpring(-SCREEN_HEIGHT+50,{damping:50})
            const findPosts = posts && posts.find((item:any) => item._id === id)
            if(findPosts){
                setActiveComments(findPosts.comments ? findPosts.comments : [])
            }
            else{
                setActiveComments([])
                return
            }
        }
    }

    async function HandleFollowUser(uid:number){
        await FollowUser(uid,user,setFollowCount)
    }
    async function HandleUnfollowUser(uid:number){
        await UnFollowUser(uid,user,setFollowCount)
    }

    async function HandleLikePost(uid:number){
        await LikePost(uid,user,dummyData,setDummyData)
    }
    
    async function HandleUnLikePost(uid:number){
        await UnlikePost(uid,user,dummyData,setDummyData)
    }
    
    async function HandleCreateComment(){
        await CreateComment(activePost,user,comment)
    }

    const GetFollowers = useCallback(async () =>{
         const response = await axios.get(`http://${ipAddress}:3001/users/get-followers/${user.user.data._id}`,{
             headers:{
                 Authorization:`Bearer ${user.user.token}`
             }
         })
         setFollows(response.data)
     },[user.user.data._id, user.user.token])

    async function GetStories(){
        const response = await axios.get(`http://${ipAddress}:3001/snapshot/`,{
            headers:{
                Authorization: `Bearer ${user.user.token}`
            }
        })
        setStories(response.data.getSnapShots)
    }

    async function uploadSnapShot(uri,name,type){
        const formData = new FormData()
        formData.append('image',{
            uri,
            name,
            type
        })
        const response = await axios.post(`http://${ipAddress}:3001/snapshot/create`,formData,{
            headers:{
                'Content-Type': 'multipart/form-data',
                Authorization:`Bearer ${user.user.token}`
            }
        })
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
        setTimeout(()=>{

            setStoryVisisble(false)
        },500)
    }
    const scaleUp = (index:number) =>{
        socket.emit("chatMessage","HEYS")
        setActiveStory(index)
        setStoryVisisble(true)
        scaleAnim.value = withTiming(1,{duration:200})
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

    
        useEffect(() =>{
            GetStories()
        },[dummyData])
    
        useEffect(()=>{
            GetFollowers()
        },[followCount,GetFollowers])
    
        useEffect(()=>{
            getPosts()
        },[dummyData])
    


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
                <Text style={{fontFamily:"PlaywriteSK-Regular",fontSize:25, color:"#d92b68"}}>Fleexy</Text>
            </TouchableOpacity>
            <View style={{flexDirection:"row"}}>
                <TouchableOpacity style={styles.headerIcon} onPress={() => router.push("/liked")}> 
                    <AntDesign name="hearto" size={20} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIcon} onPress={()=> router.push('/chats')}>
                    <AntDesign name="message1" size={20} color="black" />   
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

                    
                    {stories && stories.map((item,index)=>{
                        return(
                            <View key={index}>
                                <StoriesComp item={item} onPress={() => scaleUp(index)}/>
                            </View>
                        )
                    })}
            </View>
            </ScrollView>
              
            <View style={styles.postsContainer}>
                <FlatList data={posts} showsVerticalScrollIndicator={false} renderItem={({item}) =>{
                        return(
                         <PostComponent  item={item} follows={follows} UnFollowUser={HandleUnfollowUser} FollowUser={HandleFollowUser} unlikePost={HandleUnLikePost} LikePost={HandleLikePost} toggleBottomSheet={toggleBottomSheet}/>
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
                    <View style={{position:"relative"}}>
                        <ImageBackground source={{ uri : stories[activeStory].image}} style={{backgroundColor:"#ccc",width:SCREEN_WIDTH,justifyContent:"center",top:Dimensions.get('window').height/10,left:0,height:SCREEN_HEIGHT-150,zIndex:1,position:"relative"}}>                    
                            <View style={{position:"absolute",top:10,zIndex:1,flexDirection:"row", alignItems:"center",paddingHorizontal:10,justifyContent:"space-between",width:"100%"}}>
                                <View style={{flexDirection:"row",alignItems:"center"}}>
                                 {stories[activeStory].creator[0].profilePicture ? 
                                    <Image source={{uri:stories[activeStory].creator[0].profilePicture}} style={{width:50,height:50,borderRadius:50}}/>
                                                    :
                                    <Image source={require("../../assets/images/model.jpg")} style={{width:50,height:50,borderRadius:50}}/>
                                 }
                                    <Text style={{fontFamily:"Poppins-Bold",marginLeft:5,color:"#fff"}}>{stories[activeStory].creator[0].username}</Text>
                                </View>
                                <AntDesign name="closecircleo" size={24} color="#fff" onPress={scaleDown} />
                            </View>
                        </ImageBackground>
                    </View>
                </Animated.View>
        }
                
                    <GestureDetector gesture={gesture}>
                        <Animated.View style={[styles.bottomSheet,rBottomSheetStyle]}>
                            <View style={styles.line}></View>
                            <View style={styles.sheetLayout}>
                                <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                                    <View>
                                        <Text style={{fontFamily:"Poppins-Light",fontSize:18}}>Comments</Text>
                                    </View>
                                </View>
                                <View style={{justifyContent:"space-between",flexDirection:"column"}}>
                                    <View>

                                        {activeComments && activeComments.length>0?
                                        activeComments.map((item,index)=>{
                                            return(
                                                <View key={index} style={{marginVertical:10}}>
                                                    <View style={{flexDirection:"row",alignItems:"center"}}>
                                                        {item.profilePicture 
                                                                    ?
                                                        <Image source={{uri:item.profilePicture}} style={{width:50,height:50, borderRadius:50}}/>
                                                                    :

                                                        <Image source={require('../../assets/images/model.jpg')} style={{width:50,height:50, borderRadius:50}}/>
                                                    }
                                                        <View style={{marginHorizontal:5,height:20,justifyContent:"center"}}>
                                                            <Text style={{fontFamily:"Poppins-Bold"}}>Motion Rades</Text>
                                                            <Text style={{ fontFamily: "Poppins-Light" }}>{item.message}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        })
                                        :
                                        <View style={{alignItems:"center",justifyContent:"center",height:"70%"}}>
                                            <Text style={{fontFamily:"Poppins-Bold",fontSize:17}}>No Comments Were Found!</Text>
                                        </View>
                                        }
                                    </View>
                                </View>
                                </View>
                        </Animated.View>
                    </GestureDetector>
                                    {isSheetOpened &&
                    
                                        <View style={{position:"absolute",bottom:70,zIndex:1,backgroundColor:"#fff",width:SCREEN_WIDTH,padding:10,paddingHorizontal:20,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                                            <View style={{backgroundColor:"#f2f2f2",paddingVertical:10,borderRadius:5}}>
                                                <TextInput placeholder="Type Your Comment." style={{paddingHorizontal:5,fontFamily:"Poppins-Light",width:SCREEN_WIDTH/1.3}} onChangeText={(e) => setComment(e)}/>
                                            </View>
                                            <TouchableOpacity style={{backgroundColor:Colors.light.text,borderRadius:50,width:35,height:35,justifyContent:"center",alignItems:"center"}} onPress={HandleCreateComment}>
                                                <Ionicons name="send-outline" size={20} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    }
            </View>

    )
}


const styles = StyleSheet.create({
        container:{
            backgroundColor:"#fff",
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
            backgroundColor:"#000000ec",
            height:SCREEN_HEIGHT
        }
})