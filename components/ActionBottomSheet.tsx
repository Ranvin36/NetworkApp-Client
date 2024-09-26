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
    BlockUser: (userId: number) => void,
    UnblockUser: (userId: number) => void,
    HandleFollowUser: (userId: number) => void,
    HandleUnfollowUser: (userId: number) => void,
    follows:any,
    blocked:any,
}


const  ActionBottomSheet:React.FC<BottomSheet> = ({SheetGesture,CloseBottomSheet,posts,HandleFollowUser,HandleUnfollowUser,follows,actionTranslateY,UnblockUser,activePost,BlockUser,blocked}) =>{
    const username = posts[activePost.index]?.creator[0].username
    const isBlocked = blocked && blocked.filter((item:any) => item.userId == posts[activePost.index]?.creator[0].creator_id.toString())
    const isFollowing = follows && follows.filter((item:any) => item._id.toString() == posts[activePost.index]?.creator[0].creator_id.toString())
    const sheetStyle = useAnimatedStyle(() =>{
        return{
            transform:[{translateY:actionTranslateY.value}]
        }
    })


    return(
        <GestureDetector gesture={SheetGesture}>
        <Animated.View style={[sheetStyle,{position:"absolute",backgroundColor:Colors.theme.backgroundColor,zIndex:2,borderRadius:10,width:"100%",height:"50%",bottom:-20,alignSelf:"center"}]}>
            <View style={{width:15,borderRadius:50,height:3,backgroundColor:"#ccc",alignSelf:"center",marginTop:10}}></View>
            <View style={{paddingHorizontal:20}}>
                <View style={{marginVertical:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                    <Text style={{fontFamily:"Poppins-Bold",fontSize:20,color:Colors.theme.fontColor}}>{username}</Text>
                    <TouchableOpacity onPress={CloseBottomSheet}>
                        <AntDesign name="closecircleo" size={20} color={Colors.theme.fontColor} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.sheetOption} onPress={() => router.push({pathname:`/viewProfile/${posts[activePost.index].creator[0].creator_id}`,params:{ id:posts[activePost.index].creator[0].creator_id}})}>
                    <MaterialCommunityIcons name="face-man-outline" size={30} color={Colors.theme.fontColor} style={{marginBottom:3}}  />
                    <View>
                        <Text style={styles.bottomSheetText}>View Profile</Text>
                        <Text style={styles.bottomSheetSubText}>View {username}'s Profile</Text>
                    </View>
                </TouchableOpacity>
                    {isBlocked && isBlocked.length> 0 ?
                        <TouchableOpacity style={styles.sheetOption} onPress={() =>UnblockUser(posts[activePost.index].creator[0].creator_id)}>
                                <Entypo name="block" size={25} color={Colors.theme.fontColor}/>
                                <View>
                                    <Text style={styles.bottomSheetText}>Unblock</Text>
                                    <Text style={styles.bottomSheetSubText}> Wanna See {username} Again</Text>
                                </View>
                        </TouchableOpacity>
                            :
                        <TouchableOpacity style={styles.sheetOption} onPress={() =>BlockUser(posts[activePost.index].creator[0])}>
                                <Entypo name="block" size={25} color={Colors.theme.fontColor}/>
                                <View>
                                    <Text style={styles.bottomSheetText}>Block</Text>
                                    <Text style={styles.bottomSheetSubText}>Don't Wanna See {username}</Text>
                                </View>
                        </TouchableOpacity>
                    }
                    {isFollowing.length>0 ?
                    <TouchableOpacity style={styles.sheetOption} onPress={() => HandleUnfollowUser(posts[activePost.index].creator[0].creator_id)}>
                        <AntDesign name="minuscircleo" size={24} color={Colors.theme.fontColor} />
                        <View>
                            <Text style={styles.bottomSheetText}>Unfollow {username}</Text>
                            <Text style={styles.bottomSheetSubText}>Like His Content</Text>
                        </View>
                    </TouchableOpacity>
                                :
                    <TouchableOpacity style={styles.sheetOption} onPress={() => HandleFollowUser(posts[activePost.index].creator[0])}>
                        <AntDesign name="pluscircleo" size={25} color={Colors.theme.fontColor} />
                        <View>
                            <Text style={styles.bottomSheetText}>Follow {username}</Text>
                            <Text style={styles.bottomSheetSubText}>Like His Content</Text>
                        </View>
                    </TouchableOpacity>

                    }
                    <TouchableOpacity style={styles.sheetOption}>
                        <MaterialIcons name="report-gmailerrorred" size={25} color={Colors.theme.fontColor} />
                        <View>
                            <Text style={styles.bottomSheetText}>Report</Text>
                            <Text style={styles.bottomSheetSubText}>Feature Not Yet Implemented</Text>

                        </View>
                    </TouchableOpacity>
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
        backgroundColor:Colors.theme.backgroundColor,
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
        backgroundColor:Colors.theme.backgroundTransparent,
        padding:10,
        borderRadius:10,
        alignItems:"center"
        // justifyContent:"space-between"
    },
    bottomSheetText:{
        fontFamily:"Poppins-Bold",
        color:Colors.theme.fontColor,
        marginLeft:10
    },
    bottomSheetSubText:{
        fontFamily:"Poppins-Light",
        marginLeft:10,
        marginTop:-5,
        color:Colors.theme.fontColor
    }
})