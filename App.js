import React from "react";
import {Text, StyleSheet} from 'react-native'
import {createStackNavigator} from "@react-navigation/stack"
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem,
DrawerItemList} from "@react-navigation/drawer";
import Login from "./src/screens/Login"
import SignUp from "./src/screens/SignUp"
import Homepage from "./src/screens/Homepage"
import Loading from "./src/screens/Loading"
import AddItem from "./src/screens/AddItem"
import SetPrice from "./src/screens/SetPrice"
import {signOut} from './api/auth'
import {navigationRef, navigate} from './src/navigators/RootNavigation';
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
        ProximaNova: require('./src/assets/fonts/ProximaNova.otf')
    });
    
    if (!loaded) {
        return <AppLoading />;
    } 

    return (
        <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem label={() => <Text style={styles.logout}>Logout</Text>}
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
            <Stack.Screen name={"Login"} component={Login}/>
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
                labelStyle: styles.home
            }}
            initialRouteName="Homepage"
            screenOptions={{swipeEnabled: false}}>
            <Drawer.Screen name="Home" component={ContactStackNavigator} />
        </Drawer.Navigator>
    </NavigationContainer>    
  );
}

export default function App() {
    return (
        <NavigationContainer>
            <DrawerNavigator/>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create(
    {
        home: {
            fontFamily: 'ProximaNova',
            fontSize:17
        },
        logout: {
            color: 'black',
            fontFamily: 'ProximaNova',
            fontSize: 17
        }
    })