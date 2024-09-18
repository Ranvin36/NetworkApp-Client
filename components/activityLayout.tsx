import {View,Image,Text, StyleSheet} from "react-native"
import { ColorPalatte } from "@/constants/Colors"
import moment from "moment"
const Colors = ColorPalatte()

interface ActivitySummaryTypes{
    item:any
}

const ActivitySummary:React.FC<ActivitySummaryTypes> = ({item}) =>{
    const dateTime = moment(item.updatedAt).format("dd h:mm a")
    console.log(dateTime)
    return(
        <View style={styles.notification}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <View>
                            {item.creator[0].profilePicture ?
                                    <Image source={{uri:item.creator[0].profilePicture}} style={styles.profilePicture}/>
                                                            :
                                    <Image source={require("../assets/images/user.jpg")} style={styles.profilePicture}/>
                            }
                        </View>
                        <View style={styles.notificationTitles}>
                            <Text style={styles.notificationTextHighlight}>{item.creator[0].username}</Text>
                            <Text style={styles.notificationText}>{item.text}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.timeText}>{dateTime}</Text>
                    </View>
                </View>
    )
}

export default ActivitySummary

const styles = StyleSheet.create({
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