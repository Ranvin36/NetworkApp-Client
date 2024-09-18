import { useState } from "react"
import { StyleSheet,View,Text,Dimensions} from "react-native"
import { GestureDetector,Gesture} from "react-native-gesture-handler"
import Animated,{withSpring,useAnimatedStyle, useSharedValue} from "react-native-reanimated"
function BottomSheet({children,openBottomSheet}){
    const {width:SCREEN_WIDTH , height:SCREEN_HEIGHT} = Dimensions.get('window')
    const offSet = useSharedValue(SCREEN_HEIGHT)
    const context = useSharedValue(0)
    const [bottomSheetOpened,setBottomSheetOpened] = useState(false)

    const gesture = Gesture.Pan().onStart((event) =>{
        context.value = offSet.value
    }).onUpdate((event) =>{
        offSet.value = event.translationY + context.value
        offSet.value = Math.max(offSet.value , -SCREEN_HEIGHT/10)
    }).onEnd((event) =>{
        if(offSet.value > -SCREEN_HEIGHT/30){
            offSet.value=withSpring(SCREEN_HEIGHT , {damping:50})
        }
        else if(offSet.value > -SCREEN_HEIGHT/20){
            offSet.value=withSpring(0 , {damping:50})
        }
        if(offSet.value < -SCREEN_HEIGHT/30){
            offSet.value=withSpring(0 , {damping:50})
        }
    })
    
      const animateBottomSheet = useAnimatedStyle(() =>{
        return{
          transform: [{translateY:offSet.value}]
        }
      })

    return(
        <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheet,animateBottomSheet]}>
            {children}
        </Animated.View>
</GestureDetector>
    )
}

export default BottomSheet


const styles = StyleSheet.create({
    bottomSheetText:{
        fontFamily:"Poppins-Light",
        fontSize:15
      },
      textWrap:{
        marginVertical:6
      },
      bottomSheet:{
        position:"absolute",
        backgroundColor:"#fff",
        bottom:-100,
        width:Dimensions.get('window').width,
        alignSelf:"center",
        borderRadius:20,
        height:Dimensions.get('window').height/1.8
      },
      bottomSheetLayout:{
        paddingHorizontal:20,
        paddingVertical:10
      },
      
})