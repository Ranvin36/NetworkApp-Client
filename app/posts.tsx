import axios from "axios"
import { useEffect, useState } from "react"
import { View , Text, StyleSheet,TouchableOpacity,Image, FlatList,Dimensions,TextInput} from "react-native"
import { Video,ResizeMode } from "expo-av"
import { useSelector } from "react-redux"
import { rootStore } from "./redux/store"
import { ipAddress } from "@/constants/ipAddress"
import { AntDesign,Entypo,Ionicons,Feather} from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"
import { router } from "expo-router"
import Animated,{useSharedValue,withTiming,withSpring, useAnimatedStyle,useAnimatedReaction, useDerivedValue,runOnJS} from "react-native-reanimated"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import * as Haptics from 'expo-haptics'
import PostComponent from "@/components/postComponent"
const {width:SCREEN_WIDTH, height:SCREEN_HEIGHT} = Dimensions.get('window')

function Posts(){
    const user = useSelector((state:rootStore)=>state.user.user)
    const translateY = useSharedValue(0)
    const context = useSharedValue({y:0})
    const [posts,setPosts] = useState([])
    const [comment,setComment] = useState('')
    const [activePost,setActivePost] = useState()
    const [isSheetOpened,setIsSheetOpened] = useState(true)
    const isSheetOpenedDerived = useDerivedValue(() => translateY.value < -SCREEN_HEIGHT / 3)
    const [follows,setFollows] = useState([])
    const [refresh,setRefresh] = useState(false)
    const [dummyData,setDummyData] = useState(['Item 1'])
    const [followCount,setFollowCount] =  useState([0])
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
            translateY.value = withSpring(0,{damping:50})
        }
        else if(translateY.value < -SCREEN_HEIGHT/1.7){
            translateY.value = withSpring(-SCREEN_HEIGHT+50,{damping:50})
        }
    })

    async function GetPosts(){
        const response = await axios.get(`http://${ipAddress}:3001/posts/${user.data._id}`,{
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        })

        setPosts(response.data.data)
    }
    
    
    async function GetFollowers(){
        const response = await axios.get(`http://${ipAddress}:3001/users/get-followers/${user.data._id}`,{
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        })
        setFollows(response.data)
    }
    async function LikePost(uid){
        const response = await axios.post(`http://${ipAddress}:3001/posts/like-posts/${uid}`,null,{
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        })

    }
    async function unlikePost(uid){
        const response = await axios.post(`http://${ipAddress}:3001/posts/unlike-posts/${uid}`,null,{
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        })
    }

    const rBottomSheetStyle = useAnimatedStyle(()=>{
        return{
            transform:[{translateY:translateY.value}]
        }
    })

    
    function ViewProfile(id){
        router.push({ pathname: `viewProfile/${id}`, params: { id } });
    }

    const toggleBottomSheet = async(id) =>{
        setActivePost(id)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        if(isSheetOpened){
            translateY.value = withSpring(0,{damping:50})
        }
        else{
            translateY.value = withSpring(-SCREEN_HEIGHT+50,{damping:50})
            const findPosts = posts && posts.find((item) => item._id === id)
            if(findPosts){
                setActiveComments(findPosts.comments ? findPosts.comments : [])
            }
            else{
                setActiveComments([])
                return
            }
        }
    }

    async function CreateComment(){
        const data = {"message":comment}
        const response = await axios.post(`http://${ipAddress}:3001/posts/add-comment/${activePost}`,data,{
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
    }

    
        useEffect(() =>{
            GetPosts()
        },[])
    
        useEffect(() =>{
            GetFollowers()
        },[])

    return(
        <View style={styles.container}>
            <Text style={{fontFamily:"Poppins-Bold",fontSize:25}}>Posts</Text>
            <FlatList showsVerticalScrollIndicator={false} data={posts} renderItem={({item}) =>{
                    const creatorImage = item.creator[0].profilePicture
                    const imgUrl = item.image
                    const videoUrl = item.video
                    const like = item.likes
                    const comments  = item.comments
                    const ifFollowing = follows && follows.filter((followItem) => followItem?.following[0]?._id == item.creator[0]?.creator_id)
                    const ifLiked = like && like.filter((liked) => liked == user.data._id)
                    return(
                        <PostComponent item={item} follows={follows} unlikePost={unlikePost} UnFollowUser={UnFollowUser} toggleBottomSheet={toggleBottomSheet} LikePost={LikePost} FollowUser={FollowUser}/>
                    )
            }}/>
            <View>
                
            </View>
             <GestureDetector gesture={gesture}>
                        <Animated.View style={[styles.bottomSheet,rBottomSheetStyle,{display: isSheetOpened ? "flex" :"none" }]}>
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

                                                        <Image source={require('../assets/images/model.jpg')} style={{width:50,height:50, borderRadius:50}}/>
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
                    
                                        <View style={{position:"absolute",bottom:SCREEN_HEIGHT/20,zIndex:1,backgroundColor:"#fff",width:SCREEN_WIDTH,padding:10,paddingHorizontal:20,flexDirection:"row",justifyContent:"space-between",alignItems:"center",elevation:1,shadowColor:"#000"}}>
                                            <View style={{backgroundColor:"#f2f2f2",paddingVertical:10,borderRadius:5}}>
                                                <TextInput placeholder="Type Your Comment." style={{paddingHorizontal:5,fontFamily:"Poppins-Light",width:SCREEN_WIDTH/1.3}} onChangeText={(e) => setComment(e)}/>
                                            </View>
                                            <TouchableOpacity style={{backgroundColor:Colors.light.text,borderRadius:50,width:35,height:35,justifyContent:"center",alignItems:"center"}} onPress={CreateComment}>
                                                <Ionicons name="send-outline" size={20} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    }

        </View>
    )
}
export default Posts


const styles = StyleSheet.create({
    container:{
        paddingHorizontal:20,
        paddingVertical:45,
        flex:1,
        backgroundColor:"#fff",
        height:"100%"
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
    }
})