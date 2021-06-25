import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text,
    TouchableOpacity, SafeAreaView, FlatList, TextInput, Modal, Pressable} from 'react-native';
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import Icon1 from "react-native-vector-icons/FontAwesome"
import Icon2 from "react-native-vector-icons/FontAwesome5"
import List from '../../List.js'
import ModalDropdown from 'react-native-modal-dropdown';

export default ({navigation}) => {

    const getList = List()
    const ids = []

    const list = getList.map(function(dict) {
        if (!ids.includes(dict.id)) {
            ids.push(dict.id)
            return (
                {
                    id: dict.id,
                    name: dict.name,
                    currentPrice: dict.price,
                    targetPrice: dict.Targetprice,
                    URL: dict.URL,
                    lastUpdate: dict.lastUpdate
                }
            );
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
        console.log(list)
        const match = 
        list
        .filter(function(x){
            return x !== undefined
        })
        .filter(function(x) {
            return x.name.toLowerCase().includes(formattedQuery)
        })
        setData(match)
        setQuery(text)
    };

    const [query, setQuery] = useState('');
    const [data, setData] = useState(list)
    const [modalVisible, setModalVisible] = useState(false);
    const [freq, setFreq] = useState("Select Option")
    const [interval, setInterval] = useState(3000)

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
                    onPress={() => {}}>
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
    
    function Item({ title, id, currentPrice, targetPrice, URL, lastUpdate }) {
        return (
            <TouchableOpacity style={styles.item} 
                onPress={() => navigation.navigate('Item', 
                    {id : id, currentPrice : currentPrice, 
                    targetPrice: targetPrice,
                    URL: URL, lastUpdate: lastUpdate})}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.currentPrice}>{currentPrice}</Text>
            </TouchableOpacity>   
        );
    }

    return (
        <SafeAreaView style={styles.container}>
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
                    </View>}
                data={data}
                extraData={data}
                renderItem={({ item }) => 
                    <Item title={item.name} 
                        id={item.id} 
                        currentPrice={item.currentPrice} 
                        targetPrice={item.targetPrice} 
                        URL={item.URL} 
                        lastUpdate={item.lastUpdate}/>}
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
                            options={['1 hour', '3 hours', '8 hours', '24 hours', '7 days']}
                            onSelect={(index, value) => setFreq(value)}
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
            borderColor: 'black'
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
            borderRadius: 20,
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
        }
    })

