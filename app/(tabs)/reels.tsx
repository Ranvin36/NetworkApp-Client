import { View, StyleSheet, Dimensions, FlatList, StatusBar } from "react-native";
import React, { useRef, useState } from "react";
import VideoScroll from "@/components/videoScroll";

export default function Page() {
  const [viewableItemsIndex, setViewableItemsIndex] = useState(0);
  
  const videos = [
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://socialmediastorage123.s3.eu-north-1.amazonaws.com/videos/The+Sri+Lankan+spin+attack!+Lasith+Embuldeniya+-+Praveen+Jayawickrama+-+Ramesh+Mendis.mp4",
   ];
  
  const onViewableItemsChange = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setViewableItemsIndex(viewableItems[0].index ?? 0);
    }
  });

  const viewabilityConfigCallbackPairs = useRef([{
    viewabilityConfig: { viewAreaCoveragePercentThreshold: 50 },
    onViewableItemsChanged: onViewableItemsChange.current
  }]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content"/>
      <FlatList
        data={videos}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        renderItem={({ index, item }) => (
          <View style={styles.videoContainer}>
            <VideoScroll item={item} shouldPlay={index === viewableItemsIndex} />
          </View>
        )}
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
