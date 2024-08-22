import { rootStore } from "@/app/redux/store"
import { ipAddress } from "@/constants/ipAddress"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { View  , Dimensions, FlatList,Text, StyleSheet,TouchableOpacity} from "react-native"
import { useSelector, UseSelector } from "react-redux"
import PostComponent from "./postComponent"
import * as Haptics from "expo-haptics"
import Animated,{ useSharedValue,withSpring,useDerivedValue,useAnimatedStyle,useAnimatedReaction,runOnJS} from "react-native-reanimated"
import { Gesture,GestureDetector} from "react-native-gesture-handler"
import { router } from "expo-router"
import { AntDesign,Entypo,MaterialIcons,MaterialCommunityIcons } from "@expo/vector-icons"

function SearchPosts({searchParam}){
    const user = useSelector((state:rootStore)=>state.user.user)
    const [postData,  setPostData] = useState([])
    const [followCount,  setFollowCount] = useState([0])
    const [follows, setFollows] = useState([])
    const [posts, setPosts] = useState([])
    const [activatePost, setActivePost] = useState(0)
    const [activateBottomPost, setActiveBottomPost] = useState(0)
    const  [activeComments, setActiveComments] = useState([])
    const [isSheetOpened, setIsSheetOpened] = useState(false)
    const [bottomSheetOpened, setBottomSheetOpened] = useState(false)
    const [sheetOpened,setSheetOpened] = useState(false)
    const offSet = useSharedValue(0)
    const {width:SCREEN_WIDTH, height:SCREEN_HEIGHT} = Dimensions.get('window')
    const translateY = useSharedValue(SCREEN_HEIGHT)
    const context = useSharedValue(0)
    const isSheetOpenedDerived = useDerivedValue(() => translateY.value < -SCREEN_HEIGHT / 3)
    const isBottomSheetOpened = useDerivedValue(() => offSet.value == 0 )

    const SheetGesture = Gesture.Pan().onStart((event) =>{
        context.value = event.translationY
    }).onUpdate((event) =>{
        translateY.value = event.translationY + context.value
        translateY.value = Math.max(translateY.value , -SCREEN_HEIGHT/30)  
    }).onEnd((event) =>{
        if(translateY.value < SCREEN_HEIGHT/8){
            translateY.value = withSpring(0, {damping:50})
        }
        else{
            runOnJS(CloseBottomSheet)()
        }
    })


    async function GetSearchPost(){
        if(searchParam){
            const response = await axios.get(`http://${ipAddress}:3001/posts/search?title=${searchParam}`,{
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            })
            setPostData(response.data.findPost)
        }
    }

    useEffect(()=> {
        GetSearchPost()
    },[searchParam])

    // const toggleBottomSheet = async(id) =>{
    //     setActivePost(id)
    //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    //     if(isSheetOpened){
    //         translateY.value = withSpring(0,{damping:50})
    //     }
    //     else{
    //         translateY.value = withSpring(-SCREEN_HEIGHT+50,{damping:50})
    //         const findPosts = posts && posts.find((item) => item._id === id)
    //         if(findPosts){
    //             setActiveComments(findPosts.comments ? findPosts.comments : [])
    //         }
    //         else{
    //             setActiveComments([])
    //             return
    //         }
    //     }
    // }
    
      const sheetStyle = useAnimatedStyle(() =>{
        return{
            transform:[{translateY:translateY.value}]
        }
    })


    async function CreateComment(){
        const data = {"message":comment}
        const response = await axios.post(`http://${ipAddress}:3001/posts/add-comment/${activePost}`,data,{
            headers:{
                Authorization: `Bearer ${user.token}`
            }
        })
    }
    async function UnFollowUser(uid){
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        const response = await axios.delete(`http://${ipAddress}:3001/users/remove-follower/${uid}`,{
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        })

        setFollowCount((prev) => [...prev,1])
    }
    async function FollowUser(uid){
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        try{
            const response = await axios.post(`http://${ipAddress}:3001/users/add-follower/${uid}`,null,{
                headers:{
                    Authorization:`Bearer ${user.token}`
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
        useEffect(() =>{
            GetFollowers()
        },[])

        function CloseBottomSheet(){
            setSheetOpened(false)
            translateY.value = withSpring(SCREEN_HEIGHT, {damping:50})
        }
    
        function OpenBottomSheet(){
            setSheetOpened(true)
            translateY.value = withSpring(-200, {damping:50})
        }

    return(
        <View>
            <TouchableOpacity onPress={() =>CloseBottomSheet()} style={{backgroundColor:"#000",display:sheetOpened ?"flex" : "none",width:'100%',height:Dimensions.get('window').height,opacity:0.5,position:"absolute",left:0,top:0,zIndex:1}}></TouchableOpacity>
            <FlatList data={postData} renderItem={({item}) => {
                return(
                    <View style={{paddingHorizontal:25}}>
                        <PostComponent item={item} LikePost={LikePost} unlikePost={unlikePost} follows={follows} FollowUser={FollowUser} UnFollowUser={UnFollowUser} openBottomSheet={OpenBottomSheet} setActiveBottomPost={setActiveBottomPost}/> 

                    </View>
                )
            }}/>
                 <GestureDetector gesture={SheetGesture}>
                    <Animated.View style={[sheetStyle,{position:"absolute",backgroundColor:"#fff",zIndex:2,borderRadius:10,width:"90%",bottom:10,alignSelf:"center"}]}>
                        <View style={{width:15,borderRadius:50,height:3,backgroundColor:"#ccc",alignSelf:"center",marginTop:10}}></View>
                        <View style={{paddingHorizontal:20,paddingVertical:15}}>
                            <View style={{marginVertical:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                                <Text style={{fontFamily:"Poppins-Bold",fontSize:20}}>Ranvin Wick</Text>
                                <TouchableOpacity onPress={CloseBottomSheet}>
                                    <AntDesign name="closecircleo" size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.sheetOption} onPress={() => router.push({pathname:`/viewProfile/${id}`,params:{id}})}>
                                <Text style={styles.bottomSheetText}>View Profile</Text>
                                <MaterialCommunityIcons name="face-man-outline" size={20} color="black" style={{marginBottom:3}}  />

                            </TouchableOpacity>
                            <View style={styles.sheetOption}>
                                <Text style={styles.bottomSheetText}>Block</Text>
                                <Entypo name="block" size={18} color="black" />
                            </View>
                            <View style={styles.sheetOption}>
                                <Text style={styles.bottomSheetText}>Archive</Text>
                                <Entypo name="archive" size={18} color="black" />
                            </View>
                            <View style={styles.sheetOption}>
                                <Text style={styles.bottomSheetText}>Report</Text>
                                <MaterialIcons name="report-gmailerrorred" size={20} color="black" />
                            </View>
                        </View>
                    </Animated.View>
                </GestureDetector>

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