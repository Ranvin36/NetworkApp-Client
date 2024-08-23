import { Colors } from "@/constants/Colors"
import { router } from "expo-router"
import { View,Image,Text, StyleSheet , TouchableOpacity} from "react-native"

function ChatLayoutComponent({item,lastMessage}){
    const userId = item[0].userId[0]

    return(
        <TouchableOpacity style={styles.chat}>
            <View style={styles.chatsLayout}>
                {item[0].profilePicture ?
                    <View> 
                        <Image source={{uri:item[0].profilePicture}} style={{width:50,height:50, borderRadius:50}}/>
                    </View>
                    :
                    <View> 
                        <Image source={require("../assets/images/user.jpg")} style={{width:50,height:50, borderRadius:50}}/>
                    </View>
                }
                <View style={{marginHorizontal:10}}>
                    <Text style={[styles.textColor,{fontFamily:"Poppins-Bold"}]}>{item[0].username}</Text>
                    <Text style={[styles.textColor,{fontFamily:"Poppins-Light",marginTop:-5}]}>{lastMessage}</Text>
                </View>
            </View>
            <View>
                <Text style={[styles.textColor,{fontFamily:"Poppins-Bold",fontSize:11}]}>Tue 15:30</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ChatLayoutComponent

const styles = StyleSheet.create({
    chatsLayout:{
        flexDirection:"row",
        alignItems:"center"
    },
    chat:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        width:"100%",
    },
    textColor:{
        color:Colors.theme.fontColor
    }
})