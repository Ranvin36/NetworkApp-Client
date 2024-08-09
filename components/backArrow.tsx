import { TouchableOpacity } from "react-native"
import { router } from "expo-router"
import { MaterialIcons } from '@expo/vector-icons';


function BackArrow(){
    return(
        <TouchableOpacity onPress={()=>router.back()} style={{
            backgroundColor:"#ccc",
            padding:5,
            borderRadius:5,
            width:35
        }}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />      
        </TouchableOpacity>
    )
}

export default BackArrow