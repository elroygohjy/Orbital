import { StyleSheet, Text, KeyboardAvoidingView, TouchableOpacity, View } from "react-native"
import {Input, Button} from "react-native-elements"
import React, {useState} from "react"
import {signIn} from '../../api/auth'
import Icon from "react-native-vector-icons/FontAwesome"
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

export default ({navigation}) => {

    const handleLogin = () => {
        signIn({email, password}, () => navigation.navigate('Homepage'), 
        (error) => console.error(error))
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    let [loaded] = useFonts({
        ProximaNova: require('../assets/fonts/ProximaNova.otf'),
    });
      
    if (!loaded) {
        return <AppLoading />;
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}>
            <Input
                style={styles.textForLogin}
                leftIcon={
                        <Icon
                            name="envelope"
                            color="#ccd9ff"
                            size={15}
                        />
                    }
                underlineColorAndroid="transparent"
                placeholder="Email"
                value={email}
                onChangeText={(email) => setEmail(email)}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
                inputContainerStyle={styles.textField}
            />
            <Input
                style={styles.textForLogin}
                leftIcon={
                    <Icon
                        name="lock"
                        color="#ccd9ff"
                        size={20}
                    />
                }
                placeholder="Password"
                value={password}
                onChangeText={(password) => setPassword(password)}
                secureTextEntry={true}
                inputContainerStyle={styles.textField}
            />

            <Button
                buttonStyle={styles.button} onPress={handleLogin}
                titleStyle={styles.buttonText}
                title="Login"
            />
            <View style={styles.row}>
                <Text style={styles.regText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
                    <Text style={styles.link}>Sign up.</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )

}


const styles = StyleSheet.create(
    {
        container: {
            paddingHorizontal: '10%',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            fontFamily: 'ProximaNova'
        },
        button: {
            backgroundColor: "black",
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
        },
        buttonText: {
            fontFamily: 'ProximaNova'
        },
        text: {
            fontFamily: 'ProximaNova'

        },
        regText: {
            marginTop: 10,
            fontSize: 15,
            color: 'black',
            fontFamily: 'ProximaNova'
        },
        textForLogin: {
            fontFamily: 'ProximaNova'
        },
        link: {
            marginTop: 8,
            fontSize: 15,
            color: 'black',
            fontFamily: 'ProximaNova',
            fontWeight: 'bold'
        },
        textField: {
            backgroundColor: '#ffffff',
            borderBottomWidth: 5,
            borderWidth: 5,
            borderColor: '#ffffff',
            borderRadius: 20,
            paddingLeft: 5
        },
        row: {
            flexDirection: 'row',
            marginTop: 4,
        },
    })

