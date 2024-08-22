import { View,Text, StyleSheet,TouchableOpacity} from "react-native"
import { Feather } from '@expo/vector-icons';
import SettingOptions from "@/components/settingsOption";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
function Settings(){

    async function LogOut(){
        try{
            console.log("INSIe")
            const clearData = await AsyncStorage.clear()
            router.replace("/login")
        }
        catch(error){
            console.log(error)
        }
    }

    return(
        <View style={styles.container}>
            <Text style={{fontFamily:"Poppins-Regular",fontSize:20}}>Settings & Privacy</Text>
            <View style={styles.settingLayout}>
                    <Text style={{fontFamily:"Poppins-Bold",color:"#ccc"}}>Account Settings</Text>
                    <View style={styles.settingOptions}>
                       <SettingOptions title="Notifications" icon="bell"/>
                       <SettingOptions title="Liked" icon="heart"/>
                       <SettingOptions title="Saved" icon="bookmark"/>
                       <SettingOptions title="Edit Profile" icon="edit"/>
                       <SettingOptions title="Blocked" icon="user-x"/>
                    </View>
            </View>
            <View style={styles.settingLayout}>
                    <Text style={{fontFamily:"Poppins-Bold",color:"#ccc"}}>User Prefrences</Text>
                    <View style={styles.settingOptions}>
                       <SettingOptions title="Notifications" icon="bell"/>
                       <SettingOptions title="Liked" icon="heart"/>
                       <SettingOptions title="Saved" icon="bookmark"/>
                       <SettingOptions title="Edit Profile" icon="edit"/>
                       <TouchableOpacity onPress={LogOut}>
                            <SettingOptions title="Log Out" icon="user-x"/>
                       </TouchableOpacity>
                    </View>
            </View>
        </View>
    )
}


export default Settings

const styles = StyleSheet.create({
    container:{
        paddingHorizontal:25,
        paddingVertical:55
    },
    settingLayout:{
        marginVertical:10
    },
    settingOptions:{
        backgroundColor:"#fff",
        padding:15,
        borderRadius:10,
        marginVertical:5
    }
})