import { Text, TouchableOpacity, View } from "react-native"
import { CameraView , useCameraPermissions } from "expo-camera"
import { useState } from "react";
function Camera(){
    const [facing, setFacing] = useState('back');
    const [permission,requestPermission] = useCameraPermissions()

    // const Permission = () =>{
    //     permission()
    // }
    if(!permission?.granted){
        return(
            <TouchableOpacity style={{justifyContent:"center",alignItems:"center",flex:1}} onPress={requestPermission}>
                <Text>Grant Access</Text>
            </TouchableOpacity>
        )
    }
    else{
        console.log("GRANTED")
        return(
                    <CameraView facing="front" style={{flex:1}}>
                        <View>
                            <Text>Ranvin</Text>
                        </View>
                    </CameraView>
          
        )
    }
}

export default Camera