import { View,Text,TouchableOpacity, StyleSheet } from "react-native"
import { Feather,MaterialIcons } from '@expo/vector-icons';
import { Colors } from "@/constants/Colors";

function SettingOptions({title,icon}){
    return(
        <TouchableOpacity style={{flexDirection:"row",marginVertical:10,justifyContent:"space-between"}}>
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