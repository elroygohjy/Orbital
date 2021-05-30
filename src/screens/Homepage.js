import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Button} from "react-native-elements"
import {signOut} from '../../api/auth'
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

export default ({navigation}) => {
    const handleLogout = () => {
        signOut(() => navigation.navigate('Login'), 
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
                titleStyle={styles.buttontext}
                title="Sign Out"
            />
        </View>
      );
}


const styles = StyleSheet.create(
    {
        container: {
            paddingHorizontal: '10%',
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
        },
        buttontext: {
            fontFamily: 'ProximaNova'
        },
        button: {
            backgroundColor: "black",
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
        }
    })

