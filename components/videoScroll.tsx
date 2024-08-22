import { View, Text, StyleSheet, Dimensions, Image, Pressable, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { AntDesign, MaterialCommunityIcons, Feather, Entypo } from '@expo/vector-icons';
import ReelUploader from "./ReelUploader";

const VideoScroll = React.memo(({ item, shouldPlay }) => {
  const video = useRef<Video | null>(null);
  const [status, setStatus] = useState({ isPlaying: true });

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
      <ReelUploader/>
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconActions}>
          <AntDesign name="hearto" size={31} color="#fff" />
          <Text style={styles.iconText}>110</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconActions}>
          <MaterialCommunityIcons name="comment-outline" size={31} color="#fff" />
          <Text style={styles.iconText}>110</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconActions}>
          <Feather name="bookmark" size={31} color="#fff" />
          <Text style={styles.iconText}>110</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconActions}>
          <AntDesign name="sharealt" size={31} color="#fff" />
          <Text style={styles.iconText}>110</Text>
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
