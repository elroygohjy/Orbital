import React, {useState, useEffect, useFocusEffect, useCallback} from 'react';
import {StyleSheet, Text, View, KeyboardAvoidingView, Linking,
TouchableOpacity, BackHandler, SafeAreaView, ScrollView, StatusBar
, useWindowDimensions, Modal, Pressable} from 'react-native';
import {
    VictoryChart, VictoryLine, VictoryAxis, VictoryLabel, VictoryGroup, VictoryScatter
} from "victory-native";
import {format} from 'date-fns'
import {Button} from "react-native-elements"
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import firebase from 'firebase'
import { useIsFocused } from "@react-navigation/native";
import Icon1 from "react-native-vector-icons/FontAwesome"
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import { Rating } from 'react-native-ratings';
import ModalDropdown from 'react-native-modal-dropdown';
import { getWeekWithOptions } from 'date-fns/fp';

export default ({route, navigation}) => {

    var {item} = route.params
    const [toggle, setToggle] = useState(0)
    const [target, setTarget] = useState(item[toggle]["targetPrice"])
    const [itemName, setItemName] = useState(item[toggle]["name"])
    const [modalVisible, setModalVisible] = useState(false);
    const [freq, setFreq] = useState("Select Option")

    const isFocused = useIsFocused();

    useEffect(() => {}, [isFocused]);

    const deleteItem = () => {
        for (let i = 0; i < item.length; i++) {
            firebase
            .firestore()
            .collection('users/' + firebase.auth().currentUser.email + '/items')
            .doc(item[i]["id"])
            .delete().then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            })
        }
        
        navigation.reset({routes: [{ name: 'Homepage' }]})
    }

    const getOptions = () => {
        var options = []
        for (let i = 0; i < item.length; i++) {
            options.push(i+1)
        }
        return options
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            firebase
            .firestore()
            .collection('users/' + firebase.auth().currentUser.email + '/items')
            .doc(item[toggle]["id"])
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
            ),
            headerRight: () => (
                    <TouchableOpacity style={styles.icon}
                    onPress={() => setModalVisible(true)}>
                        <Icon1
                            name="random"
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

    const ratingComponent = (site, rating, reviewCount) => {
        if (reviewCount !== '0') {
            if (site.includes("qoo")) {
                return (
                    <View>
                        <Text
                            style={styles.ratingText}> Customer Satisfaction:
                            <Text style={styles.heartRating}>{rating}%</Text>
                        </Text>
                        <Rating
                            type='heart'
                            ratingCount={10}
                            imageSize={30}
                            readonly={true}
                            startingValue={parseFloat(rating/10)}
                            // style={{ backgroundColor: "blue" }}
                        />
                    </View>
                )
            } else {
                return (
                    <View>
                        <Text
                            style={styles.ratingText}> Rating:
                            <Text style={styles.starRating}>{rating}</Text>
                            <Text style={styles.ratingText}>/5</Text>
                        </Text>
                        <Rating
                            type='custom'
                            ratingCount={5}
                            imageSize={30}
                            readonly={true}
                            startingValue={rating}
                            tintColor="#efefef"
                          //  style={{ backgroundColor: "blue" }}
                        />
                    </View>
                )
            }
        }
    }

    const date = item[toggle]["dateArr"].map(x => format(x.toDate(), "d MMM yy"))
    let data1 = item[toggle]["priceArr"]
    let data2 = data1.map((x, index) => [parseFloat(x.replace(/[^\d.-]/g, "")), date[index]])
  
    let max = Math.max(...data1.map(x => parseFloat(x.replace( 
        /[^\d.-]/g, "")) + 1))
        //[price, date], price needs parsefloat
    let min = Math.min(...data1.map(x => parseFloat(x.replace(
        /[^\d.-]/g, ""))))

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
            <View style={styles.row}>
                <Text style={styles.header}>Item Details</Text>
            </View>
            <View style={styles.prices}>
                <Text style={styles.price} numberOfLines={3}>Item Name: {itemName}</Text>
                <Text style={styles.price}>Current Price: {item[toggle]["currentPrice"]} (Last updated: {item[toggle]["lastUpdate"]})</Text>
                <Text style={styles.price}>Target Price: ${target}</Text>
                <Text style={styles.price}>Number of Reviews: {item[toggle]["reviewCount"]}</Text>

                {ratingComponent(item[toggle]["site"], item[toggle]["rating"], item[toggle]["reviewCount"])}
            </View>
            <View style={styles.table}>
                <Table borderStyle={{borderWidth: 1}}>
                <Row data={['','Highest Price', 'Lowest Price']} flexArr={[1,1.52,1.52]} style={styles.head} textStyle={styles.text}/>
                <TableWrapper style={styles.wrapper}>
                    <Col data={['Price', 'Date']} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
                    <Rows data={[
                        [item[toggle]["highestPrice"], item[toggle]["lowestPrice"]],
                        [item[toggle]["highestDate"], item[toggle]["lowestDate"]]
                    ]} flexArr={[1, 1, 1]} style={styles.row} textStyle={styles.text}/>
                </TableWrapper>
                </Table>
            </View>
            <VictoryChart
                padding={{top: 20, left: 60, right: 30, bottom: 70}}
                domain={{y: [min, max]}}
                // style={{paddingTop: 10}
                domainPadding={30}
            >
                <VictoryGroup
                    data={data2}
                    x={1}
                    y={0}
                    >
                <VictoryLine
                    data={data2}
                    x={1}
                    y={0}
                    fixLabelOverlap={true}
                    style={{
                        data: {stroke: "#8cc6e5", strokeWidth: 5},


                    }}

                />
                    <VictoryScatter
                        size={6}
                        style={{data: { fill: "#8cc6e5" },
                            labels: {fontSize: 15, fill: '#000', fontWeight: 'bold', textAnchor: 'middle'}}}
                        labelComponent={<VictoryLabel dy={-15} dx={0}/>}
                        labels={data1}/>
                </VictoryGroup>
                <VictoryAxis
                    style={{
                        axis: {stroke: '#A9A9A9', strokeWidth: 3},
                        axisLabel: {fontSize: 18, fill: '#1F2741', padding: 40},
                        tickLabels: {fontSize: 12, fill: '#284089', fontWeight: 'bold'},
                        grid: {stroke: '#121534', strokeWidth: 0.5}
                    }} dependentAxis
                    label={"Price"}
                    tickFormat={tick => '$' + tick}
                />
                <VictoryAxis
                    style={{
                        axis: {stroke: '#A9A9A9', strokeWidth: 3},
                        axisLabel: {fontSize: 18, padding: 50, fill: '#1F2741'},
                        ticks: {stroke: '#ccc'},
                        grid: {stroke: '#121534', strokeWidth: 0.5},
                        tickLabels: {
                            fontSize: 11, padding: 25, angle: -20, verticalAnchor: 'middle', textAnchor: 'middle',
                            fill: '#284089', fontWeight: 'bold'
                        }
                    }}
                    label={"Date"}
                />
            </VictoryChart>
            <Button
                buttonStyle={styles.editPrice} 
                title="Edit Target Price"
                titleStyle={styles.buttonText}
                onPress={() => navigation.navigate("Edit Price", 
                    {id: item[toggle]["id"], target: target, currentPrice: item[toggle]["currentPrice"]})}
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
                {id: item[toggle]["id"], item: itemName})}
            />
            </ScrollView>
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
                    <Text style={styles.notifs}>Filter By </Text>
                    <ModalDropdown
                        textStyle={styles.dropdown}
                        defaultValue={freq}
                        style={styles.select}
                        options={getOptions()}
                        onSelect={async (index, value) => {
                            setToggle(index)
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
        text: { textAlign: 'center' },
        starRating: {
            fontSize: 30,
            color: '#F1C400',
            //
        },
        ratingText: {
            fontSize: 20,
            color: '#000',
            textAlign: 'center'
    
        },
        heartRating: {
            fontSize: 30,
            color: '#E74C3D',
            //
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
    })

