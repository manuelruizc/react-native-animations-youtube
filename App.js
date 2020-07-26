import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';
import Navigation from './cocacola-app/Navigation';

class App extends React.Component {
  state = {
    isReady: false,
  };

  render() { 
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      ); }

    return (
      <Navigation />
    );
  }

  async _cacheResourcesAsync() {
    const images = [
      require('./cocacola-app/assets/background_no_sugar.png'),
      require('./cocacola-app/assets/background_red.png'),
      require('./cocacola-app/assets/backgrounds-crazy.png'),
      require('./cocacola-app/assets/bg_green.png'),
      require('./cocacola-app/assets/bg_orange.png'),
      require('./cocacola-app/assets/bg_red.png'),
      require('./cocacola-app/assets/classic_coke_logo.png'),
      require('./cocacola-app/assets/coffee_background.png'),
      require('./cocacola-app/assets/coke_items-01.png'),
      require('./cocacola-app/assets/coke_nosugar_can.png'),
      require('./cocacola-app/assets/coke_regular_can.png'),
      require('./cocacola-app/assets/dk_coca-cola-light-taste-exotic-mango.png'),
      require('./cocacola-app/assets/dk_coca-cola-light-taste-lime.png'),
      require('./cocacola-app/assets/light_background.png'),
      require('./cocacola-app/assets/light_tastes_coke_logo-01.png'),
      require('./cocacola-app/assets/light_tastes_coke_logo.png'),
      require('./cocacola-app/assets/light_tastes_lime_logo.png'),
      require('./cocacola-app/assets/light_tastes_mango_logo.png'),
      require('./cocacola-app/assets/nosugar_coke_logo.png'),
      require('./cocacola-app/assets/plus_coffee_coke_logo.png'),
      require('./cocacola-app/assets/xxxaaa.png'),  
    ];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    }); 
    return Promise.all(cacheImages);
  }
}
 
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
