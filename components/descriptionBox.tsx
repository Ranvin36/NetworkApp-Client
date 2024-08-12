import { View,TextInput, StyleSheet } from "react-native"
function DescriptionBox({onChange,text}){
    return(
        <View style={styles.InputContainer}>
            <View style={styles.textInput}>
                <TextInput style={[styles.input,{paddingBottom:40}]} placeholder="Description" value={text} multiline={true} onChangeText={(e)=>onChange(e)}/>
            </View>
    </View>
    )
}

export default DescriptionBox


const styles = StyleSheet.create({
    textInput:{
        backgroundColor:"#fff",
        padding:13,
        borderRadius:10
    },
    InputContainer:{
        paddingHorizontal:25,
        marginVertical:15
    },
    input:{
        borderWidth:0,
        fontFamily:"Poppins-Light",
    },
})