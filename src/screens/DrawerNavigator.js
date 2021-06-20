import React from "react";
import {Text} from 'react-native'
import {createStackNavigator} from "@react-navigation/stack"
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem,
DrawerItemList} from "@react-navigation/drawer";
import Login from "./Login"
import SignUp from "./SignUp"
import Homepage from "./Homepage"
import Loading from "./Loading"
import AddItem from "./AddItem"
import SetPrice from "./SetPrice"
import {signOut} from '../../api/auth'
import {navigationRef, navigate} from './RootNavigation';
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator();
const handleLogout = () => {
  signOut(() => navigate('Login'), 
  (error) => console.error(error))
}

function CustomDrawerContent(props) {
  let [loaded] = useFonts({
    ProximaNova: require('../assets/fonts/ProximaNova.otf')
  });
  
  if (!loaded) {
      return <AppLoading />;
  } 

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label={() => <Text style={{ color: 'black',
      fontFamily: 'ProximaNova',
      fontSize: 17}}>Logout</Text>}
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
}

const ContactStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Loading"
            screenOptions={
                {title: ""}
            }>
            <Stack.Screen name={"Loading"} component={Loading}/>
            <Stack.Screen name={"Login"} component={Login}
            screenOptions/>
            <Stack.Screen name={"Sign Up"} component={SignUp}/>
            <Stack.Screen name={"Homepage"} component={Homepage}/>
            <Stack.Screen name={"Add Item"} component={AddItem}/>
            <Stack.Screen name={"Set Price"} component={SetPrice}/>
        </Stack.Navigator>
    );
  }

const DrawerNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef} independent={true}>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
        drawerContentOptions={{
          labelStyle:{
            fontFamily: 'ProximaNova',
            fontSize:17
          }
        }}
        initialRouteName="Homepage"
        screenOptions={{ swipeEnabled: false }}>
        <Drawer.Screen name="Home" component={ContactStackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
    
  );
}

export default DrawerNavigator;