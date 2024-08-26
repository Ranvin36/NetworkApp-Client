import { ColorPalatte } from "@/constants/Colors"
import axios from "axios"
import React from "react"
import { StyleSheet, View,Text} from "react-native"
const Colors = ColorPalatte()
const Block:React.FC = () =>{

    // async function GetBlockedUser(){
    //     const response = await axios.ge
    // }

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{fontFamily:"Poppins-Bold",fontSize:25,color:"#fff"}}>Blocked</Text>
            </View>

        </View>
    )
}

export default Block

const styles = StyleSheet.create({
    container:{
        backgroundColor:Colors.theme.backgroundColor,
        height:"100%"
    },
    header:{
        paddingHorizontal:30,
        paddingVertical:40
    }
})