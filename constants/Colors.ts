import { Appearance } from "react-native";

export function ColorPalatte(){
  const colorSchema = Appearance.getColorScheme()
  const darkMode = colorSchema == 'dark' ? 1 :0
  const colors = {
    light: {
      text: '#d92b68',
      background: '#fff',
      secondaryBackground: '#f2f2f2',
      tabIconDefault: '#687076',
    },
    dark: {
      text: '#ECEDEE',
      background: '#1d1d1d',
      icon: '#9BA1A6',
      tabIconDefault: '#9BA1A6',
    },
    theme:{
      backgroundColor:darkMode?"#121212":"#fff",
      primary:"#d92b68",
      backgroundTransparent:darkMode?"#1d1d1d":"#f2f2f2",
      fontColor:darkMode?"#fff":"#000",
      commentsBg: darkMode?"#1d1d1d":"#fff",
      primaryMix:darkMode?"#fff":"#f2f2f2",
    }
  };

  return colors
}


// Background : "#fff"
// BackgroundTransparent: "#f2f2f2"
// FontColor :"#000"
// HeaderIcon : "#ebe6e6"
// commentsBg: "#fff"
// #efefef