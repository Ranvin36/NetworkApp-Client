import { Gesture, GestureDetector, GestureHandlerRootView, PanGestureHandler} from "react-native-gesture-handler"
import  Animated,{useAnimatedStyle} from "react-native-reanimated"
import { StyleSheet,View,Image,Text,ScrollView, Dimensions } from "react-native"
import { ColorPalatte } from "@/constants/Colors"


const Colors  = ColorPalatte()
const  {width:SCREEN_WIDTH,height:SCREEN_HEIGHT} = Dimensions.get('window')

function  CommentBottomSheet({gesture,translateY,activeComments}){
    const rBottomSheetStyle = useAnimatedStyle(() =>{
        return{
            transform : [{translateY: translateY.value}]
        }
    })

    return(
        <GestureDetector gesture={gesture}>
                        <Animated.View style={[styles.bottomSheet,rBottomSheetStyle]}>
                            <View style={styles.line}></View>
                            <View style={styles.sheetLayout}>
                                <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                                    <View>
                                        <Text style={{fontFamily:"Poppins-Light",fontSize:18,color:Colors.theme.fontColor}}>Comments</Text>
                                    </View>
                                </View>
                                <View style={{justifyContent:"space-between",flexDirection:"column"}}>
                                    <ScrollView>

                                        {activeComments && activeComments.length>0?
                                        activeComments.map((item,index)=>{
                                            return(
                                                <View key={index} style={{marginVertical:10}}>
                                                    <View style={{flexDirection:"row",alignItems:"center"}}>
                                                        {item.profilePicture 
                                                                    ?
                                                        <Image source={{uri:item.profilePicture}} style={{width:50,height:50, borderRadius:50}}/>
                                                                    :

                                                        <Image source={require('../assets/images/model.jpg')} style={{width:50,height:50, borderRadius:50}}/>
                                                    }
                                                        <View style={{marginHorizontal:5,height:20,justifyContent:"center"}}>
                                                            <Text style={[styles.textColor,{fontFamily:"Poppins-Bold"}]}>Motion Rades</Text>
                                                            <Text style={[styles.textColor,{fontFamily: "Poppins-Light"}]}>{item.message}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        })
                                        :
                                        <View style={{alignItems:"center",justifyContent:"center",height:"70%"}}>
                                            <Text style={{fontFamily:"Poppins-Bold",fontSize:17}}>No Comments Were Found!</Text>
                                        </View>
                                        }
                                    </ScrollView>
                                </View>
                                </View>
                        </Animated.View>
                    </GestureDetector>
    )
}

export default CommentBottomSheet;


const styles = StyleSheet.create({
    bottomSheet:{
        position:"absolute",
        width:SCREEN_WIDTH,
        backgroundColor:Colors.theme.commentsBg,
        height:SCREEN_HEIGHT,
        top:SCREEN_HEIGHT,
        borderRadius:25,
        shadowColor:"#000",
        elevation:10,
        zIndex:1
    },
    line:{
        width:75,
        height:4,
        backgroundColor:"#000",
        alignSelf:"center",
        borderRadius:10,
        marginVertical:10
    },
    textColor:{
        color:Colors.theme.fontColor
    },
    sheetLayout:{
        paddingVertical:5,
        paddingHorizontal:20
    },

})