import {View,Text,TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import Animated,{useAnimatedStyle} from 'react-native-reanimated'
import { AntDesign,MaterialCommunityIcons,Entypo,MaterialIcons } from '@expo/vector-icons'
import { ColorPalatte } from '@/constants/Colors'

const {width:SCREEN_WIDTH,height:SCREEN_HEIGHT} = Dimensions.get('window')
const Colors = ColorPalatte()
import { router } from 'expo-router'
import { BlockUser } from './CallBacks/CallBackFunctions'
import React from 'react'

type BottomSheet ={
    SheetGesture: any,
    CloseBottomSheet: () => void,
    posts: any[],
    actionTranslateY: any,
    activePost: any,
    BlockUser: (userId: number) => void
}


const  ActionBottomSheet:React.FC<BottomSheet> = ({SheetGesture,CloseBottomSheet,posts,actionTranslateY,activePost,BlockUser}) =>{
    const sheetStyle = useAnimatedStyle(() =>{
        return{
            transform:[{translateY:actionTranslateY.value}]
        }
    })


    return(
        <GestureDetector gesture={SheetGesture}>
        <Animated.View style={[sheetStyle,{position:"absolute",backgroundColor:Colors.theme.commentsBg,zIndex:2,borderRadius:10,width:"100%",height:"50%",bottom:-20,alignSelf:"center"}]}>
            <View style={{width:15,borderRadius:50,height:3,backgroundColor:"#ccc",alignSelf:"center",marginTop:10}}></View>
            <View style={{paddingHorizontal:20,paddingVertical:15}}>
                <View style={{marginVertical:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                    <Text style={{fontFamily:"Poppins-Bold",fontSize:20,color:Colors.theme.fontColor}}>{posts[activePost.index]?.creator[0].username}</Text>
                    <TouchableOpacity onPress={CloseBottomSheet}>
                        <AntDesign name="closecircleo" size={20} color={Colors.theme.fontColor} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.sheetOption} onPress={() => router.push({pathname:`/viewProfile/${posts[activePost.index].creator[0].creator_id}`,params:{ id:posts[activePost.index].creator[0].creator_id}})}>
                    <Text style={styles.bottomSheetText}>View Profile</Text>
                    <MaterialCommunityIcons name="face-man-outline" size={20} color={Colors.theme.fontColor} style={{marginBottom:3}}  />

                </TouchableOpacity>
                <TouchableOpacity style={styles.sheetOption} onPress={() =>BlockUser(posts[activePost.index].creator[0].creator_id)}>
                    <Text style={styles.bottomSheetText}>Block</Text>
                    <Entypo name="block" size={18} color={Colors.theme.fontColor}/>
                </TouchableOpacity>
                <View style={styles.sheetOption}>
                    <Text style={styles.bottomSheetText}>Archive</Text>
                    <Entypo name="archive" size={18} color={Colors.theme.fontColor} />
                </View>
                <View style={styles.sheetOption}>
                    <Text style={styles.bottomSheetText}>Report</Text>
                    <MaterialIcons name="report-gmailerrorred" size={20} color={Colors.theme.fontColor} />
                </View>
            </View>
        </Animated.View>
    </GestureDetector>
    )
}

export default ActionBottomSheet


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
    sheetOption:{
        marginVertical:2,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    bottomSheetText:{
        fontFamily:"Poppins-Light",
        color:Colors.theme.fontColor
    },
})