/**
 * @format
 */
require('./src/Screens')
import {Navigation} from 'react-native-navigation'
import App from './App';

Navigation.events().registerAppLaunchedListener(()=>{
  Navigation.setRoot({
    root:{
      stack:{
        children:[{
          component:{
            name:'Signin'
          }
        }]
      }
    }
  })
})
