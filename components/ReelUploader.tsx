import { View,Text,Image, StyleSheet } from "react-native"

function ReelUploader(){
    return(
        <View style={styles.infoContainer}>
            <View style={{flexDirection:"row",alignItems:"center"}}>
            <Image source={require("../assets/images/model.jpg")} style={styles.image} />
            <Text style={styles.title}>Motion Rades</Text>
            </View>
            <Text style={styles.subtitle}>4 Years Ago!!</Text>
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