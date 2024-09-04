import { View,Text,TouchableOpacity,Dimensions,StyleSheet,Image, FlatList} from "react-native"
import { Entypo,AntDesign,Feather,Ionicons } from "@expo/vector-icons"
import * as Haptics from 'expo-haptics' 
import { ColorPalatte } from "@/constants/Colors";
const Colors = ColorPalatte()


function PostPreview({user,image,text,setImage}){

    return(
        <View style={{backgroundColor:Colors.theme.backgroundTransparent,borderRadius:15,padding:10,width:Dimensions.get('window').width-50 ,alignSelf:"center"}}>
        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
            <View style={[styles.userAccount,{marginTop:0,paddingHorizontal:0}]}>
                <View>
                    <Image source={{uri : user.profilePicture}} style={{width:30,height:30,borderRadius:50}} />
                </View>
                <View  style={{marginLeft:6}}>
                    <Text style={[styles.textColor,{fontFamily:"Poppins-Light",fontSize:10}]}>{user.username}</Text>
                </View>
            </View>
            <View style={{flexDirection:"row",alignItems:"center"}}>
                <View style={{backgroundColor:"#fff",borderRadius:30,paddingHorizontal:10,paddingVertical:5}}>
                    <Text style={{fontFamily:"Poppins-Bold",fontSize:10}}>Follow</Text>
                </View>
                <TouchableOpacity onPress={()=>{
                    Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success
                    )
                }}>
                    <Entypo name="dots-three-vertical" size={15} color={Colors.theme.fontColor} />
                </TouchableOpacity>
            </View>
        </View>
        <View style={{marginVertical:5}}>
            {image.length>0 ?
            <FlatList data={image} pagingEnabled  nestedScrollEnabled={true} keyExtractor={(item) => item.uri}  horizontal renderItem={({item})  =>{
                return(
                <View style={{position:"relative"}}>
                    <Image source={{uri : item.uri}} style={{width:Dimensions.get('window').width-70,alignSelf:"center",height:200,borderRadius:15}} />
                    <TouchableOpacity style={{position:"absolute" ,right:10, top:10}} onPress={() => setImage([])}>
                        <AntDesign name="closecircle" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
                )
            }}/>
            :
            <View style={{position:"relative"}}>
                <Image source={require('../assets/images/user.jpg')} style={{width:Dimensions.get('window').width-70,alignSelf:"center",height:200,borderRadius:15}} />
            </View>
                    
            }
            {/* <FlatList data={data} renderItem={({item}) => {
                return(

                    <Image source={require('../assets/images/user.jpg')} style={{width:Dimensions.get('window').width-70,alignSelf:"center",height:200,borderRadius:15}} />
                )
            }} /> */}

        </View>
        <View style={{marginHorizontal:2}}>
            <Text style={[styles.textColor,{fontFamily:'Poppins-Light',fontSize:12}]}>{text ? text : "Post Heading"}</Text>
        </View>
        <View style={styles.interactions}>
            <View style={{flexDirection:"row"}}>
                <TouchableOpacity style={styles.iconCont}>
                    <AntDesign name="hearto" size={20} color={Colors.theme.fontColor}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconCont}>
                    <Ionicons name="chatbubble-outline" size={20} color={Colors.theme.fontColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconCont}>
                    <Feather name="send" size={20} color={Colors.theme.fontColor} />
                </TouchableOpacity>
            </View>
            <View>
                <Feather name="bookmark" size={20} color={Colors.theme.fontColor} />
            </View>
        </View>

    </View>
    )
}

export default PostPreview


const styles = StyleSheet.create({
    interactions:{
        marginTop:5,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingVertical:5
    },
    iconCont:{
        flexDirection:"row",
        alignItems:"center",
        marginHorizontal:5
    },
    userAccount:{
        marginTop:20,
        flexDirection:"row",
        alignItems:"center",
        paddingHorizontal:25,
    },
    textColor:{
        color:Colors.theme.fontColor
    }

})