import React from "react";
import {Text, StyleSheet} from 'react-native'
import {createStackNavigator} from "@react-navigation/stack"
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import Login from "./src/screens/Login"
import SignUp from "./src/screens/SignUp"
import Homepage from "./src/screens/Homepage"
import Loading from "./src/screens/Loading"
import AddItem from "./src/screens/AddItem"
import Item from "./src/screens/Item"
import EditPrice from "./src/screens/EditPrice"
import Settings from "./src/screens/Settings"
import EditItemName from "./src/screens/EditItemName"
import Barcode from "./src/screens/Barcode"
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
        <DrawerItem label={() => <Text style={styles.label}>🏠  Home</Text>}
            onPress={() => navigate('Homepage')}
        />
        <DrawerItem label={() => <Text style={styles.label}>⚙️  Settings</Text>}
            onPress={() => navigate('Settings')}
        />
        <DrawerItem label={() => <Text style={styles.label}>🔑  Logout</Text>}
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
            <Stack.Screen name={"Item"} component={Item}/>
            <Stack.Screen name={"Edit Price"} component={EditPrice}/>
            <Stack.Screen name={"Settings"} component={Settings}/>
            <Stack.Screen name={"Edit Item Name"} component={EditItemName}/>
            <Stack.Screen name={"Barcode"} component={Barcode}/>
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
        label: {
            color: 'black',
            fontFamily: 'ProximaNova',
            fontSize: 17
        }
    })