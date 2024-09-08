import { StyleSheet, View,Text, Touchable, TouchableOpacity, ActivityIndicator, Dimensions} from "react-native";
import { ColorPalatte } from "@/constants/Colors";

const Colors = ColorPalatte()
function Modal({popupOpened,PopUpController,DeleteChat,loading,children}){
    return(
        <View style={[styles.container , {display:popupOpened ?"flex":"none"}]}>
            <View style={styles.popUp}>
                <View>
                    <Text style={{fontFamily:"Poppins-Bold",fontSize:17,color:Colors.theme.fontColor}}>Delete Message</Text>
                </View>
                <View style={{marginVertical:7}}>
                    <Text style={{fontFamily:"Poppins-Light",fontSize:13,color:Colors.theme.fontColor}}>{children}</Text>
                </View>
                <View style={{flexDirection:"row",alignSelf:"flex-end"}}>
                    <TouchableOpacity style={styles.options} onPress={DeleteChat}>
                        {loading ? 
                            <ActivityIndicator/>
                            :
                            <Text style={styles.text}>Yes</Text> 
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.options} onPress={PopUpController}>
                        <Text style={styles.text}>No</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}



export default Modal


const styles= StyleSheet.create({
    container:{
        position:"absolute",
        backgroundColor:"#000000ce",
        height:Dimensions.get('window').height,
        width:"100%",
        zIndex:1,
        justifyContent:"center",
    },
    popUp:{
        marginHorizontal:30,
        paddingVertical:20,
        paddingHorizontal:15,
        borderRadius:10,
        backgroundColor:Colors.theme.commentsBg
    },
    options:{
        marginRight:5,
        backgroundColor:"#e6e5e5",
        width:50,
        paddingHorizontal:10,
        paddingVertical:4,
        borderRadius:50,
        alignItems:"center"
    },
    text:{
        fontFamily:"Poppins-Light"
    }

})  