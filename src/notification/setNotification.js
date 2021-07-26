import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import firebase from '../../api/authkey'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export const registerForPushNotificationsAsync = async () => {
        let token
        let data = {}
        const id = firebase.auth().currentUser.email
        let userDB = await firebase.firestore().collection('users').doc(id).get()
        if (!userDB.exists) {
            await firebase.firestore().collection('users').doc(id).set({itemKeyCounter: 1, darkMode: false})
        }
        if (Constants.isDevice) {
            const {status: existingStatus} = await Notifications.getPermissionsAsync()
            let finalStatus = existingStatus
            if (existingStatus !== 'granted') {
                const {status} = await Notifications.requestPermissionsAsync()
                finalStatus = status
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!')
                return
            }
            token = (await Notifications.getExpoPushTokenAsync()).data
            await firebase.firestore().collection('users').doc(firebase.auth().currentUser.email).update({token:token})
        } else {
            //alert('Must use physical device for Push Notifications');
            console.log('Must use physical device for Push Notifications')
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    };
