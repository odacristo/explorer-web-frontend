import { Observable, BehaviorSubject, of, interval, from, combineLatest  } from 'rxjs';
import { shareReplay, first, switchMap } from 'rxjs/operators';

import DataService from './DataService';



const firebaseId = new BehaviorSubject(null);
const notifications = new BehaviorSubject([]);



var firebaseConfig = {
    apiKey: "AIzaSyD0P5F8zfmS1fuIDtK_HAOa-AeKTZw91MY",
    authDomain: "chaincoinexplorer.firebaseapp.com",
    databaseURL: "https://chaincoinexplorer.firebaseio.com",
    projectId: "chaincoinexplorer",
    storageBucket: "chaincoinexplorer.appspot.com",
    messagingSenderId: "316900835772",
    appId: "1:316900835772:web:91c5ce11ca192dc0"
};

// Initialize Firebase
var messaging = null;
try{
    window.firebase.initializeApp(firebaseConfig); 

    messaging = window.firebase.messaging(); 
    messaging.usePublicVapidKey("BPIxwVCl8BcMHksgYoO5lBim_hxbE48snFExKNLB56VZ5Cg1VMnwRk1quiKgvOg7YFFIFwo3qAbnSVhYZGeqcME");

    messaging.onMessage(function(payload) {
        console.log('Message received. ', payload);

        notifications.next(notifications._value.concat(payload.data))
    });
    if (Notification.permission == 'granted'){
        messaging.getToken().then(function(_firebaseId) {

            if (_firebaseId) firebaseId.next(_firebaseId); //TODO: need to check if firebase id has changed and update server
            
        }).catch(function(err) {
            console.log('An error occurred while retrieving token. ', err);
        });
    }

} catch(ex){
    console.log(ex);
}


firebaseId.subscribe((newFirebaseId) =>{

    var oldFirebaseId = window.localStorage["firebaseId"];

    if (oldFirebaseId == null && newFirebaseId != null)
    {
        window.localStorage["firebaseId"] = newFirebaseId;
    }
    else if (oldFirebaseId != null && newFirebaseId != null && oldFirebaseId != newFirebaseId){
        DataService.sendHttpRequest({
            op:"updateNotifications",
            oldFirebaseId: oldFirebaseId,
            newFirebaseId: newFirebaseId
        }).then(() =>{
            window.localStorage["firebaseId"] = newFirebaseId;
        });
    }

});



const getFirebaseId = () =>{

    return new Promise((resolve, reject) => {
        firebaseId.pipe(first()).subscribe((_firebaseId) =>{

            if (_firebaseId != null) {
                resolve(_firebaseId);
            }
            else
            {
                messaging.requestPermission()
                .then(() => messaging.getToken())
                .then((_firebaseId) => {
                    firebaseId.next(_firebaseId);
                    resolve(_firebaseId);
                })
                .catch(reject);
            }
            
        });
    });
}

const deleteNotifications = () => {
    return firebaseId.pipe(
        switchMap((firebaseId) => {
            if (firebaseId == null) return of(false); //TODO: throw error
            return DataService.sendRequest({
                op: "deleteNotifications",
                firebaseId: firebaseId
            })
        })
    );
}


const saveBlockNotification = () => {
    return firebaseId.pipe(
        switchMap((firebaseId) => {
            if (firebaseId == null) return of(false); //TODO: throw error
            return DataService.sendRequest({
                op: "setBlockNotification",
                firebaseId: firebaseId,
                enabled:true
            })
        })
    );
}


const deleteBlockNotification = () => {
    return firebaseId.pipe(
        switchMap((firebaseId) => {
            if (firebaseId == null) return of(false); //TODO: throw error
            return DataService.sendRequest({
                op: "setBlockNotification",
                firebaseId: firebaseId,
                enabled:false
            })
        })
    );
}

