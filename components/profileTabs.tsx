import { View,TouchableOpacity, StyleSheet, Dimensions,Text} from "react-native"
import Animated,{useAnimatedStyle,withTiming} from "react-native-reanimated"
import { MaterialCommunityIcons,AntDesign} from "@expo/vector-icons"
import { ColorPalatte } from "@/constants/Colors";
const Colors = ColorPalatte()
function ProfileTabs({selectedIndex,TabClick,position,profileView}){
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
            <View style={styles.tabStyle}>
                <MaterialCommunityIcons name="post-outline" size={24} color={Colors.theme.fontColor} />
                <Text style={styles.tabFont}>Posts</Text>
            </View>
            {selectedIndex == 0 &&
            <Animated.View style={[lineAnimate,{width:0,backgroundColor:Colors.light.text,height:4,borderRadius:20,marginVertical:5}]}/>
            }
        </TouchableOpacity>
                <TouchableOpacity style={styles.tabs} onPress={() => TabClick(1)}>
                    <View style={styles.tabStyle}>
                        <AntDesign name="videocamera" size={24}  color={Colors.theme.fontColor}  />
                        <Text style={styles.tabFont}>Videos</Text>
                    </View>
                    {selectedIndex == 1 &&
                    <Animated.View style={[lineAnimate,{width:0,backgroundColor:Colors.light.text,height:4,borderRadius:20,marginVertical:5}]}/>
                }
                </TouchableOpacity>
        
            {profileView && 
            
            <TouchableOpacity style={styles.tabs} onPress={() => TabClick(2)}>
                <View style={styles.tabStyle}>
                    <MaterialCommunityIcons name="bookmark-outline" size={24} color={Colors.theme.fontColor} />
                    <Text style={styles.tabFont}>Saved</Text>
                </View>
                {selectedIndex == 2 &&
                <Animated.View style={[lineAnimate,{width:0,backgroundColor:Colors.light.text,height:4,borderRadius:20,marginVertical:5}]}/>
                }
            </TouchableOpacity>
            }
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
    tabStyle:{
        flexDirection:"row",
        alignItems:"center"
    },
    tabFont:{
        fontFamily:"Poppins-Bold",
        marginLeft:5,
        fontSize:12,
        color:Colors.theme.fontColor
    }
})