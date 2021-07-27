import React, {useState, useEffect, useFocusEffect, useCallback} from 'react';
import {StyleSheet, Text, View, KeyboardAvoidingView, Linking,
TouchableOpacity, BackHandler, SafeAreaView, ScrollView, StatusBar
, useWindowDimensions, Modal, Pressable, Share} from 'react-native';
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

export default ({route, navigation}) => {

    var {item} = route.params
    
    const [toggle, setToggle] = useState(0)
    const [target, setTarget] = useState(item[toggle]["targetPrice"])
    const [itemName, setItemName] = useState(item[toggle]["name"])
    const [modalVisible, setModalVisible] = useState(false)
    const [modal2Visible, setModal2Visible] = useState(false)
    const [modal3Visible, setModal3Visible] = useState(false)
    const [freq, setFreq] = useState("Select Option")

    const isFocused = useIsFocused();

    useEffect(() => {}, [isFocused]);

    const deleteItem = () => {
        firebase
        .firestore()
        .collection('users/' + firebase.auth().currentUser.email + '/items')
        .doc(item[toggle]["id"])
        .delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        })

        navigation.reset({routes: [{ name: 'Homepage' }]})
    }

    const deleteBasket = () => {
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
        const sites = {"shopee": "Shopee", "ebay": "eBay", "qoo": "Qoo10"}
        for (let i = 0; i < item.length; i++) {
            options.push("Item " + (i+1) + " (" + sites[item[i]["site"]] + ")")
        }
        return options
    }

    const onShare = async () => {
        try {
            const share = "Get this item now! \n\n"
            const app = "Shared via Value$"
            const name = "Item Name: " + itemName + "\n\n"
            const currentPrice = "Item Price: " + item[toggle]["currentPrice"] + "\n\n"
            const result = await Share.share({
                message: share + item[toggle]["URL"] + "\n\n" 
                + name + currentPrice + app,
            });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
      };

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
                item.length === 1  
                    ?
                    <TouchableOpacity style={styles.icon}
                        onPress={() => {
                            console.log(item[0]["key"])
                            navigation.navigate('Add Item 2', {key: item[0]["key"]})
                        }}>
                            <Icon1
                                name="plus"
                                color="#133480"
                                size={20}
                            />
                        </TouchableOpacity>
                    : item.length === 2
                        ? <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity style={styles.icon}
                            onPress={() => setModalVisible(true)}>
                                <Icon1
                                    name="random"
                                    color="#133480"
                                    size={20}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.icon}
                            onPress={() => {
                                navigation.navigate('Add Item 2', {key: item[0]["key"]})
                            }}>
                                <Icon1
                                    name="plus"
                                    color="#133480"
                                    size={20}
                                />
                            </TouchableOpacity>
                            </View>
                        : item.length === 3
                            ?  <TouchableOpacity style={styles.icon}
                            onPress={() => setModalVisible(true)}>
                                <Icon1
                                    name="random"
                                    color="#133480"
                                    size={20}
                                />
                                </TouchableOpacity>
                            : <View></View>
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
                            style={styles.ratingText}> Customer Satisfaction: <Text style={styles.heartRating}>
                                {rating}%</Text>
                        </Text>
                        <Rating
                            type='heart'
                            ratingCount={10}
                            imageSize={30}
                            readonly={true}
                            startingValue={parseFloat(rating/10)}
                            tintColor='#b3b1b1'
                            style={{backgroundColor: '#b3b1b1'}}
                        />
                    </View>
                )
            } else {
                return (
                    <View>
                        <Text
                            style={styles.ratingText}> Rating: <Text style={styles.starRating}>
                                {rating}</Text>
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

    const date = item[toggle]["dateArr"].map(x => format(x.toDate(), "d MMM yy h:mm a"))
    let data1 = item[toggle]["priceArr"]
    let data2 = data1.map((x, index) => [parseFloat(x.replace(/[^\d.-]/g, "")), date[index]])

    let max = Math.max(...data1.map(x => parseFloat(x.replace(
        /[^\d.-]/g, "")) + 1))
        //[price, date], price needs parsefloat
    let min = Math.min(...data1.map(x => parseFloat(x.replace(
        /[^\d.-]/g, ""))))

    return (
            <ScrollView>
            <View style={styles.row}>
                <Text style={styles.header}>Item Details</Text>
            </View>
            <View style={styles.prices}>
                <Text style={styles.itemTitle}>Item Name: </Text>
                <Text style={styles.itemDetails} numberOfLines={3}>{itemName}</Text>
                <Text style={styles.itemTitle}>Current Price: </Text>
                <Text style={styles.itemDetails}>{item[toggle]["currentPrice"]} {"\n"}(Last updated: {item[toggle]["lastUpdate"]})</Text>
                <Text style={styles.itemTitle}>Target Price: </Text>
                <Text style={styles.itemDetails}>${target}</Text>
                <Text style={styles.itemTitle}>Number of Reviews: </Text>
                <Text style={styles.itemDetails}>{item[toggle]["reviewCount"]}</Text>

                {ratingComponent(item[toggle]["site"], item[toggle]["rating"], item[toggle]["reviewCount"])}
            </View>
            <View style={styles.table}>
                <Table borderStyle={{borderWidth: 1}}>
                <Row data={['Record Prices','Highest Price', 'Lowest Price']} flexArr={[1, 1, 1]} style={styles.head} textStyle={styles.text}/>
                <TableWrapper style={styles.wrapper}>
                    <Col data={['Price', 'Date']} style={styles.title} heightArr={[38, 38]} textStyle={styles.text}/>
                    <Rows data={[
                        [item[toggle]["highestPrice"], item[toggle]["lowestPrice"]],
                        [item[toggle]["highestDate"], item[toggle]["lowestDate"]]
                    ]} flexArr={[1, 1]} style={styles.row} textStyle={styles.text}/>
                </TableWrapper>
                </Table>
            </View>
            <VictoryChart
                padding={{top: 20, left: 85, right: 30, bottom: 75}}
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
                            labels: {fontSize: 10, fill: '#000', fontWeight: 'bold', textAnchor: 'middle'}}}
                        labelComponent={<VictoryLabel dy={-15} dx={0}/>}
                        labels={data1}/>
                </VictoryGroup>
                <VictoryAxis
                    style={{
                        axis: {stroke: '#A9A9A9', strokeWidth: 3},
                        axisLabel: {fontSize: 18, fill: '#1F2741', padding: 55, fontWeight: 'bold'},
                        tickLabels: {fontSize: 12, fill: '#284089', fontWeight: 'bold'},
                        grid: {stroke: '#121534', strokeWidth: 0.5}
                    }} dependentAxis
                    label={"Price"}
                    tickFormat={tick => '$' + tick}
                />
                <VictoryAxis
                    style={{
                        axis: {stroke: '#A9A9A9', strokeWidth: 3},
                        axisLabel: {fontSize: 18, padding: 50, fill: '#1F2741', fontWeight: 'bold'},
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
            <View style={styles.buttons}>
            <Button
                buttonStyle={styles.buy}
                title="Buy Now"
                titleStyle={styles.buttonText}
                onPress={() => Linking.openURL(item[toggle]["URL"])}
            />
            <Button
                buttonStyle={styles.shareButton}
                title="Share"
                titleStyle={styles.buttonText}
                onPress={onShare}
            />
            <Button
                buttonStyle={styles.editName}
                title="Edit Item Name"
                titleStyle={styles.buttonText}
                onPress={() => navigation.navigate("Edit Item Name",
                {id: item[toggle]["id"], item: itemName})}
            />
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
                onPress={() => setModal2Visible(true)}
            />
            {item.length > 1 &&
            <Button
                buttonStyle={styles.deleteBasket}
                title="Delete Basket"
                titleStyle={styles.buttonText}
                onPress={() => setModal3Visible(true)}
            />}
            </View>
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
                    <Text style={styles.notifs}>Are you sure you want to delete the item?</Text>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => {
                            setModal2Visible(!modal2Visible)
                            deleteItem()
                        }}>
                        <Text style={styles.textStyle}>Confirm</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.button, styles.buttonCancel]}
                        onPress={() => {
                            setModal2Visible(!modal2Visible)
                        }}>
                        <Text style={styles.textStyle}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modal3Visible}
                onRequestClose={() => {
                    setModal3Visible(!modal3Visible);
                }}
            >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.notifs}>Are you sure you want to delete the basket?</Text>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => {
                            setModal3Visible(!modal3Visible)
                            deleteBasket()
                        }}>
                        <Text style={styles.textStyle}>Confirm</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.button, styles.buttonCancel]}
                        onPress={() => {
                            setModal3Visible(!modal3Visible)
                        }}>
                        <Text style={styles.textStyle}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create(
    {
        container: {
            paddingHorizontal: '10%',
            flexDirection: 'column',
            flex: 1,
            fontFamily: 'ProximaNova',
            paddingTop: StatusBar.currentHeight
        },
        row: {
            flexDirection: 'row',
            fontFamily: 'ProximaNova',
            alignContent: 'center'
        },
        header: {
            fontFamily: 'ProximaNovaBold',
            fontSize: 30,
            textAlign: 'center',
            padding: 20
        },
        editPrice: {
            backgroundColor: "#133480",
            borderRadius: 20,
            width: 295,
            marginBottom: 20
        },
        delete: {
            backgroundColor: "#c23d22",
            borderRadius: 20,
            width: 295,
            marginBottom: 20
        },
        deleteBasket: {
            backgroundColor: "purple",
            borderRadius: 20,
            width: 295,
            marginBottom: 20
        },
        buy: {
            backgroundColor: "green",
            borderRadius: 20,
            width: 295,
            marginTop: 20,
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
            fontFamily: 'ProximaNova',
            paddingTop: 30,
            paddingLeft: 30, 
            paddingRight: 30
        },
        itemTitle: {
            fontFamily: 'ProximaNovaBold',
            fontSize: 20,
            padding: 5,
            marginBottom: 5
        },
        itemDetails: {
            fontFamily: 'ProximaNova',
            fontSize: 20,
            padding: 5,
            marginBottom: 5
        },
        icon: {
            padding: 20
        },
        table: { flex: 1, padding: 30},
        head: {  height: 40, backgroundColor: '#f1f8ff'  },
        wrapper: { flexDirection: 'row' },
        title: { flex: 1, backgroundColor: '#f6f8fa' },
        row: {  height: 38  },
        text: { textAlign: 'center' },
        starRating: {
            fontSize: 22,
            color: '#F1C400',
            fontFamily: 'ProximaNovaBold',
            padding: 5
        },
        ratingText: {
            fontSize: 22,
            color: '#000',
            textAlign: 'center',
            fontFamily: 'ProximaNovaBold',
            padding: 5
        },
        heartRating: {
            fontSize: 22,
            color: '#E74C3D',
            fontFamily: 'ProximaNovaBold',
            padding: 5
        },
        centeredView: {
            flex: 1,
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            backgroundColor: 'rgba(100,100,100, 0.5)',
            alignItems: 'center',
            justifyContent: 'center'
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
        buttonCancel: {
            backgroundColor: "grey",
            marginTop: 15,
            marginBottom: -5
        },
        textStyle: {
            color: "white",
            fontFamily: 'ProximaNova',
            fontSize: 15,
            textAlign: "center"
        },
        shareButton: {
            backgroundColor: "#0057a3",
            borderRadius: 20,
            width: 295,
            marginBottom: 20
        },
        notifs: {
            fontFamily: 'ProximaNovaBold',
            fontSize: 20,
            textAlign: 'center',
            paddingBottom: 10
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
        buttons: {
            justifyContent: 'center',
            alignItems: 'center'
        }
    })

