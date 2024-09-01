import { View,Text, StyleSheet,TouchableOpacity} from "react-native"
import { Feather,MaterialIcons } from '@expo/vector-icons';
import SettingOptions from "@/components/settingsOption";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { ColorPalatte } from "@/constants/Colors";
import { useEffect, useState } from "react";
const Colors = ColorPalatte()

function Settings(){
    const [selectedMode,setSelectedMode] = useState(0)
    const offset =  useSharedValue(5)
    async function LogOut(){
        try{
            const clearData = await AsyncStorage.clear()
            router.replace("/login")
        }
        catch(error){
            console.log(error)
        }
    }

    const buttonStyles = useAnimatedStyle(() =>{
        return{
            left: offset.value
        }
    })

    function Switch(){
        if(selectedMode){
            offset.value = withSpring(5, {damping:15})
            AsyncStorage.setItem("themeMode",JSON.stringify(0))
        }
        else{
            offset.value = withSpring(22, {damping:15})
            AsyncStorage.setItem("themeMode",JSON.stringify(1))
        }
        setSelectedMode((prev) => !prev)
    }

    useEffect(() => {
        AsyncStorage.getItem("themeMode").then((value) => {
            if(value){
                setSelectedMode(JSON.parse(value))
                offset.value = withSpring(22, {damping:15})
            }
        }).catch((error) => {
            AsyncStorage.setItem("themeMode",JSON.stringify(1))
        })
    },[])

    return(
        <View style={styles.container}>
            <Text style={[styles.textColor,{fontFamily:"Poppins-Regular",fontSize:20}]}>Settings & Privacy</Text>
            <View style={styles.settingLayout}>
                    <Text style={{fontFamily:"Poppins-Bold",color:"#ccc"}}>Account Settings</Text>
                    <View style={styles.settingOptions}>
                       <SettingOptions title="Notifications" icon="bell" to="notifications"/>
                       <SettingOptions title="Liked" icon="heart" to="block"/>
                       <SettingOptions title="Saved" icon="bookmark" to="saved"/>
                       <SettingOptions title="Edit Profile" icon="edit" to="editProfile"/>
                       <SettingOptions title="Blocked" icon="user-x" to="block"/>
                    </View>
            </View>
            <View style={styles.settingLayout}>
                    <Text style={{fontFamily:"Poppins-Bold",color:"#ccc"}}>User Prefrences</Text>
                    <View style={styles.settingOptions}>
                       <TouchableOpacity style={{flexDirection:"row",marginVertical:10,justifyContent:"space-between"}}>
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                <MaterialIcons name="light-mode" size={24} color={Colors.theme.fontColor} />            
                                <Text style={[styles.textColor,{fontFamily:"Poppins-Light",marginLeft:10}]}>Switch Theme</Text>
                            </View>
                            <TouchableOpacity style={styles.switchMode} onPress={Switch}>
                                <Animated.View style={[buttonStyles,styles.switchButton]}>

                                </Animated.View>
                            </TouchableOpacity>
                        </TouchableOpacity>
                       {/* <SettingOptions title="Liked" icon="heart"/>
                       <SettingOptions title="Saved" icon="bookmark"/>
                       <SettingOptions title="Edit Profile" icon="edit"/>
                       <TouchableOpacity onPress={LogOut}>
                            <SettingOptions title="Log Out" icon="user-x"/>
                       </TouchableOpacity> */}
                    </View>
            </View>
            <View style={styles.endSection}>
                <TouchableOpacity style={styles.logoutButton} onPress={LogOut}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <MaterialIcons name="logout" size={24} color="#fff"/>
                        <Text style={{color:"#fff",fontFamily:"Poppins-Bold",marginLeft:5}}>Logout</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}


export default Settings

const styles = StyleSheet.create({
    container:{
        paddingHorizontal:25,
        paddingVertical:55,
        height:"100%",
        backgroundColor: Colors.theme.backgroundColor
    },
    settingLayout:{
        marginVertical:10
    },
    settingOptions:{
        backgroundColor:Colors.theme.backgroundTransparent,
        padding:15,
        borderRadius:10,
        marginVertical:5
    },
    textColor:{
        color:Colors.theme.fontColor
    },
    switchMode:{
        width:40,
        height:20,
        borderColor:Colors.theme.fontColor,
        borderWidth:1,
        borderRadius:30,
        justifyContent:"center",
        position:"relative"
    },
    switchButton:{
        backgroundColor:Colors.theme.fontColor,
        width:10,
        height:10,
        borderRadius:50,
        position:"absolute",
        // left:5
    },
    logoutButton:{
        backgroundColor:Colors.theme.primary,
        paddingVertical:15,
        borderRadius:50,
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row",
    },
    endSection:{
        marginVertical:10
    }
})