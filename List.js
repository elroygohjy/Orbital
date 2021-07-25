import {useEffect, useState, useRef} from "react"
import firebase from 'firebase'
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

export function useIsMounted() {
    const isMounted = useRef(false);

    useEffect(() => {
      isMounted.current = true;
      return () => isMounted.current = false;
    }, []);

    return isMounted;
}

function List() {
    const [data, setData] = useState([])
    const isMounted = useIsMounted();
    useEffect(() => {
        async function getData() {
        //     try {
        //         firebase.auth().onAuthStateChanged(function(user) {
        //             if (user) {
        //                 // User is signed in.
        //                 var email = firebase.auth().currentUser.email
        //                 const db =
        //                 firebase
        //                 .firestore()
        //                 .collection('users/' + email + '/items')
        //                 if (data.length > 0) {
        //                     if (isMounted.current) {
        //                         setData([])
        //                     }
        //                 }
        //                 db.onSnapshot((snapShot) => snapShot.forEach(doc => {
        //                     var dict = {'id': doc.id}
        //                     if (isMounted.current) {
        //                         setData(arr => [...arr, Object.assign({}, dict, doc.data())]),
        //                         (e) => console.log("error")
        //                     }
        //                 }))
        //             } else {
        //                 // No user is signed in.
        //                 console.log('Not authenticated');
        //             }
        //         });
        //     } catch (error) {
        //         console.log(error)
        //     }
        // }
                try {
                    firebase.auth().onAuthStateChanged(function(user) {
                        if (user) {
                            // User is signed in.
                            var email = firebase.auth().currentUser.email
                            const db =
                            firebase
                            .firestore()
                            .collection('users/' + email + '/items')
                            if (data.length > 0) {
                                if (isMounted.current) {
                                    setData([])
                                }
                            }
                            db.onSnapshot(async (snapShot) => {
                                let userDB = await firebase.firestore().collection('users').doc(email).get()
                                let itemKeyList = await userDB.data().itemKeyList

                                let docList = await Promise.all(itemKeyList.map(async x => {
                                    const snapShot = await db.where("itemKey", "==", x).get()
                                    const itemArr = []
                                    await snapShot.forEach(doc => {
                                        var data = doc.data()
                                        data['id'] = doc.id
                                        itemArr.push(data)
                                    })
                                    // console.log(itemArr[0].price[0])
                                    return itemArr
                                }))
                                // console.log(docList)
                                
                                if (isMounted.current) {
                                    setData(docList)
                                }
                            })
                            } else {
                            // No user is signed in.
                            console.log('Not authenticated');
                        }
                    });
                } catch (error) {
                    console.log(error)
                }
            }

        getData()

    }, [])
  
    return data
}

export default List
