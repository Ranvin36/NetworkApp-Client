import { View,StyleSheet,Text,Image,TouchableOpacity, Dimensions } from "react-native"
import { Ionicons,AntDesign,Feather,Entypo } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"
import { Video,ResizeMode } from "expo-av"
import * as Haptics from "expo-haptics"
import { router } from "expo-router"
import { useSelector } from "react-redux"
import { rootStore } from "@/app/redux/store"

const {width:SCREEN_WIDTH, height:SCREEN_HEIGHT} = Dimensions.get('window')
function PostComponent({item,follows,UnFollowUser,FollowUser,unlikePost,LikePost,toggleBottomSheet}){
    const user = useSelector((state:rootStore) => state.user.user)
    const creatorImage = item.creator[0].profilePicture
    const imgUrl = item.image
    const videoUrl = item.video
    const like = item.likes
    const comments  = item.comments
    const ifFollowing = follows && follows.filter((followItem) => followItem?.following[0]?._id == item.creator[0]?.creator_id)
    const ifLiked = like && like.filter((liked) => liked == user.data._id)

    function ViewProfile(id){
        router.push({ pathname: `viewProfile/${id}`, params: { id } });
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
                        <Text style={{fontFamily:"Poppins-Bold"}}>{item.creator[0].username}</Text>
                    </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row', alignItems:"center"}} >
                {ifFollowing.length>0 ?
                    <TouchableOpacity style={{backgroundColor:"#fff",padding:10,borderRadius:20}} onPress={()=>UnFollowUser(item.creator[0].creator_id)} >
                        <Text style={{fontFamily:"Poppins-Bold",fontSize:12}}>Following</Text>
                    </TouchableOpacity>
                                        :
                    <TouchableOpacity style={{backgroundColor:"#fff",padding:10,borderRadius:20}} onPress={()=>FollowUser(item.creator[0].creator_id)} >
                        <Text style={{fontFamily:"Poppins-Bold",fontSize:12}}>Follow</Text>
                    </TouchableOpacity>
                    
                }
                <TouchableOpacity onPress={()=>{
                    Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success
                    )
                }}>
                    <Entypo name="dots-three-vertical" size={20} color="black" />
                </TouchableOpacity>
            </View>
        </View>
        {imgUrl ?                             
                <View>
                    <Image source={{uri :imgUrl}} style={{height:300,borderRadius:20}}/>
                </View>
                :
                <Video source={{uri:videoUrl}}  
                // ref={videoref}
                style={{height:300}}
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay
                useNativeControls={false}/>
            }
        <View style={styles.imageCont}>
            <View style={{marginVertical:2}}>
                <Text style={{fontFamily:'Poppins-Light'}}>{item.text}</Text>
            </View>


        </View>
        <View style={styles.interactions}>
            <View style={{flexDirection:"row"}}>
                <TouchableOpacity style={styles.icons} onPress={() => ifLiked.length>0 ? unlikePost(item._id) : LikePost(item._id)}>
                    {ifLiked.length>0 ?
                    <AntDesign name="heart" size={24} color={Colors.light.text}/>
                             :
                    <AntDesign name="hearto" size={24} color="black" />
                    }
                    <Text style={styles.iconsText}>{like.length > 0 ? like.length +  " Likes" : null}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.icons} onPress={()=>toggleBottomSheet(item._id)}>
                    <Ionicons name="chatbubble-outline" size={24} color="black" />
                    <Text style={styles.iconsText}>{comments.length > 0 ? comments.length : null}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.icons}>
                    <Feather name="send" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View>
                <Feather name="bookmark" size={24} color="black" />
            </View>
        </View>
    </View>
    )
}

export default PostComponent


const styles = StyleSheet.create({
    posts:{
        marginVertical:10,
        marginBottom:25,
        backgroundColor:"#f2f2f2f2",
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
        marginVertical:10
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
    }
})