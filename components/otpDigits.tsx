import { StyleSheet, TextInput } from "react-native"
function OtpDigits({index,digits,validOtp,handleOtpChange}){
    return(
        <TextInput 
        key={index}
        value={digits}
        style={[styles.box,{borderColor:validOtp?"#000":"#fc5364"}]}
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
        width:60,
        height:60,
        marginHorizontal:5,
        borderRadius:5,
        textAlign:"center",
        fontFamily:"Poppins-Light"
       }
})