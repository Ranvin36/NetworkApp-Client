import { StyleSheet, View,Text , TextInput,TouchableOpacity } from "react-native";
import { AntDesign,Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import TouchButton from "@/components/touchButton";
import BackArrow from "@/components/backArrow";
import axios from "axios";
import { ipAddress } from "@/constants/ipAddress";
import { useSelector } from "react-redux";
import { rootStore } from "./redux/store";
import { router } from "expo-router";
function NewPassword(){
    const [secretField, setSecretField] = useState(true)
    const user = useSelector((state:rootStore) => state.user.user)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    function eyeToggle(){
        setSecretField((prev) => !prev)
    }

    async function ResetPassword(){
        if(confirmPassword == password){
            const data = {"newPassword":password, "userId":user[0]._id}
            console.log(data)
            try{
                const response = await axios.post(`http://${ipAddress}:3001/users/reset-password`,data)
                router.push("/")
            }
            catch(error){
                console.log(error)
            }

        }
        
    }

    return(
        <View style={styles.container}>
            <BackArrow/>
            <View style={{marginTop:30}}>
                <Text style={{fontFamily:"Poppins-Bold" , fontSize:35}}>Reset,</Text>
                <Text style={{fontFamily:"Poppins-Bold" , fontSize:33}}>Your Password</Text>
            </View>
            <View style={{marginVertical:5}}>
                <Text style={{fontFamily:"Poppins-Light"}}>Get Your Password Changed</Text>
            </View>
            <View style={[styles.fieldContainer,{position:'relative'}]}>
                        <AntDesign name="lock" size={22} color="black"  style={{marginBottom:3}}/>
                        <TextInput  placeholder="New Password"  style={{fontFamily:"Poppins-Light",width:"100%",marginLeft:5}} secureTextEntry={secretField} onChangeText={(e) => setPassword(e)}/>
                        {secretField ? 
                            <TouchableOpacity style={styles.eyeContainer}  onPress={eyeToggle}>
                                <Ionicons name="eye-off" size={24} color="black" />
                            </TouchableOpacity>
                                                            :
                            <TouchableOpacity style={styles.eyeContainer}  onPress={eyeToggle}>
                                <Ionicons name="eye" size={24} color="black" />
                            </TouchableOpacity>
                    }
            </View>
            <View style={[styles.fieldContainer,{position:'relative'}]}>
                        <AntDesign name="lock" size={22} color="black"  style={{marginBottom:3}}/>
                        <TextInput  placeholder="Confirm New Password"  style={{fontFamily:"Poppins-Light",width:"100%",marginLeft:5}} secureTextEntry={secretField} onChangeText={(e) => setConfirmPassword(e)}/>
                        {secretField ? 
                            <TouchableOpacity style={styles.eyeContainer}  onPress={eyeToggle}>
                                <Ionicons name="eye-off" size={24} color="black" />
                            </TouchableOpacity>
                                                            :
                            <TouchableOpacity style={styles.eyeContainer}  onPress={eyeToggle}>
                                <Ionicons name="eye" size={24} color="black" />
                            </TouchableOpacity>
                    }
            </View>
            <TouchButton text="Reset Password" onPress={ResetPassword}/>

        </View>
    )
}

export default NewPassword


const styles = StyleSheet.create({
    container:{
        paddingVertical:70,
        paddingHorizontal:30,
    },
    eyeContainer:{
        position:'absolute',
        top:"50%",
        right:20
    },
    fieldContainer:{
        borderWidth:1,
        padding:13,
        flexDirection:"row",
        alignItems:"center",
        borderRadius:10,
        marginVertical:5
    }
})