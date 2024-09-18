import { View, Text, StyleSheet, Dimensions, Image, Pressable, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { AntDesign, MaterialCommunityIcons, Feather, Entypo,Ionicons } from '@expo/vector-icons';
import ReelUploader from "./ReelUploader";
import { useSelector } from "react-redux";
import { rootStore } from "@/app/redux/store";
import axios from "axios";
import { ipAddress } from "@/constants/ipAddress";
import { ColorPalatte } from "@/constants/Colors";
import Animated,{ useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const Colors = ColorPalatte()
type ItemTypes={
  _id: string,
  likes:[],
  bookmarks:[],
  media:string,
  user:any[],
  text:string,
  comments:[]
}

type VideoTypes={
  item:ItemTypes,
  CreateBookmark:()=>void,
  CreateComment:(id:any)=>void,
  RemoveBookmark:(id:any)=>void,
  index:number,
  setActivePost:Function,
  setVideos:Function,
  UnlikeClip:(id:any)=>void,
  LikeClip:(id:any)=>void,
  toggleBottomSheet:(index:number,item:any)=>void,
  openBottomSheet:()=>void,
  shouldPlay:boolean
}

const VideoScroll = React.memo<VideoTypes>(({ item,CreateBookmark,CreateComment,RemoveBookmark,index,setActivePost,shouldPlay,setVideos,UnlikeClip,LikeClip,toggleBottomSheet}) => {
  const video = useRef<Video | null>(null);
  const user = useSelector((state:rootStore) => state.user.user)
  const [status, setStatus] = useState({ isPlaying: true });
  const isLiked = item.likes.filter((like:number) => like.toString() == user?.data._id)
  const isBookmarked  =  item.bookmarks.filter((bookmark:number) => bookmark.toString() == user?.data._id)
  const likeValue = useSharedValue(1)
  const unLikeValue = useSharedValue(1)
  const createBookmarkValue = useSharedValue(1)
  const removeBookmarkValue = useSharedValue(1)
  const like = useAnimatedStyle(() =>{
      return{
        transform:[{scale:likeValue.value}]
      }
  },[])

  const unlike = useAnimatedStyle(() =>{
      return{
        transform:[{scale:unLikeValue.value}]
      }
  },[]) 

  const createBookmark = useAnimatedStyle(() =>{
      return{
        transform:[{scale:createBookmarkValue.value}]
      }
  },[])

  const removeBookmark = useAnimatedStyle(() =>{
      return{
        transform:[{scale:removeBookmarkValue.value}]
      }
  },[]) 
  
  useEffect(() => {
    if (!video.current) return;
    if (shouldPlay) {
      video.current.playAsync();
    } else {
      video.current.pauseAsync();
      video.current.setPositionAsync(0);
    }
   
    return (() => {
      video.current?.pauseAsync()
    })
  }, [shouldPlay]);

  function ToggleAction(){

    toggleBottomSheet(index,item._id)
  }

  function toggleLike() {
    setTimeout(() =>{
      setVideos((videos:any) => videos.map((video:any) =>{
        if(video._id.toString() == item._id.toString()){
          return{
           ...video,
            likes: video.likes ? [...video.likes,user?.data._id] : [user?.data._id],
          }
  
        }
        return video
  
      }))
      LikeClip(item._id)
    },250)
    likeValue.value = withSpring(0.5, { damping: 50,stiffness:700 }, () => {
      likeValue.value = withSpring(1, { damping: 50,stiffness:700 });
    });

  }

  function UnlikeToggle(){
    setTimeout(() =>{
      setVideos((prevVideos:any) => prevVideos.map((video:any) => {
        if (video._id.toString() == item._id.toString()) {
          return {
            ...video,
            likes: video.likes ? video.likes.filter((like: number) => like.toString() != user?.data._id.toString()) : null,
          }
        }
        return video;
      }))

      UnlikeClip(item._id)
    },250)
      unLikeValue.value = withSpring(1.5,{damping:50,stiffness:700}, ()  =>{
        unLikeValue.value = withSpring(1, { damping: 50,stiffness:700 });
      });
  }

  function ToggleBookmark(){
    setTimeout(() =>{
      setVideos((prev:any) => prev.map((video:any) =>{
        if(video._id  == item._id ){
          return{
          ...video,
            bookmarks: video.bookmarks? [...video.bookmarks,user?.data._id] : [user?.data._id],
          }
        }
        else{
          return video
        }
      }))
      CreateBookmark(item._id)
    },250)
    createBookmarkValue.value =   withSpring(0.5,{damping:50,stiffness:700} , () =>{
      createBookmarkValue.value = withSpring(1 , {damping:50,stiffness:700})
    })
  }

  function ToggleRemoveBookmark(){
    setTimeout(() =>{
        setVideos((prev:any) => prev.map((video:any) =>{
          if(video._id){
            return{
              ...video,
              bookmarks: video.bookmarks? video.bookmarks.filter((bookmark:number) => bookmark.toString() != user?.data._id) : null
            }
          }
          else{
            return video
          }
        }))
        RemoveBookmark(item._id)
    },250)

    removeBookmarkValue.value = withSpring(1.5,{damping:50,stiffness:700}, () =>{
      removeBookmarkValue.value = withSpring(1, {damping: 50,stiffness:700})
    })
  }


  return (
    <Pressable
      onPress={() => status.isPlaying && video.current?.pauseAsync()}
      style={styles.pressable}
    >
      {!status.isPlaying && (
        <View style={styles.playOverlay}>
          <TouchableOpacity onPress={() => video.current?.playAsync()}>
            <Entypo name="controller-play" size={54} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      <ReelUploader user={item.user[0]} text={item.text}/>
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconActions} >
          {isLiked.length>0 ?
          <TouchableOpacity onPress={UnlikeToggle}>
            <Animated.View style={[unlike]}>
              <AntDesign name="heart" size={31} color={Colors.theme.primary} />
            </Animated.View>
          </TouchableOpacity>
                            :
          <TouchableOpacity onPress={toggleLike} >
            <Animated.View style={[like]}>
              <AntDesign name="hearto" size={31} color="#fff" />
            </Animated.View>
          </TouchableOpacity>
          }
          <Text style={styles.iconText}>{item.likes.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconActions}  onPress={ToggleAction}>
          <MaterialCommunityIcons name="comment-outline" size={31} color="#fff" />
          <Text style={styles.iconText}>{item.comments.length}</Text>
        </TouchableOpacity>
        {isBookmarked.length>0 ?

          <TouchableOpacity style={styles.iconActions} onPress={ToggleRemoveBookmark}>
            <Animated.View style={[removeBookmark]}>
                <Ionicons name="bookmark" size={31} color={Colors.theme.primary} />            
            </Animated.View>
          </TouchableOpacity>
                              :        
          <TouchableOpacity style={styles.iconActions} onPress={ToggleBookmark}>
            <Animated.View style={[createBookmark]}>
              <Ionicons name="bookmark-outline" size={31} color="#fff" />
            </Animated.View>
          </TouchableOpacity>
        }
      <Text style={styles.iconText}>{item.bookmarks.length}</Text>
        <TouchableOpacity style={styles.iconActions}>
          <AntDesign name="sharealt" size={31} color="#fff" />
          <Text style={styles.iconText}>0</Text>
        </TouchableOpacity>
      </View>
      <Video
        ref={video}
        source={{uri : item.media}}
        style={styles.videos}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={shouldPlay}
        useNativeControls={false}
        onPlaybackStatusUpdate={status => setStatus(() =>status)}
      />
    </Pressable>
  )
})

const styles = StyleSheet.create({
  pressable: {
    position: "relative",
    height:Dimensions.get('window').height
  },
  playOverlay: {
    position: "absolute",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: "#0000002f",
  },
  infoContainer: {
    position: "absolute",
    zIndex: 1,
    bottom: 30,
    left: 10,
  },
  image: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 15,
    color: "#fff",
    fontFamily: 'Poppins-Regular',
    marginLeft: 10,
  },
  subtitle: {
    margin: 7,
    fontFamily: "Poppins-Light",
    color: "#fff",
  },
  iconContainer: {
    position: "absolute",
    right: 15,
    bottom: 60,
    zIndex: 1,
  },
  iconActions: {
    marginVertical: 7,
  },
  iconText: {
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    color: "#fff",
    marginTop: 5,
  },
  videos: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignSelf: "center",
  },
});

export default VideoScroll;
