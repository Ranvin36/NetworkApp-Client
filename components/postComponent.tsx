import { View,StyleSheet,Text,Image,TouchableOpacity, Dimensions, FlatList, Linking } from "react-native"
import { Ionicons,AntDesign,Feather,Entypo,FontAwesome} from "@expo/vector-icons"
import { Video,ResizeMode } from "expo-av"
import * as Haptics from "expo-haptics"
import { router } from "expo-router"
import { useSelector } from "react-redux"
import { rootStore } from "@/app/redux/store"
const {width:SCREEN_WIDTH, height:SCREEN_HEIGHT} = Dimensions.get('window')
import { ColorPalatte } from "@/constants/Colors";
import Hyperlink from 'react-native-hyperlink';
import { useRef, useState } from "react"
const Colors = ColorPalatte()

function PostComponent({item,index,follows,UnFollowUser,FollowUser,unlikePost,LikePost,toggleBottomSheet,openBottomSheet,setActivePost,AddBookmark,RemoveBookmark}){
    const user = useSelector((state:rootStore) => state.user.user)
    const [status, setStatus] =  useState({})
    const creatorImage = item.creator[0].profilePicture
    const video = useRef(null)
    const imgUrl = item.media
    const videoUrl = item.video
    const like = item.likes
    const comments  = item.comments
    const ifBookmarked = item.bookmarks && item.bookmarks.filter((post:any) => post.toString() == user?.data._id) 
    const ifFollowing = follows && follows.filter((followItem:any) => followItem?.following[0]?._id == item.creator[0]?.creator_id)
    const ifLiked = like && like.filter((liked:any) => liked == user?.data._id)
    function ViewProfile(id:number){
        router.push({ pathname: `viewProfile/${id}`, params: { id } });
    }
    function BottomSheetAction(){
        // setActivePost(item._id)
        openBottomSheet(index,item.creator[0].creator_id)
    }



    return(
        <View style={styles.posts}>
                       
        <View style={styles.postHeader}>
            <View style={{flexDirection:"row",alignItems:"center"}}>
                {creatorImage ? 
                    <View>
                        <Image source={{uri:creatorImage}} style={{width:50,height:50, borderRadius:50}}/>
                    </View>
                    :
                    <View>
                        <Image source={require('../assets/images/model.jpg')} style={{width:50,height:50, borderRadius:50}}/>
                    </View>
                }
                    <TouchableOpacity style={{marginLeft:5}} onPress={()=>ViewProfile(item.creator[0].creator_id)}>
                        <Text style={[styles.textColor,{fontFamily:"Poppins-Bold"}]}>{item.creator[0].username}</Text>
                    </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row', alignItems:"center"}} >
                {ifFollowing.length>0 ?
                    <TouchableOpacity style={styles.following} onPress={()=>UnFollowUser(item.creator[0].creator_id)} >
                        <Text style={[{fontFamily:"Poppins-Bold",fontSize:12}]}>Following</Text>
                    </TouchableOpacity>
                                        :
                    <TouchableOpacity style={styles.following} onPress={()=>FollowUser(item.creator[0].creator_id)} >
                        <Text style={[{fontFamily:"Poppins-Bold",fontSize:12}]}>Follow</Text>
                    </TouchableOpacity>
                    
                }
                <TouchableOpacity onPress={BottomSheetAction}>
                    <Entypo name="dots-three-vertical" size={20} color="black" style={styles.textColor} />
                </TouchableOpacity>
            </View>
        </View>
        {imgUrl &&
                <FlatList data={imgUrl} horizontal keyExtractor={(item)=>item._id}  pagingEnabled renderItem={({item,index}) =>{
                    return(
                        <View>
                            {item.mediaType=="image"?
                            <Image source={{uri :item.uri}} style={{height:300,width:300,borderRadius:20}}/>
                            :
                            <TouchableOpacity onPress={() => status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()} style={{position:"relative"}}>
                                    <View style={{position:'absolute',zIndex:1,borderRadius:20,justifyContent:"center",alignItems:"center",backgroundColor:status.isPlaying?  'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.5)',width:"100%",height:'100%'}}>
                                        {!status.isPlaying &&  <Ionicons name="play" size={40} color="#fff" />}
                                    </View>
                                    <Video 
                                    ref={video}
                                    source={{uri:item.uri}}  
                                    style={{height:300,width:300,borderRadius:20}}
                                    resizeMode={ResizeMode.COVER}
                                    isLooping
                                    shouldPlay={false}
                                    onPlaybackStatusUpdate={status =>  setStatus(() => status)}
                                    useNativeControls={false}/>
                            </TouchableOpacity>
                            }
                            <View style={styles.amountLabel}>
                                <Text style={styles.labelColor}> {index+1} / {imgUrl.length}</Text>
                            </View>
                        </View>

                    )
                }}/> 
            }
        <View style={styles.imageCont}>
            <View style={{marginVertical:2}}>
                <Hyperlink  linkStyle={{ color: '#2980b9', textDecorationLine: 'underline' }} onPress={(url) => Linking.openURL(url)}>
                    <Text style={[styles.textColor,{fontFamily:'Poppins-Light'}]}>{item.text}</Text>
                </Hyperlink>
            </View>


        </View>
        <View style={styles.interactions}>
            <View style={{flexDirection:"row"}}>
                <TouchableOpacity style={styles.icons} onPress={() => ifLiked.length>0 ? unlikePost(item._id) : LikePost(item._id)}>
                    {ifLiked.length>0 ?
                    <AntDesign name="heart" size={24} color={Colors.theme.primary}/>
                             :
                    <AntDesign name="hearto" size={24} color="black" style={styles.textColor} />
                    }
                    <Text style={[styles.iconsText,styles.textColor]}>{like.length > 0 ? like.length +  " Likes" : null}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.icons} onPress={()=>toggleBottomSheet(index,item._id)}>
                    <Ionicons name="chatbubble-outline" size={24} color="black" style={styles.textColor} />
                    <Text style={[styles.iconsText,styles.textColor]}>{comments.length > 0 ? comments.length : null}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.icons}>
                    <Feather name="send" size={24} color="black"  style={styles.textColor}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>ifBookmarked.length>0 ? RemoveBookmark(item._id) : AddBookmark(item._id)}>
                {ifBookmarked.length>0 ?
                <Ionicons name="bookmark" size={24} color={Colors.theme.primary} />            
                :
                <Ionicons name="bookmark-outline" size={24} color={Colors.theme.fontColor} />            
            }
            </TouchableOpacity>
        </View>
    </View>
    )
}

