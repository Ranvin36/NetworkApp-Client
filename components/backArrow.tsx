import { TouchableOpacity } from "react-native"
import { router } from "expo-router"
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from "@/constants/Colors";

function BackArrow(){
    return(
        <TouchableOpacity onPress={()=>router.back()} style={{
            backgroundColor:Colors.theme.backgroundTransparent,
            padding:5,
            borderRadius:5,
            width:35
        }}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color={Colors.theme.fontColor} />      
        </TouchableOpacity>
    )
}

export default BackArrow