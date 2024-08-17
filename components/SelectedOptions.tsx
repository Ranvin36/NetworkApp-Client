import { StyleSheet, View,TouchableOpacity,Text} from "react-native"
import { AntDesign , Entypo , Feather } from "@expo/vector-icons"
function SelectedOptions({setSelectedChat,selectedChats,DeleteChat}){
    return(
        <View style={{marginHorizontal:20,marginVertical:10,flexDirection:"row",justifyContent:"space-between"}}>
        <View style={{flexDirection:"row",alignItems:"center"}}>
            <TouchableOpacity onPress={() => setSelectedChat([])}  style={styles.selectedIcons}>
                <AntDesign name="closecircleo" size={24} color="black" />
            </TouchableOpacity>
            <View style={{marginLeft:5}}>
                <Text style={{fontFamily:"Poppins-Light"}}>{selectedChats.length>0 && selectedChats.length}</Text>
            </View>

        </View>
        <View style={{flexDirection:"row"}}>
            <TouchableOpacity style={styles.selectedIcons} onPress={DeleteChat}>
                <AntDesign name="delete" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectedIcons}>
                <Entypo name="block" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectedIcons}>
                <Feather name="archive" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectedIcons}>
            </TouchableOpacity>
        </View>
    </View>
    )
}

export default SelectedOptions

const styles =  StyleSheet.create({
    selectedIcons:{
        marginLeft:10
    }
})