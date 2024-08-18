import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useSelector } from 'react-redux';
import { rootStore } from '@/app/redux/store';


export default function TabBar({ state, descriptors, navigation }) {
  const navbarOpened = useSelector((state:rootStore) => state.navbar.navbar)
  console.log("Navbar Opened",navbarOpened)
  return (
    <View style={{ flexDirection: 'row',alignItems:"center",paddingVertical:10,marginHorizontal:10,borderRadius:50,display:navbarOpened?"none" :"flex",zIndex:1,backgroundColor:"#fff",elevation:10,position:"absolute",bottom:10}}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        }

        const icons ={
            home : (props) =>
             <View style={{backgroundColor: isFocused?"#f2f2f2":null,padding:10,borderRadius:50}}>
               <AntDesign name="home" size={28} color="#d92b68" {...props} />
            </View>,
            profile : (props) => 
              <View style={{backgroundColor: isFocused?"#f2f2f2":null,padding:10,borderRadius:50}}>
                <AntDesign name="user" size={28} color="#d92b68" {...props} />
             </View>,
            add : (props) => 
              <View style={{backgroundColor: isFocused?"#f2f2f2":null,padding:10,borderRadius:50}}>
                <AntDesign name="pluscircle" size={28} color="#d92b68" {...props} />
             </View>,
            reels : (props) => <AntDesign name="videocamera" size={28} color="#d92b68" {...props} />, 
            search : (props) => <AntDesign name="search1" size={28} color="#d92b68" {...props} />, 

        }

        return (
          <TouchableOpacity key={index}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems:"center"}}
          >
            {icons[route.name]({
                color: isFocused ? Colors.light.text : Colors.light.text
            })}

          </TouchableOpacity>
        );
      })}
    </View>
  );
}