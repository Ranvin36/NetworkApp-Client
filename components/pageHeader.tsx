import { StyleSheet,View,Text } from "react-native"
import BackArrow from "@/components/backArrow"
import { ColorPalatte } from "@/constants/Colors"
const Colors = ColorPalatte()

type HeaderProps = {
    text:string
}
const PageHeader:React.FC<HeaderProps>= ({text}) =>{
    return(
        <View style={styles.header}>
            <BackArrow/>
            <Text style={{fontFamily:"Poppins-Bold",fontSize:25,color:Colors.theme.fontColor,marginLeft:10}}>{text}</Text>
        </View>
    )
}


export default PageHeader

const styles =  StyleSheet.create({
    header:{
            paddingTop:40,
            flexDirection:"row",
            alignItems:"center"
    }
})