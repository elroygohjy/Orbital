import {Alert, StyleSheet, View, KeyboardAvoidingView, Text} from "react-native"
import {Input, Button} from "react-native-elements"
import React, {useState} from "react"
import Icon from "react-native-vector-icons/FontAwesome"
import {createAccount} from '../../api/auth'
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';

const SignUp = ({navigation}) => {
    const handlePress = () => {
        if (password != password1) {
            Alert.alert("Passwords do not match.")
        }
        createAccount({name, email, password},
            () => navigation.navigate('Login'), (error) => {console.error(error)})
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password1, setPassword1] = useState('');
    const [name, setName] = useState('');

    let [loaded] = useFonts({
        ProximaNova: require('../assets/fonts/ProximaNova.otf'),
    });
      
    if (!loaded) {
        return <AppLoading />;
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}>
            <Text style={styles.header}>Create Account</Text>
            <Input
                style={styles.textBox}
                leftIcon={
                    <Icon
                        name="envelope"
                        color="#133480"
                        size={15}
                    />
                }
                placeholder="Email Address"
                value={email}
                onChangeText={(email) => setEmail(email)}
                inputContainerStyle={styles.textField}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
            />
            <Input
                style={styles.textBox}
                leftIcon={
                    <Icon
                        name="lock"
                        color="#133480"
                        size={20}
                    />
                }
                placeholder="Password"
                value={password}
                onChangeText={(password) => setPassword(password)}
                secureTextEntry={true}
                inputContainerStyle={styles.textField}
            />
            <Input
                style={styles.textBox}
                leftIcon={
                    <Icon
                        name="lock"
                        color="#133480"
                        size={20}
                    />
                }
                placeholder="Confirm password"
                value={password1}
                onChangeText={(password1) => setPassword1(password1)}
                secureTextEntry={true}
                inputContainerStyle={styles.textField}
            />
            <Button
                buttonStyle={styles.button} 
                onPress={handlePress}
                title="Sign up"
                titleStyle={styles.buttonText}
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
            justifyContent: 'flex-start',
            alignItems: 'center',
            fontFamily: 'ProximaNova',
        },
        header: {
            fontFamily: 'ProximaNova',
            marginTop: 100,
            marginBottom: 50,
            fontSize: 35
        },
        textBox: {
            fontFamily: 'ProximaNova',
            paddingLeft: 15
        },
        textField: {
            backgroundColor: '#ffffff',
            borderBottomWidth: 5,
            borderWidth: 5,
            borderColor: '#ffffff',
            borderRadius: 20,
            paddingLeft: 10
        },
        button: {
            backgroundColor: "#133480",
            borderRadius: 20,
            width: 295
        },
        buttonText: {
            fontFamily: 'ProximaNova'
        }
    })

    export default SignUp


