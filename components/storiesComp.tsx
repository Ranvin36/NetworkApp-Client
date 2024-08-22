import React,{ useMemo } from "react"
import { TouchableOpacity,View,Image,Text, StyleSheet } from "react-native"
const StoriesComp = React.memo(({item,onPress}) =>{
    return(
        <TouchableOpacity style={{marginHorizontal:3,alignItems:"center"}}  onPress={onPress}>
        <View style={{borderWidth:2,width:75,height:75,borderRadius:50,justifyContent:"center",alignItems:"center" ,borderColor:"#d92b68"}}>
            {item.creator[0].profilePicture ?
            <Image source={{uri:item.creator[0].profilePicture}} style={styles.profilePic}/>
                                            :
            <Image source={require("../assets/images/model.jpg")} style={styles.profilePic}/>
        }
        </View>
        <Text style={{fontFamily:"Poppins-Light",fontSize:14}}>{item.creator[0].username}</Text>
    </TouchableOpacity>
    )
})

export default StoriesComp

const styles = StyleSheet.create({
        profilePic:{
            width:65,
            height:65,
            borderRadius:50,
            objectFit:"cover",
            margin:2
        }
})