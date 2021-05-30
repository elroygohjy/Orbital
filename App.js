import React from 'react'
import {NavigationContainer} from "@react-navigation/native"
import {createStackNavigator} from "@react-navigation/stack"
import Login from "./src/screens/Login"
import SignUp from "./src/screens/SignUp"
import Homepage from "./src/screens/Homepage"
import firebase from "./api/authkey"

const Stack = createStackNavigator()

const screens = [
    {name: "Login", component: Login},
    {name: "Sign Up", component: SignUp},
    {name: "Homepage", component: Homepage}
]

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={screens[0].name} 
                screenOptions={
                    {title: ""}
                }>
                <Stack.Screen name={"Login"} component={Login}/>
                <Stack.Screen name={"Sign Up"} component={SignUp}/>
                <Stack.Screen name={"Homepage"} component={Homepage}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

