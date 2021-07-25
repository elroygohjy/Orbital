import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text,
    TouchableOpacity, SafeAreaView, FlatList, TextInput, Modal, Pressable,
ActivityIndicator} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome"
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import Icon1 from "react-native-vector-icons/FontAwesome"
import Icon2 from "react-native-vector-icons/FontAwesome5"
import List from '../../List.js'
import ModalDropdown from 'react-native-modal-dropdown';
import { registerForPushNotificationsAsync } from '../notification/setNotification'
import firebase from '../../api/authkey'
import "firebase/functions";

export default ({navigation}) => {

    const getList = List()
    const ids = []

    const list = getList.map(function(dict) {
        // console.log(typeof dict[0] === 'undefined' ? "s" : dict[0]["id"])
        if (typeof dict[0] !== 'undefined' && !ids.includes(dict[0]["id"])) {
            ids.push(dict[0]["id"])
            var obj = []
            for (let i = 0; i < dict.length; i++) {
                obj.push({
                    id: dict[i]["id"],
                    name: dict[i]["name"],
                    currentPrice: dict[i]["price"] === undefined ? dict[i]["price"] : dict[i]["price"][dict[i]["price"].length-1],
                    targetPrice: dict[i]["TargetPrice"],
                    URL: dict[i]["URL"],
                    lastUpdate: dict[i]["lastUpdate"],
                    highestPrice: dict[i]["detailTable"] === undefined ? dict[i]["detailTable"] : dict[i]["detailTable"]["highestPrice"],
                    highestDate: dict[i]["detailTable"] === undefined ? dict[i]["detailTable"] : dict[i]["detailTable"]["highLastUpdate"],
                    lowestPrice: dict[i]["detailTable"] === undefined ? dict[i]["detailTable"] : dict[i]["detailTable"]["lowestPrice"],
                    lowestDate: dict[i]["detailTable"] === undefined ? dict[i]["detailTable"] : dict[i]["detailTable"]["lowLastUpdate"],
                    reviewCount: dict[i]["detailTable"] === undefined ? dict[i]["detailTable"] : dict[i]["detailTable"]["noOfRatings"],
                    rating: dict[i]["detailTable"] === undefined ? dict[i]["detailTable"] : dict[i]["detailTable"]["rating"],
                    site: dict[i]["site"],
                    priceArr: dict[i]["price"],
                    dateArr: dict[i]["dateArr"]
                })
            }
            // console.log(obj)
            return obj
        }
    });

    const handleSearch = text => {
        if (text == "") {
            const match =
            list
            .filter(function(x){
                return x !== undefined
            })
            setData(match)
        }
        const formattedQuery = text.toLowerCase();
        const match =
        list
        .filter(function(x){
            return x !== undefined
        })
        .filter(function(x) {
            return x[0]['name'].toLowerCase().includes(formattedQuery)
        })
        setData(match)
        setQuery(text)
    };

    const setFilter = (site) => {
        if (site === "all") {
            const match =
            list
            .filter(function(x){
                return x !== undefined
            })
            setData(match)
        } else {
            const match =
            list
            .filter(function(x){
                return x !== undefined
            })
            .filter(function(x) {
                for (let i = 0; i < x.length; i++) {
                    if (x[i]['site'] === site) {
                        return true
                    }
                }
                return false
            })
            setData(match)
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            await firebase
            .firestore()
            .doc('users/' + firebase.auth().currentUser.email)
            .get()
            .then(doc => {
                 const selected = doc.data().interval === undefined ? 0 : doc.data().interval.toString()
                 const options = {"Infinity": 'No notification',
                 "1": '1 hour',
                 "3": '3 hours',
                 "8": '8 hours',
                 "24": '24 hours',
                 "168": '7 days'}

                 // console.log(selected)
                 setFreq(options[selected])
            })
            .catch(err => {
                console.log('Error getting documents', err)
            });
        });
        return unsubscribe
    }, [navigation]);

    const [query, setQuery] = useState('');
    const [data, setData] = useState(list)
    const [modalVisible, setModalVisible] = useState(false);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [freq, setFreq] = useState("Select Option")
    const [interval, setInterval] = useState(1000)
    const [loading, setLoading] = useState(false)

    const filtered = () =>
    setData(list.filter(function(x){
        return x !== undefined
    }))

    // hacky fix for list not rendering on logins

    setTimeout(() => {
        setQuery('s')
        handleSearch('')
        setInterval(157784760000)
    }, interval)

    //to get the notification token for expo
    useEffect(() => {
        registerForPushNotificationsAsync()
    }, [])

    useEffect(() => {
        filtered()
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style={styles.icon}
                onPress={() => navigation.toggleDrawer()}>
                    <Icon1
                        name="bars"
                        color="#133480"
                        size={20}
                    />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.icon}
                    onPress={() => setModalVisible(true)}>
                        <Icon1
                            name="bell"
                            color="#133480"
                            size={20}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icon}
                    onPress={async () => {
                        setLoading(true)
                        await firebase.functions().httpsCallable('scheduledWebScrap')()
                        navigation.reset({routes: [{ name: 'Homepage' }]})
                        setLoading(false)

                    }}>
                        <Icon2
                            name="sync"
                            color="#133480"
                            size={20}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icon}
                    onPress={() => navigation.navigate('Add Item')}>
                        <Icon1
                            name="plus"
                            color="#133480"
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
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

    const getPrices = (item) => {
        var prices = []
        for (let i = 0; i < item.length; i++) {
            prices.push(<Text style={styles.currentPrice}>{item[i]['currentPrice']}</Text>)
        }

        return prices
    }

    function Item({ item }) {
        return (
            <TouchableOpacity style={styles.item}
                onPress={() => navigation.navigate('Item',
                    {item: item})}>
                <Text style={styles.title} numberOfLines={2}>{item[0]['name']}</Text>
                {getPrices(item)}
            </TouchableOpacity>
        );
    }

   // console.log(data)

    return (
        <SafeAreaView style={styles.container}>
            {loading && <ActivityIndicator size="large" color="#0000ff" animating={loading}/>}
            <FlatList
                ListHeaderComponent={
                    <View style={styles.searchBar}>
                        <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="always"
                        value={query}
                        onChangeText={queryText => handleSearch(queryText)}
                        placeholder="🔎   Search"
                        style={styles.searchBarText}
                        />
                        <Icon
                        name="filter"
                        color="grey"
                        size={25}
                        style={styles.filter}
                        onPress={() => setModal2Visible(!modal2Visible)}
                    />
                    </View>}
                data={data}
                extraData={data}
                renderItem={({ item }) =>
                    <Item item={item}/>}
                keyExtractor={(item, index) => item.id}
            />
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.notifs}>Receive Notifications Every </Text>
                        <ModalDropdown
                            textStyle={styles.dropdown}
                            defaultValue={freq}
                            style={styles.select}
                            options={['No notification','1 hour', '3 hours', '8 hours', '24 hours', '7 days']}
                            onSelect={async (index, value) => {
                                setFreq(value)
                                const optionsInTime = [Infinity, 1, 3, 8, 24, 24 * 7]
                                const id = firebase.auth().currentUser.email
                                const currentDate = new Date()
                                await firebase.firestore().collection('users').doc(id).update({
                                    date: currentDate,
                                    interval: optionsInTime[index]})
                            }}
                            dropdownStyle={styles.options}
                            dropdownTextStyle={styles.optionsText}/>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Confirm</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modal2Visible}
                onRequestClose={() => {
                    setModal2Visible(!modal2Visible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.notifs}>Filter By </Text>
                        <ModalDropdown
                            textStyle={styles.dropdown}
                            defaultValue={"Platform"}
                            style={styles.select}
                            options={['All', 'Shopee', 'eBay', 'Qoo10']}
                            onSelect={(index, value) => {
                                const site = ['all', 'shopee', 'ebay', 'qoo']
                                setFilter(site[index])
                            }}
                            dropdownStyle={styles.options}
                            dropdownTextStyle={styles.optionsText}/>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModal2Visible(!modal2Visible)}>
                            <Text style={styles.textStyle}>Confirm</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create(
    {
        container: {
            // flex: 1
        },
        icon: {
            padding: 20
        },
        searchBar: {
            backgroundColor: '#dedede',
            padding: 10,
            marginTop: 13,
            marginVertical: 10,
            marginHorizontal: 17,
            marginBottom: 5,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: 'black',
            flexDirection: 'row'
        },
        searchBarText: {
            backgroundColor: '#dedede',
            paddingHorizontal: 20,
            fontFamily: 'ProximaNova',
            fontSize: 20,
            color: 'black'
        },
        item: {
            backgroundColor: 'white',
            borderColor: '#133480',
            borderWidth: 2,
            borderBottomWidth: 2,
            borderRadius: 20,
            padding: 20,
            marginVertical: 8,
            marginHorizontal: 15,
          },
        title: {
            fontSize: 20,
        },
        currentPrice: {
            color: 'green',
            fontSize: 20,
        },
        centeredView: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            backgroundColor: 'rgba(100,100,100, 0.5)',
            padding: 0
        },
        modalView: {
            margin: 20,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            borderColor: 'black',
            borderWidth: 2,
        },
        button: {
            borderRadius: 20,
            padding: 10,
            elevation: 2
        },
        buttonOpen: {
            backgroundColor: "#F194FF",
        },
        buttonClose: {
            backgroundColor: "#133480",
            marginTop: 15,
            marginBottom: -5
        },
        textStyle: {
            color: "white",
            fontFamily: 'ProximaNova',
            fontSize: 15,
            textAlign: "center"
        },
        notifs: {
            fontFamily: 'ProximaNovaBold',
            fontSize: 20,
            marginBottom: 10
        },
        dropdown: {
            fontFamily: 'ProximaNova',
            fontSize: 15,
            color: 'white'
        },
        select: {
            backgroundColor: 'green',
            padding: 10,
            borderRadius: 20,
            marginTop: 5
        },
        optionsText: {
            fontFamily: 'ProximaNova',
            fontSize: 15,
            color: 'black'
        },
        options: {
            padding: 10,
            borderRadius: 20,
            marginTop: 5
        },
        filter: {
            paddingLeft: "45%"
        }
    })

