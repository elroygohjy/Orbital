import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from "react-native-elements"
import {signOut} from '../../api/auth'
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';

export default ({navigation}) => {
    const handleLogout = () => {
        signOut(() => navigation.replace('Login'), 
        (error) => console.error(error))
    }

    let [loaded] = useFonts({
        ProximaNova: require('../assets/fonts/ProximaNova.otf'),
    });
      
    if (!loaded) {
        return <AppLoading />;
    }

    return (
        <View style={styles.container}>
            <Button
                buttonStyle={styles.button} onPress={handleLogout}
                titleStyle={styles.buttonText}
                title="Sign Out"
            />
        </View>
    );
}

const styles = StyleSheet.create(
    {
        container: {
            paddingHorizontal: '30%',
            flex: 1,
            justifyContent: 'center',
        },
        button: {
            backgroundColor: "#133480",
            width: '100%',
            borderRadius: 20,
        },
        buttonText: {
            fontFamily: 'ProximaNova'
        }
    })

