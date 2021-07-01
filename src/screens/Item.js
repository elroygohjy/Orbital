import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, KeyboardAvoidingView, Linking} from 'react-native';
import {Button} from "react-native-elements"
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import firebase from 'firebase'
import { useIsFocused } from "@react-navigation/native";

export default ({route, navigation}) => {

    var {id, currentPrice, targetPrice, URL, lastUpdate} = route.params
    const [target, setTarget] = useState(targetPrice)

    const isFocused = useIsFocused();

    useEffect(() => {}, [isFocused]);

    const deleteItem = () => {
        firebase
        .firestore()
        .collection('users/' + firebase.auth().currentUser.email + '/items')
        .doc(id)
        .delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        })
        
        navigation.reset({routes: [{ name: 'Homepage' }]})
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            firebase
            .firestore()
            .collection('users/' + firebase.auth().currentUser.email + '/items')
            .doc(id)
            .get().then((doc) => {
                if (doc.exists) {
                    setTarget(doc.data().TargetPrice)
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        });
        return unsubscribe
    }, [navigation]);

    let [loaded] = useFonts({
        ProximaNova: require('../assets/fonts/ProximaNova.otf'),
        ProximaNovaBold: require('../assets/fonts/ProximaNova-Bold.otf')
    });
      
    if (!loaded) {
        return <AppLoading />;
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.header}>Item Details</Text>
            </View>
            <View style={styles.prices}>
                <Text style={styles.price}>Current Price: {currentPrice}</Text>
                <Text style={styles.price}>Target Price: ${target}</Text>
                <Text style={styles.price}>Last Updated: {lastUpdate}</Text>
            </View>
            <Button
                buttonStyle={styles.edit} 
                title="Edit Target Price"
                titleStyle={styles.buttonText}
                onPress={() => navigation.navigate("Edit Price", 
                    {id: id, target: target, currentPrice: currentPrice})}
            />
            <Button
                buttonStyle={styles.delete} 
                title="Delete Item"
                titleStyle={styles.buttonText}
                onPress={deleteItem}
            />
            <Button
                buttonStyle={styles.buy} 
                title="Buy Now"
                titleStyle={styles.buttonText}
                onPress={() => Linking.openURL(URL)}
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
            fontFamily: 'ProximaNova'
        },
        row: {
            flexDirection: 'row',
            marginTop: 100,
            marginBottom: 20,
            fontFamily: 'ProximaNova',
        },
        header: {
            fontFamily: 'ProximaNovaBold',
            fontSize: 30,
        },
        edit: {
            backgroundColor: "#133480",
            borderRadius: 20,
            width: 295,
            marginBottom: 20,
            marginTop: 20
        },
        delete: {
            backgroundColor: "#c23d22",
            borderRadius: 20,
            width: 295,
            marginBottom: 20
        },
        buy: {
            backgroundColor: "green",
            borderRadius: 20,
            width: 295,
            marginBottom: 20
        },
        buttonText: {
            fontFamily: 'ProximaNova',
        },
        prices: {
            flexDirection: 'column',
            fontFamily: 'ProximaNova'
        },
        price: {
            fontFamily: 'ProximaNova',
            fontSize: 20,
            padding: 5,
            marginBottom: 5
        }
    })