const BlockNotification = combineLatest(firebaseId,DataService.webSocket).pipe(
    switchMap(([firebaseId,webSocket]) => {
        if (firebaseId == null) return of(false);
        return webSocket ?
            DataService.subscription("BlockNotification", {firebaseId: firebaseId}):
            interval(30000).pipe(switchMap(() => from(DataService.sendRequest({
                op: "getBlockNotification",
                firebaseId: firebaseId,
            }))));
    }),
    shareReplay({
      bufferSize: 1,
      refCount: true
    })
);


var masternodeNotificationObservables = {}
var MasternodeNotification = (output) =>{ //TODO: This is a memory leak

  var observable = masternodeNotificationObservables[output];
  
  if (observable == null){

    observable = combineLatest(firebaseId,DataService.webSocket).pipe(
        switchMap(([firebaseId,webSocket]) => {
            if (firebaseId == null) return of(false);
            return webSocket ?
                DataService.subscription("MasternodeNotification", { firebaseId: firebaseId, output: output }):
                interval(30000).pipe(switchMap(() => from(DataService.sendRequest({
                    op: "getMasternodeNotification",
                    firebaseId: firebaseId,
                }))));
        }),
        shareReplay({
          bufferSize: 1,
          refCount: true
        })
    );

    masternodeNotificationObservables[output] = observable;
  } 

  return observable;
}




const saveMasternodeNotification = (output) => {
    return firebaseId.pipe(
        switchMap((firebaseId) => {
            if (firebaseId == null) return of(false); //TODO: throw error
            return DataService.sendRequest({
                op: "setMasternodeNotification",
                firebaseId: firebaseId,
                output: output,
                enabled:true
            })
        })
    );
}


const deleteMasternodeNotification = (output) => {
    return firebaseId.pipe(
        switchMap((firebaseId) => {
            if (firebaseId == null) return of(false); //TODO: throw error
            return DataService.sendRequest({
                op: "setMasternodeNotification",
                firebaseId: firebaseId,
                output: output,
                enabled:false
            })
        })
    ); 
}


const saveAddressNotification = (address) => {

    return firebaseId.pipe(
        switchMap((firebaseId) => {
            if (firebaseId == null) return of(false); //TODO: throw error
            return DataService.sendRequest({
                op: "setAddressNotification",
                firebaseId: firebaseId,
                address: address,
                enabled: true
            })
        })
    );
}


const deleteAddressNotification = (address) => {
    return firebaseId.pipe(
        switchMap((firebaseId) => {
            if (firebaseId == null) return of(false); //TODO: throw error
            return DataService.sendRequest({
                op: "setAddressNotification",
                firebaseId: firebaseId,
                address: address,
                enabled: false
            })
        })
    );
}

var addressSubscriptionObservables = {}

const AddressNotification = (address) =>{ //TODO: This is a memory leak

    var observable = addressSubscriptionObservables[address];
    
    if (observable == null){
  
      observable = combineLatest(firebaseId,DataService.webSocket).pipe(
          switchMap(([firebaseId,webSocket]) => {
              if (firebaseId == null) return of(false);
              return webSocket ?
                  DataService.subscription("AddressNotification", { firebaseId: firebaseId, address: address }):
                  interval(30000).pipe(switchMap(() => from(DataService.sendRequest({
                      op: "getAddressNotification",
                      firebaseId: firebaseId,
                      address: address
                  }))));
          }),
          shareReplay({
            bufferSize: 1,
            refCount: true
          })
      );
  
      addressSubscriptionObservables[address] = observable;
    } 
  
    return observable;
  }




const removeNotification = (notification) =>{
    notifications.next(notifications.value.filter(n => n != notification));
};

const clearAllNotification = (notification) =>{

    notifications([]);
};


export default {
    supported: messaging != null,
    deleteNotifications,

    saveBlockNotification,
    deleteBlockNotification,
    
    saveMasternodeNotification,
    deleteMasternodeNotification,

    saveAddressNotification,
    deleteAddressNotification,

    BlockNotification,
    MasternodeNotification,
    AddressNotification,





    notifications,

    removeNotification,
    clearAllNotification
};