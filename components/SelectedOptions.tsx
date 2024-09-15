import { StyleSheet, View,TouchableOpacity,Text} from "react-native"
import { AntDesign , Entypo , Feather } from "@expo/vector-icons"
import React from "react";
import { ColorPalatte } from "@/constants/Colors";
const Colors = ColorPalatte()

type Options={
    setSelectedChat:Function,
    selectedChats:Array<string>,
    DeleteChat:() => void

}


const SelectedOptions:React.FC<Options> = ({setSelectedChat,selectedChats,DeleteChat,unAuthorizedSelection}) =>{
    return(
        <View style={{marginHorizontal:20,marginVertical:10,flexDirection:"row",justifyContent:"space-between",width:"100%"}}>
        <View style={{flexDirection:"row",alignItems:"center"}}>
            <View style={{flexDirection:"row",alignItems:"center"}}>                
                <TouchableOpacity onPress={() => setSelectedChat([])}>
                    <AntDesign name="closecircleo" size={24} color={Colors.theme.fontColor} />
                </TouchableOpacity>
                <View style={{marginLeft:5}}>
                    <Text style={[styles.textColor,{fontFamily:"Poppins-Light"}]}>{selectedChats.length>0 && selectedChats.length}</Text>
                </View>
            </View>

        </View>
        <View style={{flexDirection:"row"}}>
            {unAuthorizedSelection.length>0 ? null :            
            <TouchableOpacity style={styles.selectedIcons} onPress={DeleteChat}>
                <AntDesign name="delete" size={24} color={Colors.theme.fontColor} />
            </TouchableOpacity>
            }
            <TouchableOpacity style={styles.selectedIcons}>
                <Entypo name="block" size={24} color={Colors.theme.fontColor} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectedIcons}>
                <Feather name="archive" size={24} color={Colors.theme.fontColor} />
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
        marginRight:19
    },
    textColor:{
        color:Colors.theme.fontColor
    }
})