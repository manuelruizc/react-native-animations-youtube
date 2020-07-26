import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import CocaColaSlider from './CocaColaSlider';
import Details from './Details';
import SwipeableItems from './SwipeableItems';

const navigationOptions = {
    headerShown: false,
    animationEnabled: false,
};

const screens = {
    Home: {
        screen: CocaColaSlider,
        navigationOptions,    
    },
    Details: {
        screen: Details,
        navigationOptions,
    },
    Swipeable: {
        screen: SwipeableItems,
        navigationOptions,
    }
}


const AppStack = createStackNavigator(screens);
export default createAppContainer(AppStack);