import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text,
    TouchableOpacity, SafeAreaView, FlatList, TextInput, Modal, Pressable,
ActivityIndicator, StatusBar} from 'react-native';
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
import { KeyboardAvoidingView } from 'react-native';

export default ({navigation}) => {

    const getList = List()
    const ids = []
    const [isDark, setDark] = useState(false); //get from firebase
    const [modeLoaded, setModeLoaded] = useState(false)
    
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            await firebase
            .firestore()
            .doc('users/' + firebase.auth().currentUser.email)
            .get()
            .then(doc => {
                setDark(doc.data().darkMode)
                // console.log(isDark)
            })
            .catch(err => {
                console.log('Error getting documents', err)
            });
        });
        return unsubscribe
    }, [navigation]);
    
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
                    dateArr: dict[i]["dateArr"],
                    key: dict[i]["itemKey"]
                })
            }
            // console.log(obj)
            return obj
        }
    });

    const handleSearch = text => {
        
        var match = []
        if (text == "") {
            match =
            list
            .filter(function(x){
                return x !== undefined
            })
            // setData(match)
        } else {
            const formattedQuery = text.toLowerCase();
            match =
            list
            .filter(function(x){
                return x !== undefined
            })
            .filter(function(x) {
                return x[0]['name'].toLowerCase().includes(formattedQuery)
            })
        }
        setQuery(text)
        setFilter(site, match)
    };

    const setFilter = (site, list) => {
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

                const platform = doc.data().filter
                setPlatform(platform)

                const site = doc.data().site
                setSite(site)
                setFilter(site, list)
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
    const [site, setSite] = useState('all')
    const [platform, setPlatform] = useState("Platform")

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
            headerStyle: {backgroundColor: '#AAAAAA'},
            headerLeft: () => (
                <TouchableOpacity style={styles[isDark.toString()].icon}
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
                    <TouchableOpacity style={styles[isDark.toString()].icon}
                    onPress={() => setModalVisible(true)}>
                        <Icon1
                            name="bell"
                            color="#133480"
                            size={20}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles[isDark.toString()].icon}
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
                    <TouchableOpacity style={styles[isDark.toString()].icon}
                    onPress={() => {
                        navigation.navigate('Add Item')
                    }}>
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

    let loaded = useFonts({
        ProximaNova: require('../assets/fonts/ProximaNova.otf'),
        ProximaNovaBold: require('../assets/fonts/ProximaNova-Bold.otf')
    });

    if (!loaded) {
        return <AppLoading />;
    }
/*
    if (!modeLoaded) {
        console.log("loading")
        return <AppLoading 
            startAsync={async () => 
                await firebase
                .firestore()
                .doc('users/' + firebase.auth().currentUser.email)
                .get()
                .then(doc => {
                    setDark(doc.data().darkMode)
                    // console.log(isDark)
                })
                .catch(err => {
                    console.log('Error getting documents', err)
                })
            }
            onError={() => {}}
            onFinish={() => setModeLoaded(true)}
        />
    }*/

    const getNumberOfItems = (item) => {
        if (item.length > 1) {
            return (
                <Text style={styles[isDark.toString()].numberOfItems}>{item.length} items</Text>
            )
        }
    }

    const getPrices = (item) => {
        var prices = ""
        for (let i = 0; i < item.length; i++) {
            prices += (item[i]['currentPrice'] + ", ")
        }
        prices = prices.substring(0, prices.length-2)
        return (
            <Text style={styles[isDark.toString()].currentPrice}>{prices}</Text>
        )
    }

    function Item({ item }) {
        return (
            <TouchableOpacity style={styles[isDark.toString()].item}
                onPress={() => navigation.navigate('Item',
                    {item: item})}>
                <Text style={styles[isDark.toString()].title} numberOfLines={2}>{item[0]['name']}</Text>
                {getNumberOfItems(item)}
                {getPrices(item)}
            </TouchableOpacity>
        );
    }

    const getFilterIconColor = () => {
        return isDark ? "#e6e8e6" : "grey"
    }

    const getPlaceholderTextColor = () => {
        return isDark ? "#e6e8e6" : "black"
    }

    const getStatusBarColor = () => {
        return isDark ? "black" : "grey"
    }
   // console.log(data)

    return (
        <KeyboardAvoidingView style={styles[isDark.toString()].container}>
            <StatusBar backgroundColor={getStatusBarColor()}/>
            {loading && <ActivityIndicator size="large" color="#0000ff" style={{paddingTop: 12}} animating={loading}/>}
            <FlatList
                ListHeaderComponent={
                    <View style={styles[isDark.toString()].searchBar}>
                        <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="always"
                        value={query}
                        onChangeText={queryText => handleSearch(queryText)}
                        placeholder="🔎   Search"
                        placeholderTextColor={getPlaceholderTextColor()}
                        style={styles[isDark.toString()].searchBarText}
                        />
                        <Icon
                        name="filter"
                        color={getFilterIconColor()}
                        size={25}
                        style={styles[isDark.toString()].filter}
                        onPress={() => setModal2Visible(!modal2Visible)}
                        />
                    </View>}
                data={data}
                extraData={data}
                renderItem={({ item }) =>
                    <Item item={item}/>}
                keyExtractor={(item, index) => item.id}
                style={{flex:1}}
            />
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
            <View style={styles[isDark.toString()].centeredView}>
                <View style={styles[isDark.toString()].modalView}>
                    <Text style={styles[isDark.toString()].notifs}>Receive Notifications Every </Text>
                    <ModalDropdown
                        textStyle={styles[isDark.toString()].dropdown}
                        defaultValue={freq}
                        style={styles[isDark.toString()].select}
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
                        dropdownStyle={styles[isDark.toString()].options}
                        dropdownTextStyle={styles[isDark.toString()].optionsText}/>
                    <Pressable
                        style={[styles[isDark.toString()].button, styles[isDark.toString()].buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles[isDark.toString()].textStyle}>Confirm</Text>
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
                <View style={styles[isDark.toString()].centeredView}>
                    <View style={styles[isDark.toString()].modal2View}>
                        <Text style={styles[isDark.toString()].notifs}>Filter By </Text>
                        <ModalDropdown
                            textStyle={styles[isDark.toString()].dropdown}
                            defaultValue={platform}
                            style={styles[isDark.toString()].select}
                            options={['All', 'Shopee', 'eBay', 'Qoo10']}
                            onSelect={async (index, value) => {
                                const site = ['all', 'shopee', 'ebay', 'qoo']
                                setFilter(site[index], list)
                                setSite(site[index])
                                await firebase
                                .firestore()
                                .doc('users/' + firebase.auth().currentUser.email)
                                .update({
                                    filter: value,
                                    site: site[index]
                                })
                                .catch(err => {
                                    console.log('Error getting documents', err)
                                });
                            }}
                            dropdownStyle={styles[isDark.toString()].options}
                            dropdownTextStyle={styles[isDark.toString()].optionsText}/>
                        <Pressable
                            style={[styles[isDark.toString()].button, styles[isDark.toString()].buttonClose]}
                            onPress={() => setModal2Visible(!modal2Visible)}>
                            <Text style={styles[isDark.toString()].textStyle}>Confirm</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = {"true": StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: '#464646'
        },
        icon: {
            padding: 20
        },
        searchBar: {
            backgroundColor: '#303030',
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
            backgroundColor: '#303030',
            paddingHorizontal: 20,
            fontFamily: 'ProximaNova',
            fontSize: 20,
            color: '#e6e8e6',
            flex: 1
        },
        item: {
            backgroundColor: '#656970',
            borderColor: '#133480',
            borderWidth: 2,
            borderBottomWidth: 2,
            borderRadius: 20,
            padding: 20,
            marginVertical: 8,
            marginHorizontal: 15,
          },
        title: {
            color: '#e6e8e6',
            fontSize: 20,
        },
        currentPrice: {
            color: '#51b85e',
            fontSize: 20,
        },
        numberOfItems: {
            color: 'blue',
            fontSize: 20,
        },
        centeredView: {
            flex: 1,
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(100,100,100, 0.5)'
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
        modal2View: {
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
            width: 300
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
        filter:{
            paddingRight: 10
        }
    }),
    "false": StyleSheet.create(
        {
            container: {
                flex: 1
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
                color: 'black',
                flex: 1
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
            numberOfItems: {
                color: 'blue',
                fontSize: 20,
            },
            centeredView: {
                flex: 1,
                position: 'absolute',
                width: '100%',
                height: '100%',
                alignItems: 'center',
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
                borderWidth: 2
            },
            modal2View: {
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
                width: 300
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
            filter:{
                paddingRight: 10
            }
        })
}