export default PostComponent


const styles = StyleSheet.create({
    posts:{
        marginVertical:5,
        marginBottom:25,
        backgroundColor:Colors.theme.backgroundTransparent,
        padding:10,
        borderRadius:20
    },
    postHeader:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingBottom:10,
    },
    postsContainer:{
        paddingHorizontal:20,
        marginVertical:15
    },
    imageCont:{
        marginTop:10,
        marginVertical:0,
    }
    ,interactions:{
        marginTop:5,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingVertical:5
    },
    icons:{
        flexDirection:"row",
        alignItems:"center",
        marginHorizontal:5
    },
    iconsText:{
        fontFamily:'Poppins-Light',
        marginHorizontal:5
    },
    line:{
        width:75,
        height:4,
        backgroundColor:"#000",
        alignSelf:"center",
        borderRadius:10,
        marginVertical:10
    },
    video:{
        width:100,
        height:100
    },
    textColor:{
        color:Colors.theme.fontColor
    },
    amountLabel:{
        position:"absolute",
        top:10,
        right:10,
        borderRadius:20,
        width:50,
        backgroundColor:"#f1ecec57",
    },
    labelColor:{
        color:"#fff",
        fontFamily:"Poppins-Light",
        paddingVertical:5,
        textAlign:"center",
        fontSize:12
    },
    following:{
        backgroundColor:"#fff",
        padding:10,
        borderRadius:20
    }
})