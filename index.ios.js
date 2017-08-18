/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  WebView
} from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';

var REQUEST_URL = 'http://reader.smartisan.com/index.php?r=line/show';

class ArticlePage extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.article.title}`,
  });
  render(){
    const { params } = this.props.navigation.state;
    return (
      <WebView
        source={{uri: params.article.origin_url}}
        style={styles.mainContainer}
      />
    )
  }
}

class HomePage extends Component {
  static navigationOptions = {
    title: '锤子阅读',
  };
  render(){
    return (
      <View style={styles.mainContainer}>
        <Timeline navigation = {this.props.navigation}/>
      </View>
    )
  }
}

class TitleBar extends Component{
  render(){
    return (
      <View style={styles.titlebar}>
        <Text style={styles.titlebarButton}>About</Text>
        <Text style={styles.titlebarText}>SmartisanReader</Text>
        <Text style={styles.titlebarButton}>Subscribe</Text>
      </View>

    )
  }
}

class TimelineItem extends React.PureComponent {

  _onPress = () => {
    this.props.onPressItem(this.props.article);
  };

  renderThumbnail(url){
    if(url){
      return (<Image
        source={{uri: url}}
        style={styles.thumbnail}
      />)
    }
    return null;
  }

  render(){
    var article = this.props.article;
    var prepicView;

    if(article.prepic1){
      prepicView = (<View style={styles.imageContainer}>
        <Image
          source={{uri: article.prepic1}}
          style={styles.thumbnail}
        />
        {this.renderThumbnail(article.prepic2)}
        {this.renderThumbnail(article.prepic3)}
      </View>);
    }

    return (
      <TouchableOpacity style={styles.container} onPress={this._onPress}>
        <Text numberOfLines={2} style={styles.title}>{article.title}</Text>
        <Text numberOfLines={3} style={styles.brief}>{article.brief}</Text>
        {prepicView}
      </TouchableOpacity>
    );
  }
}

class Timeline extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataSource :[],
      loaded : false,
    };
  }

  _keyExtractor = (item, index) => item.id;

  componentDidMount(){
    this.fetchData();
  }

  fetchData() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData.data.list);
        this.setState({
          dataSource : responseData.data.list,
          loaded : true,
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .done();
  }

  _onPressItem = (article) =>{
    const { navigate } = this.props.navigation;
    navigate('Article', {article:article})
  };


  render() {
    if(!this.state.loaded){
      return this.renderLoadingView();
    }

    return (
      <FlatList
        data = {this.state.dataSource}
        extraData={this.state}
        renderItem = { ({item}) =>(
          <TimelineItem
            article = {item}
            onPressItem={this._onPressItem}
          />
        ) }
        style = {styles.listView}
        keyExtractor={this._keyExtractor}
      />
    );
  }

  renderLoadingView(){
    return (
      <View style={styles.container}>
        <Text>
          Loading movies...
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer:{
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffffff'
  },
  titlebar: {
    paddingTop: 20,
    justifyContent: 'center',
    backgroundColor:'#81c04d',
    flexDirection: 'row'
  },
  titlebarButton: {
    width:100,
    color:'#fff',
    textAlign:'center'
  },
  titlebarText: {
    flex: 1,
    color:'#fff',
    textAlign:'center'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffffff'
  },
  thumbnail:{
    width: 62,
    height: 62,
    marginRight:7
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 18,
    marginRight: 18,
    marginBottom: 7
  },
  title: {
    flex:1,
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 8,
    color: '#000000cc',
    marginTop: 10,
    marginLeft: 18,
    marginRight: 18
  },
  brief: {
    textAlign: 'left',
    color: '#00000080',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 18,
    marginRight: 18,
    marginBottom: 7
  },
  listView: {
    backgroundColor: '#F5FCFF',
  },
  separator: {
    height: 1,
    backgroundColor: '#0000001a',
  },
});

const App = StackNavigator({
  Home: { screen: HomePage },
  Article: { screen: ArticlePage },
});

AppRegistry.registerComponent('SmartisanReaderRN', () => App);
