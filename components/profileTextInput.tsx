import { View,TextInput, StyleSheet,Text} from "react-native"
import { ColorPalatte } from "@/constants/Colors"
const Colors = ColorPalatte()


type ProfileTextInputProps = {
    user:any,
    placeholder:string,
    value:string,
    onChange: (text:string) => void,
 
}

const ProfileTextInput:React.FC<ProfileTextInputProps> = ({user,placeholder,value,onChange}) =>{
    return(
        <View >
        <View style={styles.textLabel}>
            <Text style={{fontFamily:"Poppins-Light",color:Colors.theme.fontColor}}>{placeholder}</Text>
        </View>
        <View style={styles.textInput}>
            <TextInput placeholderTextColor={Colors.theme.fontColor} value={value} style={{fontFamily:"Poppins-Light",fontSize:13,color:Colors.theme.fontColor}} onChangeText={(e) => onChange(e)}/>
        </View>
    </View>
    )
}   

export default ProfileTextInput


const styles = StyleSheet.create({
    textInput:{
        width:"100%",
        backgroundColor:Colors.theme.backgroundTransparent,
        paddingHorizontal:20,
        paddingVertical: 10,
        borderRadius:10,
        marginVertical:5
    },
    textLabel:{
        marginHorizontal:10
    }
})