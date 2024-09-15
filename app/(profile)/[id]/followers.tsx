import FollowerLayout from "@/components/followerLayout";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { rootStore } from "../../redux/store";
import { ipAddress } from "@/constants/ipAddress";
import { useLocalSearchParams } from "expo-router";
import { ColorPalatte } from "@/constants/Colors";


const Colors = ColorPalatte()
export default function Page() {
    const { id } = useLocalSearchParams();
    const [followerData, setFollowerData] = useState([]);
    const user = useSelector((state: rootStore) => state.user.user);

    async function GetFollowers() {
        try {
            const response = await axios.get(`http://${ipAddress}:3001/users/get-followers/${id}`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            setFollowerData(response.data);
        } catch (error) {
            console.error("Error fetching followers:", error);
        }
    }

    useEffect(() => {
        GetFollowers();
    }, []);

    return (
        <View style={styles.container}>
            {followerData && followerData.length > 0 ? 
                <FlatList
                    data={followerData}
                    renderItem={({ item }) => {
                        if(item.followers && item.followers.length>0){
                            return(
                              <FollowerLayout data={item.followers}/>
                            )
                          }
                          else{
                            return(
                                <View style={{ alignItems: "center", justifyContent: "center", height: "90%" }}>
                                    <Text style={{ fontFamily: "Poppins-Regular", fontSize: 18,color:Colors.theme.fontColor}}>No Followers</Text>
                                </View>
                            )
                          }
                    }}
                />
             : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: Colors.theme.backgroundColor,
        height: "100%"
    }
});
