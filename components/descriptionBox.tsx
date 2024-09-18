import { View,TextInput, StyleSheet } from "react-native"
import { ColorPalatte } from "@/constants/Colors";
import React from "react";
const Colors = ColorPalatte()

type DescriptionBoxTypes = {
    onChange: (text:string) => void,
    text: string
 
}

const DescriptionBox:React.FC<DescriptionBoxTypes>= ({onChange,text}) =>{
    return(
        <View style={styles.InputContainer}>
            <View style={styles.textInput}>
                <TextInput style={[styles.input,{paddingBottom:40}]} placeholderTextColor={Colors.theme.fontColor} placeholder="Description" value={text} multiline={true} onChangeText={(e)=>onChange(e)}/>
            </View>
    </View>
    )
}

export default DescriptionBox


const styles = StyleSheet.create({
    textInput:{
        backgroundColor:Colors.theme.backgroundTransparent,
        padding:13,
        borderRadius:10
    },
    InputContainer:{
        paddingHorizontal:25,
        marginVertical:15
    },
    input:{
        borderWidth:0,
        fontFamily:"Poppins-Light",
        color:Colors.theme.fontColor
    },
})