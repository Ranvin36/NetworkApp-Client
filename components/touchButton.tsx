import { View , TouchableOpacity, Text, StyleSheet } from "react-native"
import { Colors } from "@/constants/Colors"
function TouchButton({onPress, text}){
    return(
        <TouchableOpacity style={styles.loginBtn} onPress={onPress}>
             <Text style={{fontFamily:"Poppins-Bold",color:"#fff",fontSize:15}}>{text}</Text>
         </TouchableOpacity>
    )
}

export default TouchButton

const styles = StyleSheet.create({
    loginBtn:{
        backgroundColor:Colors.light.text,
        paddingVertical:15,
        borderRadius:10,
        alignItems:"center",
        marginVertical:7
    }
})