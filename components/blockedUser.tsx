import { View,StyleSheet,Text,Image, TouchableOpacity} from "react-native"
import { Ionicons } from "@expo/vector-icons"

const BlockedUser:React.FC = ({item,UnBlockUser}) =>{
    return(
        <View style={styles.blockedUserLayout}>
        <View style={styles.blockedUser}>
            <View>
                <Image source={{uri: item.profilePicture}} style={styles.profilePicture}/>
            </View>
            <View style={{marginHorizontal:7}}>
                <Text style={styles.text}>{item.username}</Text>
            </View>
        </View>
        <TouchableOpacity onPress={() => UnBlockUser(item.userId)}>
                <Ionicons name="person-remove-outline" size={24} color="black" />
        </TouchableOpacity>
    </View>
    )
}
export default BlockedUser

const styles = StyleSheet.create({
    blockedUserLayout:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    blockedUser:{
        flexDirection:'row',
        alignItems:'center',
        marginVertical:10
    },
    text:{
        fontFamily:"Poppins-Light"
    },
    profilePicture:{
        width:50,
        height:50,
        borderRadius:50,
    }
})