import React from 'react';
import { StyleSheet, View, TextInput, ScrollView, Text, Image, TouchableOpacity, Alert, FlatList , Button, Dimensions} from 'react-native';
import utf8 from 'utf8';
import base64 from 'base-64';
import GridLayout from 'react-native-layout-grid';
import InfiniteScroll from 'react-native-infinite-scroll';
import LoadingButton from 'react-native-loading-button';


export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            content: [],
            query: '',
            pageNo: 1,
            prevQuery: '',           
        }
    }
    
    showData(queryParam) {
        const SHUTTER_CLIENT_ID = "a5210-05b77-edfcb-de365-9d1f7-23e5c";
        const SHUTTER_CLIENT_SECRET = "c5cc9-1176e-f2c85-74401-712b9-7b8f9";
        var text = `${SHUTTER_CLIENT_ID}:${SHUTTER_CLIENT_SECRET}`;
        var bytes = utf8.encode(text);
        var encoded = base64.encode(bytes);
        //console.warn(encoded);
        let token = 'Basic '.concat(encoded)
        const SHUTTERSTOCK_API_ENDPOINT = `https://api.shutterstock.com/v2/images/search?query=${queryParam}&page=${this.state.pageNo}&per_page=20`
        fetch(SHUTTERSTOCK_API_ENDPOINT, {
                'method' : 'GET',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization:  token
              }
        })
        .then((response) => response.json())
            .then((responseJson) => {
                var task_names = [];
                responseJson.data.forEach(function (cmt) {
                task_names.push(cmt.assets.preview.url);
                });
                this.setState(state => ({content: [...this.state.content, ...task_names], loading: false}));
                //console.warn(this.state.content)
            })
            .catch((error) => {
                console.error(error);
            });
        }

    //query updated
    updateValue(text, field) {
        if (field === 'query'){
            this.setState({
                query: text,
                content: []
            });
        }
    }

   
componentDidMount() {
    this.showData('')
}

handleEnd = () => {
    this.setState(state => ({pageNo: state.pageNo + 1}), () =>this.showData(this.state.query));
}
render() {
    const { ScrollContainer, container, searchIcon, searchSection, headerContainer, button, image, imageView, spinner, heading} = styles;
    return (
        <ScrollView style={ScrollContainer}>
            <View style = {container}>
                <View style = {headerContainer}>
                    <Text style = {heading}>Gallery</Text>
                </View>
                <View style={searchSection}>
                    <Image source={require('./assets/search.png')} style={searchIcon} />
                    <TextInput
                        style={{flex:1}}
                        placeholder="Type here to search!"
                        underlineColorAndroid="transparent"
                        onChangeText = {(text) => this.updateValue(text, 'query')}
                    />
                    <View style={button}>
                        <Button title = "search" onPress = {() => this.showData(this.state.query)} />
                        
                    </View>
                </View>
                <FlatList
                    numColumns={3}
                    data= {this.state.content}
                    onEndReached={() => this.handleEnd()}
                    onEndReachedThreshold={2.5}
                    renderItem ={ ({item}) => 
                        <View style = {imageView}>
                            <TouchableOpacity style={{flex:1}}>
                                <Image style = {image} source={{uri: item}}/>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </View>            
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
ScrollContainer: {
    flex:1
},
container: {
    flex: 1,
    backgroundColor: '#fff',
},
headerContainer: {
    flexDirection:'row',
    height:70,
    backgroundColor: '#000',
    justifyContent:'center',
    alignItems:'center'
},
heading: {
    fontSize:22,
    color:'#fff',
    fontWeight:'600'

},
searchSection: {
    margin:10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //flexDirection: 'row',
    //flex:1, 
    backgroundColor: '#fff',
    borderWidth: .5,
    borderColor: '#000',
    height: 40,
    borderRadius: 5 ,
},
searchIcon: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode : 'stretch',
    alignItems: 'center'
},
imageView: {
    width:Dimensions.get('window').width/3,
},
image: {
    height:80,    
    margin:10,
}, 
button: {
    justifyContent:'flex-end',
    alignItems:'flex-end',
    height:35,
    width:75
}
});
