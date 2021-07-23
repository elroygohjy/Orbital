import React, {useState, useEffect, useFocusEffect, useCallback} from 'react';
import {StyleSheet, Text, View, KeyboardAvoidingView, Linking,
TouchableOpacity, BackHandler, SafeAreaView, ScrollView, StatusBar} from 'react-native';
import {Button} from "react-native-elements"
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import firebase from 'firebase'
import { useIsFocused } from "@react-navigation/native";
import Icon1 from "react-native-vector-icons/FontAwesome"
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import { Rating } from 'react-native-ratings';

export default ({route, navigation}) => {

    var {id, currentPrice, targetPrice, URL, lastUpdate, item, 
        highestPrice, highestDate, lowestPrice, lowestDate, reviewCount, rating, site} = route.params
    const [target, setTarget] = useState(targetPrice)
    const [itemName, setItemName] = useState(item)

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
                    setItemName(doc.data().name)
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

    useEffect(() => {
        const backAction = () => {
            navigation.reset({routes: [{ name: 'Homepage' }]})
            return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
    
        return () => backHandler.remove();
      }, []);

      useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style={styles.icon}
                onPress={() => navigation.reset({routes: [{ name: 'Homepage' }]})}>
                    <Icon1
                        name="arrow-left"
                        color="#133480"
                        size={20}
                    />
                </TouchableOpacity>
            )
          });
      }, []);

    let [loaded] = useFonts({
        ProximaNova: require('../assets/fonts/ProximaNova.otf'),
        ProximaNovaBold: require('../assets/fonts/ProximaNova-Bold.otf')
    });
      
    if (!loaded) {
        return <AppLoading />;
    }

    const getCount = () => {
        if (site.includes("qoo10")) {
            return 20
        } else {
            return 1
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
            <View style={styles.row}>
                <Text style={styles.header}>Item Details</Text>
            </View>
            <View style={styles.prices}>
                <Text style={styles.price} numberOfLines={3}>Item Name: {itemName}</Text>
                <Text style={styles.price}>Current Price: {currentPrice} (Last updated: {lastUpdate})</Text>
                <Text style={styles.price}>Target Price: ${target}</Text>
                <Text style={styles.price}>Number of Reviews: {reviewCount}</Text>

                <Rating
                    type='star'
                    ratingCount={5}
                    startingValue={rating/getCount()}
                    readonly={true}
                    imageSize={60}
                    showRating
                    fractions={1}
                    ratingTextColor={"blue"}
                    imageSize={35}
                />
            </View>
            <View style={styles.table}>
                <Table borderStyle={{borderWidth: 1}}>
                <Row data={['','Highest Price', 'Lowest Price']} flexArr={[1,1.52,1.52]} style={styles.head} textStyle={styles.text}/>
                <TableWrapper style={styles.wrapper}>
                    <Col data={['Price', 'Date']} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
                    <Rows data={[
                        [highestPrice, lowestPrice],
                        [highestDate, lowestDate]
                    ]} flexArr={[1, 1, 1]} style={styles.row} textStyle={styles.text}/>
                </TableWrapper>
                </Table>
            </View>
            <Button
                buttonStyle={styles.editPrice} 
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
            <Button
                buttonStyle={styles.editName} 
                title="Edit Item Name"
                titleStyle={styles.buttonText}
                onPress={() => navigation.navigate("Edit Item Name", 
                {id: id, item: itemName})}
            />
            </ScrollView>
        </SafeAreaView>
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
            paddingTop: StatusBar.currentHeight
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
        editPrice: {
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
        editName: {
            backgroundColor: "black",
            borderRadius: 20,
            width: 295,
            marginBottom: 20
        },
        buttonText: {
            fontFamily: 'ProximaNova'
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
        },
        icon: {
            padding: 20
        },
        table: { flex: 1, padding: 16, paddingTop: 30 },
        head: {  height: 40,  width: 300, backgroundColor: '#f1f8ff'  },
        wrapper: { flexDirection: 'row' },
        title: { flex: 1, backgroundColor: '#f6f8fa' },
        row: {  height: 28  },
        text: { textAlign: 'center' }
    })

