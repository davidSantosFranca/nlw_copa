import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { theme, useTheme } from 'native-base';
import { MagnifyingGlass, PlusCircle, SoccerBall } from 'phosphor-react-native';
import { Platform } from 'react-native';
import Details from '../screens/Details';
import Find from '../screens/Find';
import New from '../screens/New';
import Polls from '../screens/Polls';
import  SignIn from '../screens/SignIn';

const {Navigator, Screen} = createBottomTabNavigator();

function AppRoutes() {
  const {colors, sizes} = useTheme()
  return ( 
    <Navigator
      screenOptions={{ 
        headerShown:false,
        tabBarLabelPosition: 'beside-icon',
        tabBarActiveTintColor: colors.yellow[500],
        tabBarInactiveTintColor: colors.gray[300],
        tabBarStyle:{
          position: 'absolute',
          height: sizes[20],
          borderTopWidth:0,
          backgroundColor: colors.gray[800],
        },
        tabBarItemStyle:{
          position: 'relative',
          top: Platform.OS === 'android' ? -10 : 0
        }
      }}
    >
      <Screen
        name="new"
        component={New}
        options={{
          tabBarIcon: PlusCircle,
          tabBarLabel: 'Novo bolão'
        }}
      />
      <Screen
        name="find"
        component={Find}
        options={{tabBarButton:()=>null}}
      />
      <Screen
        name="details"
        component={Details}
        options={{tabBarButton:()=>null}}
      />
      <Screen
        name="polls"
        component={Polls}
        options={{
          tabBarIcon: SoccerBall,
          tabBarLabel: 'Meus bolões'
        }}
      />
    </Navigator>  
   );
}

export default AppRoutes;