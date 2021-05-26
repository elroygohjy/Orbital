import { StyleSheet, Text, KeyboardAvoidingView } from "react-native"
import {Input, Button} from "react-native-elements"
import React, {useState} from "react"
import {signIn} from '../../api/auth'
import Icon from "react-native-vector-icons/FontAwesome"

export default ({navigation}) => {
    const handleLogin = () => {
        signIn({email, password}, () => {
            return console.log("sign-in successful")
        }, (error) => console.error(error))
    }

        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        return (
            <KeyboardAvoidingView
                style={styles.container}>
                <Text style={styles.text}>Enter your email:</Text>
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
                <Text style={styles.text}>Enter your password:</Text>
                <Input
                    style={styles.textForLogin}
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
                />

                <Button
                    buttonStyle={styles.button} onPress={handleLogin}
                    titleStyle={styles.buttonText}
                    title="Sign in"
                />
                <Text style={styles.registerAcc}
                      onPress={() => navigation.navigate('SignUp')}> Register an account </Text>

            </KeyboardAvoidingView>
        )

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
            height: '5%'
        },
        registerAcc: {
            fontSize: 20,
            color: 'blue',
            height: '5%',
        }

    })

