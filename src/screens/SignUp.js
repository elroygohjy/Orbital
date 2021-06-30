import {StyleSheet, View, KeyboardAvoidingView, Text} from "react-native"
import {Input, Button} from "react-native-elements"
import React, {useState} from "react"
import Icon from "react-native-vector-icons/FontAwesome"
import {createAccount} from '../../api/auth'
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';


export default ({navigation}) => {
    const handlePress = () => {
        if (password != password1) {
            //Alert.alert("Passwords do not match.")
            setError("Passwords do not match.")
            setFieldError('Error')
        } else {
            createAccount({name, email, password},
                () => navigation.navigate('Login'),
                (error) => {
                    setError(error)
                    setFieldError('Error')
                })
        }
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password1, setPassword1] = useState('');
    const [name, setName] = useState('');
    const [fieldError, setFieldError] = useState(null);
    const [error, setError] = useState('')

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
            <View style={styles.error}>
                {fieldError && <Text style={styles.errorText}>{error.toString()}</Text>}
            </View>
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
                inputContainerStyle={[styles.textField,
                    fieldError ? styles.invalid : null]}
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
                inputContainerStyle={[styles.textField,
                    fieldError ? styles.invalid : null]}
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
                inputContainerStyle={[styles.textField,
                    fieldError ? styles.invalid : null]}
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
            marginBottom: 10,
            fontSize: 35
        },
        textBox: {
            fontFamily: 'ProximaNova',
            paddingLeft: 15
        },
        textField: {
            backgroundColor: '#ffffff',
            borderBottomWidth: 2,
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
        },
        invalid: {
            borderColor: 'red',
            borderWidth: 2
        },
        error: {
            padding: 15
        },
        errorText: {
            fontFamily: 'ProximaNova',
            fontSize: 20,
            textAlign: 'center'
        }
    })


