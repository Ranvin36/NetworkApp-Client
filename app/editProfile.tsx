import BackArrow from "@/components/backArrow"
import { View,StyleSheet,Text, TextInput, Image,TouchableOpacity} from "react-native"
import { ColorPalatte } from "@/constants/Colors"
import TextInputLayout from "@/components/TextInput"
import { useSelector } from "react-redux"
import { rootStore } from "./redux/store"
import ProfileTextInput from "@/components/profileTextInput"
import {MaterialIcons} from '@expo/vector-icons';
import { useState } from "react"
const Colors = ColorPalatte()

const EditProfile:React.FC = () =>{
    const user = useSelector((state:rootStore) => state.user.user?.data)
    const [selected,setSelected] = useState("male")
    const [dropDownOpened,setDropDownOpened]  = useState(false)
    function ToggleDropDown(){
        setDropDownOpened((prev) => !prev)
    }
    return(
        <View style={styles.container}>
            <View style={styles.titleHeader}>
                <BackArrow/>
                <Text style={styles.headerText}>Edit Profile</Text>
            </View>
            <View style={styles.editContent}>
                <View style={{alignItems:"center"}}>
                    <Image source={{uri: user?.profilePicture}} style={styles.profilePicture}/>
                    <Text style={{fontFamily:"Poppins-Light",marginTop:5}}>{user?.username}</Text>
                </View>
                <View style={{width:"100%",paddingHorizontal:5,marginTop:10}}>
                    <ProfileTextInput user={user} placeholder="Edit Username" value={user?.username}/>
                    <ProfileTextInput user={user} placeholder="Edit Bio" value="Who Are You?"/>
                    <View>
                        <View style={styles.textLabel}>
                            <Text style={{fontFamily:"Poppins-Light"}}>Gender</Text>
                        </View>
                        <TouchableOpacity style={styles.dropDownSelect} onPress={ToggleDropDown}>
                            <Text style={{fontFamily:"Poppins-Light"}}>Gender</Text>
                            <View>
                                {dropDownOpened ? <MaterialIcons name="arrow-drop-down" size={24} color="black" /> :  <MaterialIcons name="arrow-drop-up" size={24} color="black" />}
                            </View>
                            <TouchableOpacity style={[styles.dropDown,{height:dropDownOpened?0:null}]}>
                                <View style={[styles.dropDownProps]}>
                                    <Text style={{fontFamily:"Poppins-Light"}}>Female</Text>
                                    <View>
                                        <MaterialIcons name="arrow-drop-down" size={24} color="black" />
                                    </View>
                                </View>
                                <View style={[styles.dropDownProps]}>
                                    <Text style={{fontFamily:"Poppins-Light"}}>Male</Text>
                                    {/* <View>
                                        <MaterialIcons name="arrow-drop-down" size={24} color="black" />
                                    </View> */}
                                </View>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default EditProfile


const styles = StyleSheet.create({
    container:{
        paddingVertical:40,
        paddingHorizontal:20,
        backgroundColor:Colors.theme.backgroundColor,
        height:"100%"
    },
    titleHeader:{
        flexDirection:"row",
        alignItems:"center"
    },
    headerText:{
        fontFamily:"Poppins-Bold",
        fontSize:20,
        marginHorizontal:10
    },
    profilePicture:{
        width:75,
        height:75,
        borderRadius:50
    },
    editContent:{
        alignItems:"center",
        paddingVertical:20,
    },
    textInput:{
        width:"100%",
        backgroundColor:Colors.theme.backgroundTransparent,
        paddingHorizontal:20,
        paddingVertical: 10,
        borderRadius:10,
        marginVertical:5
    },
    textLabel:{
        marginHorizontal:10
    },
    dropDownSelect:{
        borderWidth:1,
        borderColor:Colors.theme.backgroundTransparent,
        paddingHorizontal:20,
        paddingVertical: 10,
        borderRadius:10,
        flexDirection:"row",
        justifyContent:"space-between",
        position:"relative"
    },
    dropDown:{
        borderRadius:10,
        backgroundColor:Colors.theme.backgroundTransparent,
        position:"absolute",
        left:0,
        right:0,
        bottom:-100,
        // flexDirection:"row",
        // justifyContent:"space-between"
    },
    dropDownProps:{
        paddingHorizontal:20,
        paddingVertical: 10,
        flexDirection:"row",
        justifyContent:"space-between",
        // paddingVertical:5
    },
    selectedOption:{
        backgroundColor:"#fff",
    }
})