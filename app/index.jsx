// import React from 'react';
// import { Image, StyleSheet, Platform, Text, TouchableOpacity , View, ImageBackground} from 'react-native';
// import { Link } from 'expo-router';

// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
// import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';

// {/* <View>

// <Image source={require('../../assets/images/rectangle.png')} style={styles.imageStyle} resizeMode='cover'></Image>



// <View >
 
//     <ImageBackground source = {require('../../assets/images/rectangle.png')} resizeMode = 'cover' >
//     </ImageBackground>
  

// </View>


//       </View>  */}


//     //   <ImageBackground source= {require('../../assets/images/rectangle (1).png')} resizeMode="cover" style={{flex:1, alignContent:'center'}}>

      

//     //   </ImageBackground>

// export default function HomeScreen() {
//     return (

   
//     <View style={{flex:1, backgroundColor:'#134B70'}}>
// <View style={{height:200,flexDirection:'row',alignSelf:'center'}}>
// <Image source={require('../../assets/images/Background.png')} style={{ alignSelf:'center'}}></Image>
//       </View>  
      

// </View>




//     );
// }

// const styles = StyleSheet.create({
//     titleContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 8,
//     },
//     stepContainer: {
//         gap: 8,
//         marginBottom: 8,
//     },
//     button: {
//         backgroundColor: '#1D3D47',
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 8,
//         alignItems: 'center',
//         marginVertical: 5, // Add spacing between buttons
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     reactLogo: {
//         height: 178,
//         width: 290,
//         bottom: 0,
//         left: 0,
//         position: 'absolute',
//     },
//     // imageStyle: {

//     //     width:200,
//     //     height:200

//     // },

// });



























































































































































































import React from 'react';
import { Image, StyleSheet, Platform, Text, TextInput, Switch, Pressable, Alert, TouchableOpacity , View, ImageBackground} from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react'
// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
// import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';





export default function Home() {

  const [click,setClick] = useState(false);
  const [username,setUsername]=  useState("");
  const [password,setPassword]=  useState("");


    return (

   


<View style={styles.mainBorder}>

{/* //first part */}
   <View style={styles.imageLogo}>
    <Image source={require('../assets/images/Background.png')}></Image>
  </View>


  <View style={styles.loginText}>

  <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
  <Text style={{fontSize:60,fontWeight:'bold' }}>Login</Text>
  </View>
  </View>

{/* second part which takes the 3/4 of the page size */}
  <View style={styles.thirddd}>
  {/* <Image source={require('../../assets/images/Background.png')}></Image> */}









  <View style={{padding:0,marginBottom:-12, flexDirection:'row',justifyContent:'space-around'}}>
  <Image source={require('../assets/images/cat (1).png')} style={{height:100, width:100,marginBottom:0}}></Image>  
  <Image source={require('../assets/images/dog.png')} style={{height:100, width:100}}></Image>
  </View>


   <View style={styles.whiteArea}>
   {/* <Image source={logo} style={styles.image} resizeMode='contain' /> */}
       
{/* 



        <View style={styles.inputView}>
            <TextInput style={styles.input} placeholder='EMAIL OR USERNAME' value={username} onChangeText={setUsername} autoCorrect={false}
        autoCapitalize='none' />
            <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry value={password} onChangeText={setPassword} autoCorrect={false}
        autoCapitalize='none'/>
        </View>
        <View style={styles.rememberView}>
            <View style={styles.switch}>
                <Switch  value={click} onValueChange={setClick} trackColor={{true : "green" , false : "gray"}} />
                <Text style={styles.rememberText}>Remember Me</Text>
            </View>
            <View>
                <Pressable onPress={() => Alert.alert("Forget Password!")}>
                    <Text style={styles.forgetText}>Forgot Password?</Text>
                </Pressable>
            </View>
        </View>

        <View style={styles.buttonView}>
            <Pressable style={styles.button} onPress={() => Alert.alert("Login Successfuly!","see you in my instagram if you have questions : must_ait6")}>
                <Text style={styles.buttonText}>LOGIN</Text>
            </Pressable>
            <Text style={styles.optionsText}>OR LOGIN WITH</Text>
        </View>
        
        <View style={styles.mediaIcons}>
                <Image source={facebook} style={styles.icons}   />
                <Image source={tiktok} style={styles.icons}  />
                <Image source={linkedin} style={styles.icons}  />
        </View>

        <Text style={styles.footerText}>Don't Have Account?<Text style={styles.signup}>  Sign Up</Text></Text> */}






<View style={styles.middd }>
<View></View>
  <View style={styles.input}><TextInput  style={{flex:1}} placeholder='EMAIL OR USERNAME' value={username} onChangeText={setUsername} autoCorrect={false}
        autoCapitalize='none' /></View>
  <View style={styles.input}><TextInput style={{flex:1}} placeholder='PASSWORD' value={password} onChangeText={setPassword} autoCorrect={false}
        autoCapitalize='none' /></View>
        <View></View>
</View>
{/* <Switch  value={click} onValueChange={setClick} trackColor={{true : "green" , false : "gray"}} /> */}
<View style={styles.secondMiddd}>
            <Pressable style={styles.button} onPress={() => Alert.alert("Login Successfuly!")}>
                <Text style={styles.buttonText}>LOGIN</Text>
            </Pressable>

                        <Link href= "/(tabs)/home" asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Home Screen (Skip login)</Text>
                    </TouchableOpacity>
                </Link>
            <Text style={styles.footerText}>Don't Have Account?<Text style={styles.signup}>  Sign Up</Text></Text>
            <View></View>
</View>


   </View>

  </View>

  
 </View>


    );
}

const styles = StyleSheet.create({
  container : {
    alignItems : "center",
    paddingTop: 70,
  },
  image : {
    height : 160,
    width : 170
  },
  title : {
    fontSize : 30,
    fontWeight : "bold",
    textTransform : "uppercase",
    textAlign: "center",
    paddingVertical : 40,
    color : "red"
  },
  inputView : {
    gap : 15,
    width : "100%",
    paddingHorizontal : 40,
    marginBottom  :5
  },
  input : {
     height : 45,
     paddingHorizontal : 3,
    borderColor : "#508C9B",
    borderWidth : 1,

    marginHorizontal:10,
    justifyContent:'center'
  },
  rememberView : {
    width : "100%",
    paddingHorizontal : 50,
    justifyContent: "space-between",
    alignItems : "center",
    flexDirection : "row",
    marginBottom : 8
  },
  switch :{
    flexDirection : "row",
    gap : 1,
    justifyContent : "center",
    alignItems : "center"
    
  },
  rememberText : {
    fontSize: 13
  },
  forgetText : {
    fontSize : 11,
    color : "red"
  },
  button : {
    backgroundColor : "#201E43",
    height : 45,
    borderColor : "#508C9B",
    borderWidth  : 1,
    borderRadius : 5,
    alignItems : "center",
    justifyContent : "center",
    marginHorizontal:10
  },
  buttonText : {
    color : "white"  ,
    fontSize: 18,
    fontWeight : "bold"
  }, 
  buttonView :{
    width :"100%",
    paddingHorizontal : 50
  },
  optionsText : {
    textAlign : "center",
    paddingVertical : 10,
    color : "gray",
    fontSize : 13,
    marginBottom : 6
  },
  mediaIcons : {
    flexDirection : "row",
    gap : 15,
    alignItems: "center",
    justifyContent : "center",
    marginBottom : 23
  },
  icons : {
    width : 40,
    height: 40,
  },
  footerText : {
    textAlign: "center",
    color : "#134B70",
  },
  signup : {
    color : "#201E43",
    fontSize : 13
  },























  secondMiddd : {

    flex:1,
     justifyContent:'space-around',
     
    //  backgroundColor:'brown'
    // backgroundColor:'yellow'
  },

  middd : {
flex:1,
 justifyContent:'space-between',
 
  // backgroundColor:'brown'
  },

  whiteArea : {

flex:5,
justifyContent:'space-around',
 backgroundColor:'white',
  borderColor:'#201E43',
marginHorizontal:40,
marginBottom:30,
   borderWidth:5,
   borderRadius:13

  },

  thirddd : {
flex:7,
//  backgroundColor:'yellow',
padding:0,
justifyContent:'space-around',
marginBottom:10,
//  backgroundColor:'yellow'

  },

  loginText  : {
flex:1,
// backgroundColor:'brown',
margin:10

  },


  imageLogo : {
    flex:2,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    //  backgroundColor:'green'
  },

  mainBorder : {
flex:1,
 backgroundColor:'#134B70',
 justifyContent:'space-around'
  }

})