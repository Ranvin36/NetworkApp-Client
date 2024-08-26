import { View , TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native"
import { ColorPalatte } from "@/constants/Colors";
import React from "react";
const Colors = ColorPalatte()

type ButtonFunction ={
    onPress: () => void,
    text:string,
    loading:boolean
}
const TouchButton:React.FC<ButtonFunction>= ({onPress, text,loading}) => {
    return(
        <TouchableOpacity style={styles.loginBtn} onPress={onPress}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{fontFamily:"Poppins-Bold",color:"#fff",fontSize:15}}>{text}</Text>}
         </TouchableOpacity>
    )
}

export default TouchButton

const styles = StyleSheet.create({
    loginBtn:{
        backgroundColor:Colors.theme.primary,
        paddingVertical:15,
        borderRadius:10,
        alignItems:"center",
        marginVertical:7
    }
})