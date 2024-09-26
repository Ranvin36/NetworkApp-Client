import { StyleSheet, TextInput } from "react-native"
import { ColorPalatte } from "@/constants/Colors";
const Colors = ColorPalatte()
function OtpDigits({index,digits,validOtp,handleOtpChange}){
    return(
        <TextInput 
        key={index}
        value={digits}
        style={[styles.box,{borderColor:validOtp?Colors.theme.fontColor:"#fc5364"}]}
        maxLength={1}
        keyboardType="numeric"
        onChangeText={(e)=>handleOtpChange(e,index)}
    />
    )
}

export default OtpDigits

const styles = StyleSheet.create({
    box:{
        borderWidth:1,
        width:70,
        height:65,
        marginHorizontal:5,
        borderRadius:5,
        textAlign:"center",
        fontFamily:"Poppins-Light",
        color:Colors.theme.fontColor
       }
})