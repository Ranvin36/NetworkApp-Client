import { View,TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import Animated,{useAnimatedStyle,withTiming} from "react-native-reanimated"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"

function ProfileTabs({selectedIndex,TabClick,position}){
    const screenWidth = Dimensions.get('window').width
        
    const lineAnimate = useAnimatedStyle(() => {
        return {
            width: withTiming(position.value,{duration:200})
        }
    })
    

    return(
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: screenWidth }}>
        {/* <Animated.View style={[{ position: "absolute", backgroundColor: "#000", width: 70, height: 2, borderRadius: 10, bottom: 5 }, lineAnimate]} /> */}
        <TouchableOpacity style={[styles.tabs]} onPress={() => TabClick(0)}>
            <MaterialCommunityIcons name="post-outline" size={24} color={Colors.theme.fontColor} />
            {selectedIndex == 0 &&
            <Animated.View style={[lineAnimate,{width:0,backgroundColor:Colors.light.text,height:4,borderRadius:20,marginVertical:5}]}/>
            }
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabs} onPress={() => TabClick(1)}>
            <MaterialCommunityIcons name="heart-outline" size={24} color={Colors.theme.fontColor} />
            {selectedIndex == 1 &&
            <Animated.View style={[lineAnimate,{width:0,backgroundColor:Colors.light.text,height:4,borderRadius:20,marginVertical:5}]}/>
            }
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabs} onPress={() => TabClick(2)}>
            <MaterialCommunityIcons name="bookmark-outline" size={24} color={Colors.theme.fontColor} />
            {selectedIndex == 2 &&
            <Animated.View style={[lineAnimate,{width:0,backgroundColor:Colors.light.text,height:4,borderRadius:20,marginVertical:5}]}/>
            }
        </TouchableOpacity>
    </View>
    )
}


export default ProfileTabs

const styles = StyleSheet.create({
    tabs: {
        width: 100,
        height: 40,
        alignItems: "center"
    },
})