import React from 'react'
import { NavigationContainer} from "@react-navigation/native"
import {createStackNavigator} from "@react-navigation/stack"
import LoginScreen from "./src/screens/LoginScreen"
import firebase from "./api/authkey"
const Stack = createStackNavigator()
import SignUpScreen from "./src/screens/SignUpScreen"
const screens = [
    {name: "Login", component: LoginScreen},
    {name: "SignUp", component: SignUpScreen}
]
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={screens[0].name} >
                <Stack.Screen name={"Login"} component={LoginScreen}/>
                <Stack.Screen name={"SignUp"} component={SignUpScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

