import React from 'react'
import { NavigationContainer} from "@react-navigation/native"
import {createStackNavigator} from "@react-navigation/stack"
import LoginScreen from "./src/screens/LoginScreen"
import firebase from "./api/authkey"
const Stack = createStackNavigator()
import SignUpScreen from "./src/screens/SignUpScreen"
import Homepage from "./src/screens/Homepage"
const screens = [
    {name: "Login", component: LoginScreen},
    {name: "Sign Up", component: SignUpScreen},
    {name: "Homepage", component: Homepage}
]
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={screens[0].name}
            screenOptions={{
                title: ""
              }}>
                <Stack.Screen name={"Login"} component={LoginScreen}/>
                <Stack.Screen name={"Sign Up"} component={SignUpScreen}/>
                <Stack.Screen name={"Homepage"} component={Homepage}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

