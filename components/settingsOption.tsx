import { View,Text,TouchableOpacity, StyleSheet } from "react-native"
import { Feather,MaterialIcons } from '@expo/vector-icons';
import { ColorPalatte } from "@/constants/Colors";
import { router } from "expo-router";
import React from "react";
const Colors = ColorPalatte()

type OptionProps ={
    title:string,
    icon:any, 
    to:any
}

const SettingOptions:React.FC<OptionProps> = ({title,icon,to}) => {
    return(
        <TouchableOpacity style={{flexDirection:"row",marginVertical:10,justifyContent:"space-between"}} onPress={() => router.push(to)}>
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                <Feather name={icon} size={23} color={Colors.theme.fontColor} />
                                <Text style={[styles.textColor,{fontFamily:"Poppins-Light",marginLeft:10}]}>{title}</Text>
                            </View>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color={Colors.theme.fontColor} />
        </TouchableOpacity>
    )
}

export default SettingOptions

const styles = StyleSheet.create({
    textColor:{
        color:Colors.theme.fontColor
    }
})