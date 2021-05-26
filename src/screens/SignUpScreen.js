import {Alert, StyleSheet, Text, KeyboardAvoidingView} from "react-native"
import {Input, Button} from "react-native-elements"
import React, {useState} from "react"
import Icon from "react-native-vector-icons/FontAwesome"
import { createAccount } from '../../api/auth'

const SignUp = ({navigation}) => {
    const handlePress = () => {
        if (password != password1) {
            Alert.alert("password mismatch retry")
        }
        createAccount({name, email, password},
            () => navigation.navigate('Login'), (error) => {console.error(error)})

    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password1, setPassword1] = useState('');
    const [name, setName] = useState('');

    return (
        <KeyboardAvoidingView
            style={styles.container}>
            <Text style={styles.text}>Enter your Name:</Text>
            <Input style={styles.textForLogin}
                   leftIcon={
                       <Icon
                           name="user"
                           color="#ccd9ff"
                           size={15}
                       />
                   }
                   placeholder="Your name"
                   value={name}
                   onChangeText={(name) => setName(name)}
            />
            <Text style={styles.text}>Enter your Email Address:</Text>
            <Input
                style={styles.textForLogin}
                leftIcon={
                    <Icon
                        name="envelope"
                        color="#ccd9ff"
                        size={15}
                    />
                }
                placeholder="xyz@email.com"
                value={email}
                onChangeText={(email) => setEmail(email)}
                autoCapitalize="none"
            />

            <Text style={styles.text}>Enter your Password:</Text>
            <KeyboardAvoidingView style ={{flexDirection: 'row'}}>
            <Input
                style={[styles.textForLogin, {justifyContent: 'flex-start'}]}
                leftIcon={
                    <Icon
                        name="lock"
                        color="#ccd9ff"
                        size={20}
                    />
                }
                placeholder="password"
                value={password}
                onChangeText={(password) => setPassword(password)}
                secureTextEntry={true}
                inputContainerStyle={{width: '50%'}}
            />
            <Input
                style={[styles.textForLogin, {justifyContent: 'flex-end'}]}
                leftIcon={
                    <Icon
                        name="lock"
                        color="#ccd9ff"
                        size={20}
                    />
                }
                placeholder="Confirm your password"
                value={password1}
                onChangeText={(password1) => setPassword1(password1)}
                secureTextEntry={true}
                inputContainerStyle={{width: '50%', right: 365}}
            />
            </KeyboardAvoidingView>

            <Button
                buttonStyle={styles.button} onPress={handlePress}
                titleStyle={styles.buttonText}
                title="Sign up"
            />

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create(
    {
        container: {
            paddingHorizontal: '10%',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center'
        },
        button: {
            color: "blue",
            left: '5%',
            width: '15%'
        },
        buttonText: {
            fontSize: 20,
            color: "white",
            fontWeight: "bold",

        },
        text: {
            paddingLeft: 10,
            fontSize: 20,
            color: "grey",
            fontWeight: "bold",

        },
        textForLogin: {
            fontSize: 18,
            color: "black",
            fontWeight: "bold",
        },
        registerAcc: {
            fontSize: 20,
            color: 'blue',
        },
        names: {
            fontSize: 20,
            flexDirection: "row",
            color: "black",
        }

    })
export default SignUp

