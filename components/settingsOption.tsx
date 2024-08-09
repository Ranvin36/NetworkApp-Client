import { View,Text,TouchableOpacity } from "react-native"
import { Feather,MaterialIcons } from '@expo/vector-icons';

function SettingOptions({title,icon}){
    return(
        <TouchableOpacity style={{flexDirection:"row",marginVertical:10,justifyContent:"space-between"}}>
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                <Feather name={icon} size={23} color="black" />
                                <Text style={{fontFamily:"Poppins-Light",marginLeft:10}}>{title}</Text>
                            </View>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </TouchableOpacity>
    )
}

export default SettingOptions