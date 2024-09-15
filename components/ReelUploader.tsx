import { router } from "expo-router"
import React from "react"
import { View,Text,Image, StyleSheet, TouchableOpacity } from "react-native"

type User={
  userId:string[],
  username:string,
  profilePicture:string
}

type ReelTypes={
  user:User,
  text:string
}

const ReelUploader:React.FC<ReelTypes>=({user,text}) =>{
  function ViewProfile(){
    router.push({pathname:`viewProfile/${user.userId}`, params:{id:user.userId}})
  }
    return(
        <View style={styles.infoContainer}>
            <TouchableOpacity style={{flexDirection:"row",alignItems:"center"}} onPress={ViewProfile}>
              <Image source={{uri:user.profilePicture}} style={styles.image} />
              <Text style={styles.title}>{user.username}</Text>
            </TouchableOpacity>
            <Text style={styles.subtitle}>{text}</Text>
      </View>
    )
}

export default ReelUploader

const styles = StyleSheet.create({
    infoContainer: {
        position: "absolute",
        zIndex: 1,
        bottom: 30,
        left: 10,
      },  image: {
        borderRadius: 50,
        width: 50,
        height: 50,
      },
    title: {
        fontSize: 15,
        color: "#fff",
        fontFamily: 'Poppins-Regular',
        marginLeft: 10,
      },
      subtitle: {
        margin: 7,
        fontFamily: "Poppins-Light",
        color: "#fff",
      },
      iconContainer: {
        position: "absolute",
        right: 15,
        bottom: 60,
        zIndex: 1,
      },
})