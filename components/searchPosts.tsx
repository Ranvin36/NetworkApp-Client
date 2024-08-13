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
// import  {GetFollowers} from  "../requests/userRequests"

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
    const [bottomSheetOpened, setBottomSheetOpened] = useState(true)
    const translateY = useSharedValue(0)
    const offSet = useSharedValue(0)
    const {width:SCREEN_WIDTH, height:SCREEN_HEIGHT} = Dimensions.get('window')
    const context = useSharedValue(0)
    const isSheetOpenedDerived = useDerivedValue(() => translateY.value < -SCREEN_HEIGHT / 3)
    const isBottomSheetOpened = useDerivedValue(() => offSet.value == 0 )

    console.log("POST ID" , activateBottomPost)
    const SheetGesture = Gesture.Pan().onStart((event) =>{
        context.value = offSet.value
    }).onUpdate((event) =>{
        offSet.value = event.translationY + context.value
        offSet.value = Math.max(offSet.value , -SCREEN_HEIGHT/10)
    }).onEnd((event) =>{
        if(offSet.value > -SCREEN_HEIGHT/30){
            offSet.value=withSpring(SCREEN_HEIGHT , {damping:50})
        }
        else if(offSet.value > -SCREEN_HEIGHT/20){
            offSet.value=withSpring(0 , {damping:50})
        }
        if(offSet.value < -SCREEN_HEIGHT/30){
            offSet.value=withSpring(0 , {damping:50})
        }
    })

    
    useAnimatedReaction(() => isBottomSheetOpened.value,
    (isOpen) =>{
        runOnJS(setBottomSheetOpened)(isOpen)
    }
  )


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
    function openBottomSheet(){
        if(bottomSheetOpened){
            offSet.value=withSpring(SCREEN_HEIGHT , {damping:50})
        }
        else{
          offSet.value=withSpring(0 , {damping:50})
    
        }    
      }
    
      const animateBottomSheet = useAnimatedStyle(() =>{
        return{
          transform: [{translateY:offSet.value}]
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

    return(
        <View>
            <FlatList data={postData} renderItem={({item}) => {
                return(
                    <View>
                        <PostComponent item={item} LikePost={LikePost} unlikePost={unlikePost} follows={follows} FollowUser={FollowUser} UnFollowUser={UnFollowUser} toggleBottomSheet={toggleBottomSheet} openBottomSheet={openBottomSheet} setActiveBottomPost={setActiveBottomPost}/> 

                    </View>
                )
            }}/>
            <GestureDetector gesture={SheetGesture}>
              <Animated.View style={[styles.bottomSheet,animateBottomSheet]}>
                        <View style={{width:30,borderRadius:20,height:3,backgroundColor:"#ccc",alignSelf:"center",marginTop:20}}></View>
                        <View style={styles.bottomSheetLayout}>
                          <TouchableOpacity style={styles.textWrap} onPress={() => router.push({pathname:`/editPost/${activateBottomPost}` ,params:{id:activateBottomPost}})}>
                            <Text style={styles.bottomSheetText}>Edit</Text>
                          </TouchableOpacity>
                          <View style={styles.textWrap}>
                            <Text style={styles.bottomSheetText}>Block</Text>
                          </View>
                          <View style={styles.textWrap}>
                            <Text style={styles.bottomSheetText}>Profile Activity</Text>
                          </View>
                          <View style={styles.textWrap}>
                            <Text style={styles.bottomSheetText}>Save Profile</Text>
                          </View>
                          <View style={styles.textWrap}>
                            <Text style={styles.bottomSheetText}>Enable Notifications From This Account</Text>
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
      }
})