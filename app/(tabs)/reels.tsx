import { View, StyleSheet, Dimensions, FlatList, StatusBar, RefreshControl } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import VideoScroll from "@/components/videoScroll";
import axios from "axios";
import { ipAddress } from "@/constants/ipAddress";
import { useSelector } from "react-redux";
import { rootStore } from "../redux/store";

export default function Page() {
  const [viewableItemsIndex, setViewableItemsIndex] = useState(0);
  const user = useSelector((state:rootStore) => state.user.user)
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
        Authorization:`Bearer ${user.token}`
      }
    })
    setVideos(response.data.GetAllReels)
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
  console.log(videos)

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content"/>
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
              <VideoScroll item={item} shouldPlay={index === viewableItemsIndex} />
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
    flex: 1,
  },
  videoContainer: {
    borderBottomWidth: 5,
    borderColor: "#ccc",
  },
});
