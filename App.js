import React from 'react'
import {NavigationContainer} from "@react-navigation/native"
import {createStackNavigator} from "@react-navigation/stack"
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from "./src/screens/Login"
import SignUp from "./src/screens/SignUp"
import Homepage from "./src/screens/Homepage"
import Loading from "./src/screens/Loading"
import AddItem from "./src/screens/AddItem"
import SetPrice from "./src/screens/SetPrice"
import Icon from "react-native-vector-icons/FontAwesome"
import firebase from "./api/authkey"
import DrawerNavigator from "./src/screens/DrawerNavigator"

const Stack = createStackNavigator()

const screens = [
    {name: "Loading", component: Loading},
    {name: "Login", component: Login},
    {name: "Sign Up", component: SignUp},
    {name: "Homepage", component: Homepage}
]

export default function App() {

    return (
        <NavigationContainer>
            <DrawerNavigator/>
        </NavigationContainer>
    );
}

