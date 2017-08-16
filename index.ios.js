/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native';

var REQUEST_URL = 'http://reader.smartisan.com/index.php?r=line/show';

class HomePage extends Component {
  render(){
    return (
      <View style={styles.mainContainer}>
        <TitleBar />
        <Timeline />
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

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource : new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded : false,
    };
  }

  componentDidMount(){
    this.fetchData();
  }

  fetchData() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource : this.state.dataSource.cloneWithRows(responseData.data.list),
          loaded : true,
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .done();
  }

  render() {
    if(!this.state.loaded){
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource = {this.state.dataSource}
        renderRow = {this.renderMovie}
        style = {styles.listView}
        renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
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

  renderMovie(article){
    var prepicView;

    renderThumbnail = (url) => {
      if(url){
        return (<Image
          source={{uri: url}}
          style={styles.thumbnail}
        />)
      }
      return null;
    }

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
      <View style={styles.container}>
        <Text numberOfLines={2} style={styles.title}>{article.title}</Text>
        <Text numberOfLines={3} style={styles.brief}>{article.brief}</Text>
        {prepicView}
      </View>
    );
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

AppRegistry.registerComponent('SmartisanReaderRN', () => HomePage);
