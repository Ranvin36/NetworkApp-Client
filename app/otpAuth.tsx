import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Image,
} from "react-native";
import BackArrow from "../components/backArrow";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { rootStore } from "./redux/store";
import { router, useLocalSearchParams } from "expo-router";
import { ipAddress } from "../constants/ipAddress";
import OtpDigits from "@/components/otpDigits";
import TouchButton from "@/components/touchButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorPalatte } from "@/constants/Colors";
import setOtp from "./redux/otpSlice";
import CustomCountDown from "@/components/CustomCountDown";
import { TouchableOpacity } from "react-native-gesture-handler";

const Colors = ColorPalatte();

function OtpAuth() {
    const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
    const [validOtp, setValidOtp] = useState(true);
    const [loading, setLoading] = useState(false);
    const [resendOtp, setResendOtp] = useState(false);
    const {token} = useLocalSearchParams()
    const dispatch = useDispatch();
    const user = useSelector((state: rootStore) => state.user);
    const receivedOtp = useSelector((state: rootStore) => state.otp?.otp?.data);

    function handleOtpChange(value:any, index:any) {
        const newOtp = [...otpDigits];
        newOtp[index] = value;
        setOtpDigits(newOtp);
    }

    async function CreateOtp() {
        const data = { "phoneNum": 94767544717 };
        try{
            const response = await axios.post(`http://${ipAddress}:3001/users/send-otp`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            dispatch(setOtp(response.data))
        }
        catch(error){
            console.log(error)
        }
    }

    console.log(receivedOtp)

    async function VerifyOtp() {
        setLoading(true)
        try {
            const data = { "sentOtp": receivedOtp.otp, "receivedOtp": otpDigits };
            const response = await axios.post(`http://${ipAddress}:3001/users/verify-otp`, data);
            try {
                await AsyncStorage.setItem('user', JSON.stringify(user));
            }
            catch (error) {
                console.log(error);
            }
            router.replace("/home");
        }
        catch (error) {
            console.log("error");
            setValidOtp(false);
        }
        setLoading(false)
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <BackArrow />
            <View style={{ marginTop: 5 }}>
                <Text style={[styles.textColor,{fontFamily:"Poppins-Bold",fontSize:30}]}>Enter The One Time Password</Text>
                <Text style={[styles.textColor,{fontFamily:"Poppins-Light"}]}>Enter The One Time Passcode Sent To Your Email</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: "center",
                justifyContent: "center",
                marginTop:10
            }}>

                {otpDigits.map((digits, index) => {
                    return (
                        <View key={index}>
                            <OtpDigits index={index} digits={digits} validOtp={validOtp} handleOtpChange={handleOtpChange} />
                        </View>
                    )
                })}
            </View>
            <View style={{ alignItems: "center", marginVertical: 10, flexDirection: "row", justifyContent: "center" }}>
                {resendOtp ?
                <TouchableOpacity onPress={CreateOtp}>
                    <Text style={[styles.textColor, { fontFamily: "Poppins-Light" }]}>Resend Otp</Text>
                </TouchableOpacity>
                    :
                    <>
                        <Text style={[styles.textColor, { fontFamily: "Poppins-Light" }]}>Resend Otp In </Text>
                        <CustomCountDown
                            until={10} // S
                            onFinish={() => setResendOtp(true)}
                        />
                    </>
                }
            </View>
            <View style={{ alignItems: "center" }}>
                {!validOtp && <Text style={{ fontFamily: "Poppins-Bold", color: "red" }}>Invalid Otp</Text>}
            </View>
            <TouchButton onPress={VerifyOtp} text="Verify Otp"loading={loading} />
        </View>
    )
}

export default OtpAuth;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 55,
        paddingHorizontal: 25,
        height: "100%",
        backgroundColor: Colors.theme.backgroundColor
    },
    box: {
        borderWidth: 1,
        width: 60,
        height: 60,
        marginHorizontal: 5,
        borderRadius: 5,
        textAlign: "center",
        fontFamily: "Poppins-Light"
    },
    textColor: {
        color: Colors.theme.fontColor
    }
});
