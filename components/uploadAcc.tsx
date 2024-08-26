import { View,Text,TouchableOpacity, StyleSheet,Dimensions, ActivityIndicator } from "react-native"
import { Ionicons,AntDesign } from "@expo/vector-icons"
import { ColorPalatte } from "@/constants/Colors";
const Colors = ColorPalatte()

function UploadAcc({uploadPost,selectImage,placeholder,loading}){
    return(
        <View style={{flexDirection:"row",alignItems:"center",alignSelf:"center",marginVertical:15}}>
            <TouchableOpacity style={styles.uploadButton} onPress={uploadPost}>
                    {loading ?  <ActivityIndicator color="#fff"/> : <Text style={{fontFamily:"Poppins-Bold",color:"#fff"}}>{placeholder}</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadIcons} onPress={selectImage}>
                <Ionicons name="image-outline" size={24} color={Colors.theme.fontColor} />            
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadIcons}  onPress={selectImage}>
                <AntDesign name="videocamera" size={24} color={Colors.theme.fontColor} />                      
            </TouchableOpacity>
        </View>
    )
}

export default UploadAcc

const styles = StyleSheet.create({
    uploadIcons:{
        backgroundColor:Colors.theme.backgroundTransparent,
        width:40,
        height:40,
        borderRadius:50,
        justifyContent:"center",
        alignItems:"center",
        marginLeft:5
    },
    uploadButton:{
        backgroundColor:"#d92b68",
        padding:12,
        borderRadius:30,
        alignItems:"center",
        width:Dimensions.get('window').width/1.7
    }
})