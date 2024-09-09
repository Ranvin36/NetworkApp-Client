import { StyleSheet, View,TouchableOpacity,Image,Dimensions,Text} from "react-native"
import { router } from "expo-router"
import { Video,ResizeMode } from "expo-av"
import * as Haptics from "expo-haptics"
function ProfileActivity({item,isImage,userId,setSelected,selected}){

    function AddToSelected(){
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        setSelected((prev) => [...prev,item._id])
    }
    function RemoveFromSelected(){
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        setSelected((prev) => prev.filter((id) => id.toString() != item._id.toString()))
    }
    const isSelected = selected && selected.filter((id) => id.toString() == item._id.toString())
    const index = selected  && selected.findIndex((id) => id.toString() == item._id.toString())
    return(
        <View>
            {isSelected.length>0 &&            
                <TouchableOpacity style={{position:"absolute",backgroundColor:"#000000ab",width:"100%",height:"100%",justifyContent:"center",zIndex:1}} onPress={RemoveFromSelected}>
                        <Text style={{color:"#fff",textAlign:"center",fontFamily:"Poppins-Bold",fontSize:30}}>{index+1}</Text>
                </TouchableOpacity>
            }
        {isImage ?
            <TouchableOpacity 
            onPress={() => isSelected.length > 0 ? AddToSelected() : router.push({pathname: `/post/${userId}`, params: {userId}})}
            onLongPress={AddToSelected}
          >
            <Image source={{ uri: isImage }} style={styles.postLayout} />
          </TouchableOpacity>
          
            :
            <TouchableOpacity>
                <Video source={{ uri: item.media }} style={[styles.postLayout]} resizeMode={ResizeMode.COVER} />
            </TouchableOpacity>
        }
        </View>
    )
}


export default ProfileActivity


const styles = StyleSheet.create({
    postLayout: {
        width: Dimensions.get('window').width / 3,
        height: 200,
    }
})