import { View, StyleSheet, Dimensions, FlatList, StatusBar, RefreshControl } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import VideoScroll from "@/components/videoScroll";
import axios from "axios";
import { ipAddress } from "@/constants/ipAddress";
import { useDispatch, useSelector } from "react-redux";
import { rootStore } from "../redux/store";
import { useFocusEffect } from "@react-navigation/native";
import { setOpened } from "../redux/navbarSlice";
import BackArrow from "@/components/backArrow";

export default function Page() {
  const [viewableItemsIndex, setViewableItemsIndex] = useState(0);
  const user = useSelector((state:rootStore) => state.user.user)
  const dispatch = useDispatch()
  const [refreshing,setRefreshing] = useState(false)
  const [videos,setVideos] = useState([])
  
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
    const response = await axios.post(`http://${ipAddress}:3001/reels/un-like/${clipId}`,null , {
      headers:{
        Authorization: `Bearer ${user?.token}`
      }
    })
    console.log(response.data)
    setVideos((prevVideos) => prevVideos.map((video) => {
    if (video._id.toString() === clipId.toString()) {
      return {
        ...video,
        likes: video.likes ? video.likes.filter((like: number) => like.toString() !== user?.data._id.toString()) : null,
      }
    }
    return video;
  }))
}

  async function LikeClip(clipId:number){
    const response = await axios.post(`http://${ipAddress}:3001/reels/like/${clipId}`,null , {
      headers:{
        Authorization: `Bearer ${user?.token}`
      }
    })

    setVideos((videos:any) => videos.map((video:any) =>{
      if(video._id.toString() == clipId){
        return{
         ...video,
          likes: video.likes ? [...video.likes,user?.data._id] : [user?.data._id],
        }

      }
      return video

    }))
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
          console.log("UNFOCUSED")
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
          console.log(item.media)
          return(
            <View style={styles.videoContainer}>
              <VideoScroll item={item} shouldPlay={index === viewableItemsIndex} setVideos={setVideos} UnlikeClip={UnlikeClip} LikeClip={LikeClip}/>
            </View>
          )}}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={7}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    position:"relative",
    height:"100%"
  },
  videoContainer: {
    borderBottomWidth: 5,
    borderColor: "#ccc",
  },
});
