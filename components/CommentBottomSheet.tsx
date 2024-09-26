import { Gesture, GestureDetector, GestureHandlerRootView, PanGestureHandler} from "react-native-gesture-handler"
import  Animated,{useAnimatedStyle} from "react-native-reanimated"
import { StyleSheet,View,Image,Text,ScrollView, Dimensions,TextInput,TouchableOpacity, ActivityIndicator} from "react-native"
import { ColorPalatte } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { useSelector } from "react-redux"
import { rootStore } from "@/app/redux/store"


const Colors  = ColorPalatte()
const  {width:SCREEN_WIDTH,height:SCREEN_HEIGHT} = Dimensions.get('window')


interface CommentsSheet{
    gesture: any,
    translateY: any,
    activeComments: Array<any>,
    HandleCreateComment: () => void,
    setComment: (comment:string)=>void,
    comment:string,
    loading: boolean
}

const CommentBottomSheet:React.FC<CommentsSheet>= ({gesture,translateY,activeComments,loading,comment,HandleCreateComment,setComment}) =>{
    const user = useSelector((state:rootStore) => state.user.user?.data)
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
                                <View style={{width:SCREEN_WIDTH,borderBottomWidth:1,borderTopWidth:1,borderColor:"#ccc",marginVertical:15,flexDirection:"row",paddingHorizontal:20,paddingVertical:10,justifyContent:"space-between",alignItems:"center"}}>
                                    <View style={{flexDirection:"row",alignItems:"center"}}>
                                        <Image source={{uri:user?.profilePicture}} style={{width:40,height:40,borderRadius:50}}/>
                                        <View>
                                                <TextInput placeholder="Type Your Comment." placeholderTextColor={Colors.theme.fontColor} value={comment} style={{paddingHorizontal:5,width:200,color:Colors.theme.fontColor,fontFamily:"Poppins-Light"}} onChangeText={(e) => setComment(e)}/>
                                        </View>
                                    </View>
                                        <TouchableOpacity style={{backgroundColor:Colors.light.text,borderRadius:50,width:30,height:30,justifyContent:"center",alignItems:"center"}} onPress={HandleCreateComment}>
                                            {loading ? <ActivityIndicator/>:<Ionicons name="send-outline" size={20} color="#fff" />                                        }
                                            {/* <ActivityIndicator color="#fff"/> */}
                                        </TouchableOpacity>
                                    </View>
                                <View style={{justifyContent:"space-between",flexDirection:"column",paddingHorizontal:20}}>
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
                                        <View style={{justifyContent:"center",flex:1,height:SCREEN_HEIGHT/2}}>
                                            <Text style={{fontFamily:"Poppins-Light",textAlign:"center",color:"#ccc",fontSize:15}}>No Comments</Text>
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
        backgroundColor:Colors.theme.fontColor,
        alignSelf:"center",
        borderRadius:10,
        marginVertical:10
    },
    textColor:{
        color:Colors.theme.fontColor
    },
    sheetLayout:{
        paddingVertical:5,

        // paddingHorizontal:20
    },

})