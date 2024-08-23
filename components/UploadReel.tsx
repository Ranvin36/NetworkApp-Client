import { View,Text, StyleSheet,Dimensions, Image} from "react-native"
import ReelUploader from "./ReelUploader"

function UploadReel({user,image,text,setImage}){
    return(
        <View style={styles.container}>
          {image.uri ? 
            <Image source={{uri : image.uri}} style={{width:"100%",height:250,borderRadius:10}}/>
              :
            <Image source={require("../assets/images/user.jpg")} style={{width:"100%",height:250,borderRadius:10}}/>
          }
            <View style={styles.infoContainer}>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                  {user.profilePicture ? 
                    <Image source={{uri:user.profilePicture}} style={styles.image} />
                                       :
                    <Image source={require("../assets/images/model.jpg")} style={styles.image} />
                  }
                    <Text style={styles.title}>{user.username}</Text>
                </View>
                <Text style={styles.subtitle}>{text ? text : "Description"}</Text>
            </View>
        </View>
    )
}

export default UploadReel

const styles =StyleSheet.create({
    container:{
        backgroundColor:"#fff",
        alignSelf:"center",
        width:Dimensions.get('window').width-50,
        borderRadius:10,
        position:"relative"
    },    
    infoContainer: {
        position: "absolute",
        zIndex: 1,
        bottom: 10,
        left: 10,
      },  
    image: {
        borderRadius: 50,
        width: 15,
        height:15,
      },
    title: {
        fontSize: 9,
        color: "#fff",
        fontFamily: 'Poppins-Regular',
        marginLeft: 5,
      },
    subtitle: {
        fontFamily: "Poppins-Light",
        color: "#fff",
        fontSize:7,
        margin:2
      },
    iconContainer: {
        position: "absolute",
        right: 15,
        bottom: 60,
        zIndex: 1,
      },
})