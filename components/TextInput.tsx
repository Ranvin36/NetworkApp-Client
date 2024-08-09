import { View,TextInput,StyleSheet } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
function TextInputLayout({placeholder,onChange,icon}){
    return(
        <View style={styles.fieldContainer}>
            <MaterialCommunityIcons name={icon} size={24} color="black" style={{marginBottom:3}}  />
            <TextInput  placeholder={placeholder}  style={{fontFamily:"Poppins-Light",width:"100%",marginLeft:5}} onChangeText={(e) =>onChange(e)}/>
         </View>
    )
}

export default TextInputLayout

const styles = StyleSheet.create({
    fieldContainer:{
        borderWidth:1,
        padding:13,
        flexDirection:"row",
        alignItems:"center",
        borderRadius:10,
        marginVertical:5
    },
})