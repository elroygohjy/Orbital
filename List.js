import React, {useEffect, useState, useRef} from "react"
import firebase from 'firebase'
import {Text} from "react-native"
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
            const db = firebase.firestore().collection('users/' + firebase.auth().currentUser.email + '/items')
            if (data.length > 0) {
                if (isMounted.current) {
                    setData([])
                }
            }
            await db.onSnapshot((snapShot) => snapShot.forEach(doc => {
                var dict = {'id': doc.id}
                if (isMounted.current) {
                    setData(arr => [...arr, Object.assign({}, dict, doc.data())]),
                    (e) => console.log("error")
                }
            }))
        }    

        getData()
    }, [])
    
    return data
    
}

export default List
