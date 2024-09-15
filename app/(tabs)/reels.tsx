import { View, StyleSheet, Dimensions, FlatList, StatusBar, RefreshControl } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import VideoScroll from "@/components/videoScroll";
import axios from "axios";
import { ipAddress } from "@/constants/ipAddress";
import { useDispatch, useSelector } from "react-redux";
import { rootStore } from "../redux/store";
import { PreventRemoveProvider, useFocusEffect } from "@react-navigation/native";
import { setOpened } from "../redux/navbarSlice";
import BackArrow from "@/components/backArrow";
import CommentBottomSheet from "@/components/CommentBottomSheet";
import { useSharedValue,withSpring,useDerivedValue,runOnJS,useAnimatedReaction} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import * as  Haptics from "expo-haptics"

const  {width:SCREEN_WIDTH,height:SCREEN_HEIGHT} = Dimensions.get('window')
export default function Page() {
  const [viewableItemsIndex, setViewableItemsIndex] = useState(0);
  const [activePost,setActivePost] = useState({index:0,id:null})
  const translateY = useSharedValue(SCREEN_HEIGHT)  
  const context = useSharedValue({y:0})  
  const user = useSelector((state:rootStore) => state.user.user)
  const isSheetOpenedDerived = useDerivedValue(() => translateY.value < -SCREEN_HEIGHT / 1.7)
  const dispatch = useDispatch()
  const [refreshing,setRefreshing] = useState(false)
  const [videos,setVideos] = useState([])
  const [isSheetOpened,setIsSheetOpened] = useState(false)
  const [activeComments,setActiveComments] = useState([])
  const [comment,setComment]  =useState("")

  const gesture = Gesture.Pan().onStart((event)=>{
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
const toggleBottomSheet = async(index:number,id:any) =>{
  // dispatch(setOpened(false))
  setActivePost({index,id:id})
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  if(isSheetOpened){
      translateY.value = withSpring(0,{damping:50})
  }
  else{
      translateY.value = withSpring(-SCREEN_HEIGHT+50,{damping:50})
      setActiveComments(videos[index].comments)

    }
  }
  
  const onViewableItemsChange = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setViewableItemsIndex(viewableItems[0].index ?? 0);
    }
  });

  const viewabilityConfigCallbackPairs = useRef([{
    viewabilityConfig: { viewAreaCoveragePercentThreshold: 50 },
    onViewableItemsChanged: onViewableItemsChange.current
  }]);

  async function GetReels(){
    const response = await axios.get(`http://${ipAddress}:3001/reels/`,{
      headers:{
        Authorization:`Bearer ${user?.token}`
      }
    })
    setVideos(response.data.GetAllReels)
  }
  async function UnlikeClip(clipId){
   
    const response = await axios.get(`http://${ipAddress}:3001/reels/un-like/${clipId}`,{
      headers:{
        Authorization: `Bearer ${user?.token}`
      }
    })
}

  async function LikeClip(clipId:number){

    const response = await axios.get(`http://${ipAddress}:3001/reels/like/${clipId}`, {
      headers:{
        Authorization: `Bearer ${user?.token}`
      }
    })

  }
  async function CreateBookmark(uid:number){
    const response = await axios.post(`http://${ipAddress}:3001/reels/create-bookmark/${uid}`,null,{
      headers:{
        Authorization: `Bearer ${user?.token}`
      }
    })
    
  } 
  
  async function RemoveBookmark(uid:number){
   
    const response = await axios.post(`http://${ipAddress}:3001/reels/remove-bookmark/${uid}`,null,{
      headers:{
        Authorization: `Bearer ${user?.token}`
      }
    })

    console.log(response.data)

  }

  async function CreateComment(){
    const data={
        "clipId":videos[activePost.index]?._id,
        "message":comment
    }
    try{
        const response =await  axios.post(`http://${ipAddress}:3001/reels/create-comment`,data,{
          headers:{
            Authorization: `Bearer ${user?.token}`
          }
        })
        setActiveComments((prev) => [...prev,{"userId":user?.data._id , "profilePicture":user?.data.profilePicture , "username":user?.data.username , "message":comment}])
    }
    catch(error){
      console.log(error)
    }
  }

  const onRefresh = useCallback(() =>{
      setRefreshing(true)
      setTimeout(() => {
        setRefreshing(false)
      },2000)
  },[])

  useEffect(() =>{
      GetReels()
  },[refreshing])

  useFocusEffect(
    useCallback(() =>{  
        dispatch(setOpened(true))
        return () =>{
          dispatch(setOpened(false))
        }
    },[])
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content"/>
      <View style={{position:"absolute",left:20,zIndex:1,top:40}}>
        <BackArrow/>
      </View>
      <FlatList
        data={videos}
        pagingEnabled
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ index, item }) => {
          return(
            <View style={styles.videoContainer}>
              <VideoScroll item={item} index={index} CreateBookmark={CreateBookmark} RemoveBookmark={RemoveBookmark} setActivePost={setActivePost} shouldPlay={index === viewableItemsIndex} setVideos={setVideos} UnlikeClip={UnlikeClip} LikeClip={LikeClip} toggleBottomSheet={toggleBottomSheet}/>
            </View>
          )}}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={7}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
        <CommentBottomSheet gesture={gesture} translateY={translateY}   activeComments={activeComments} HandleCreateComment={CreateComment} setComment={setComment}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    position:"relative",
    height:"100%",
    zIndex:-1
  },
  videoContainer: {
    borderBottomWidth: 5,
    borderColor: "#ccc",
  },
});
