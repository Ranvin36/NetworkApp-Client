import { StyleSheet, View,Text, Image} from "react-native"
import { ColorPalatte } from "@/constants/Colors"
import BackArrow from "@/components/backArrow"
import PageHeader from "@/components/pageHeader"
const Colors = ColorPalatte()

const Notifications:React.FC = () =>{
    return(
        <View style={styles.container}>
            <PageHeader text="Notifications"/>
            <View style={styles.notificationsContainer}>
                <View style={styles.notification}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <View>
                            <Image source={require("../assets/images/user.jpg")} style={styles.profilePicture}/>
                        </View>
                        <View style={styles.notificationTitles}>
                            <Text style={styles.notificationTextHighlight}>Ranvin Uploaded A post</Text>
                            <Text style={styles.notificationText}>Sl vs Eng. England On Top</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.timeText}>Tue 12:50</Text>
                    </View>
                </View>
                <View style={styles.notification}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <View>
                            <Image source={require("../assets/images/user.jpg")} style={styles.profilePicture}/>
                        </View>
                        <View style={styles.notificationTitles}>
                            <Text style={styles.notificationTextHighlight}>Ranvin Uploaded A post</Text>
                            <Text style={styles.notificationText}>Sl vs Eng. England On Top</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.timeText}>Tue 12:50</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}


export default Notifications

const styles = StyleSheet.create({
    container:{
        paddingHorizontal:20,
        backgroundColor:Colors.theme.backgroundColor,
        height:"100%"
    },
    notificationsContainer:{
        paddingTop:15
    },
    profilePicture:{
        width:50,
        height:50,
        borderRadius:50
    },
    notification:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        marginVertical:5
    },
    notificationTextHighlight:{
        color:Colors.theme.fontColor,
        fontFamily:"Poppins-Bold"
    },
    notificationText:{
        fontFamily:"Poppins-Light",
        fontSize:12,
        marginTop:-5
    },
    notificationTitles:{
        marginLeft:10
    },
    timeText:{
        fontFamily:"Poppins-Light",
        fontSize:10,
        backgroundColor:Colors.theme.backgroundTransparent,
        padding:5,
        borderRadius:50,
        color:Colors.theme.fontColor
    }
})