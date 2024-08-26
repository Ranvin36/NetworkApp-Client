import { View,TextInput,StyleSheet } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ColorPalatte } from "@/constants/Colors";
import React from "react";
const Colors = ColorPalatte()

type TextInputProps ={
    placeholder:string,
    onChange: (text:string) =>void,
    icon:any

}

const TextInputLayout:React.FC<TextInputProps>= ({placeholder,onChange,icon}) => {
    return(
        <View style={styles.fieldContainer}>
            <MaterialCommunityIcons name={icon} size={24} color={Colors.theme.fontColor} style={{marginBottom:3}}  />
            <TextInput  placeholder={placeholder}  placeholderTextColor={Colors.theme.fontColor} style={[styles.textColor,{fontFamily:"Poppins-Light",width:"100%",marginLeft:5}]} onChangeText={(e) =>onChange(e)}/>
         </View>
    )
}

export default TextInputLayout

const styles = StyleSheet.create({
    fieldContainer:{
        borderWidth:1,
        borderColor:Colors.theme.fontColor,
        padding:13,
        flexDirection:"row",
        alignItems:"center",
        borderRadius:10,
        marginVertical:5
    },
    textColor:{
        color:Colors.theme.fontColor
    }
})