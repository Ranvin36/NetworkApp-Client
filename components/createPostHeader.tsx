import { View,Text,Image, StyleSheet } from "react-native"

function CreatePostHeader({user}){
    return(
        <View style={[styles.userAccount , {width:185,marginTop:8}]}>
        <View>
            <Image source={{uri : user.profilePicture}} style={{width:50,height:50,borderRadius:50}} />
        </View>
        <View style={{marginLeft:6}}>
            <Text style={[styles.textColor,{fontFamily:"Poppins-Light"}]}>{user.username}</Text>
            <Text style={[styles.textColor,{fontFamily:"Poppins-Bold",fontSize:12,marginTop:-5}]}>Public</Text>
        </View>
    </View>
    )
}

export default CreatePostHeader


const styles = StyleSheet.create({
    userAccount:{
        marginTop:20,
        flexDirection:"row",
        alignItems:"center",
        paddingHorizontal:25,
    },
    textColor:{
        color:"#fff"
    }
})