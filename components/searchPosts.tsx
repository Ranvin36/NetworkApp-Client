import { rootStore } from "@/app/redux/store"
import { ipAddress } from "@/constants/ipAddress"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { View  , Dimensions, FlatList } from "react-native"
import { useSelector, UseSelector } from "react-redux"
import PostComponent from "./postComponent"
import * as Haptics from "expo-haptics"
import { useSharedValue,withSpring,useDerivedValue} from "react-native-reanimated"
// import  {GetFollowers} from  "../requests/userRequests"

function SearchPosts({searchParam}){
    const user = useSelector((state:rootStore)=>state.user.user)
    const [postData,  setPostData] = useState([])
    const [followCount,  setFollowCount] = useState([0])
    const [follows, setFollows] = useState([])
    const [posts, setPosts] = useState([])
    const [activatePost, setActivePost] = useState(0)
    const  [activeComments, setActiveComments] = useState([])
    const [isSheetOpened, setIsSheetOpened] = useState(false)
    const translateY = useSharedValue(0)
    const {width:SCREEN_WIDTH, height:SCREEN_HEIGHT} = Dimensions.get('window')
    const context = useSharedValue({y:0})
    const isSheetOpenedDerived = useDerivedValue(() => translateY.value < -SCREEN_HEIGHT / 3)


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
                        <PostComponent item={item} LikePost={LikePost} unlikePost={unlikePost} follows={follows} FollowUser={FollowUser} UnFollowUser={UnFollowUser} toggleBottomSheet={toggleBottomSheet}/> 

                    </View>
                )
            }}/>

        </View>
    )


}

export default   SearchPosts