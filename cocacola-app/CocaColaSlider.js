import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Animated, ImageBackground, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');

const BackgroundImage = Animated.createAnimatedComponent(ImageBackground)

const items = [
    {
        background: require('./assets/background_red.png'),
        item_image: require('./assets/coke_regular_can.png'),
        logo: require('./assets/classic_coke_logo.png'),
    },
    {
        background: require('./assets/coffee_background.png'),
        item_image: require('./assets/coke_items-01.png'),
        logo: require('./assets/plus_coffee_coke_logo.png'),
    },
    {
        background: require('./assets/light_background.png'),
        item_image: require('./assets/dk_coca-cola-light-taste-exotic-mango.png'),
        logo: require('./assets/light_tastes_coke_logo.png'),
    },
    {
        background: require('./assets/background_no_sugar.png'),
        item_image: require('./assets/coke_nosugar_can.png'),
        logo: require('./assets/nosugar_coke_logo.png'),
    },
]

class CocaColaSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
        this.scrollAnimation = new Animated.Value(0);
    }
    render() {
        const { scrollAnimation } = this;
        
        return (
            <View style={styles.container}>
                <Background
                    scrollAnimation={scrollAnimation}
                    items={items}
                />
                <Animated.ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [ { nativeEvent: { contentOffset: { x: this.scrollAnimation } } } ],
                        {
                            useNativeDriver: false,
                        }
                    )}
                >
                    <Items scrollAnimation={scrollAnimation} items={items} />
                </Animated.ScrollView>
            </View>
        );
    }
}


const Background = (props) => {
    const { scrollAnimation, items } = props;
    return(
        <View style={styles.bgContainer}>
            {items.map((item, index) => {
                const zIndex = items.length - index;
                const inputRange = [width*index, width*(index+1)];
                const outputRange = [1, 0];
                const opacity = scrollAnimation.interpolate({
                    inputRange,
                    outputRange,
                    extrapolate:'clamp',
                });

                const inputRangeLogo = index === 0 ? [0, width] : [width*(index-1), width*index, width*(index+1)]; 
                const outputRangeLogo = index === 0 ? [1, 0] : [0, 1, 0]; 
                const scale = scrollAnimation.interpolate({
                    inputRange: inputRangeLogo,
                    outputRange: outputRangeLogo,
                    extrapolate: 'clamp',
                });
                return(
                    <BackgroundImage
                        style={[styles.bg, {zIndex, opacity}]}
                        resizeMode={'cover'}
                        source={item.background}
                    >
                        <View style={styles.logoContainer}>
                            <Animated.Image
                                style={[styles.logo, { transform: [{ scale }] }]}
                                resizeMode={'contain'}
                                source={item.logo}
                            />
                        </View>
                    </BackgroundImage>
                );
            })}
        </View>
    );
}

const Items = (props) => {
    const { scrollAnimation, items } = props;
    return(
        <>
            {items.map((item, index) => {
                const inputRange = index === 0 ? [0, width] : [width*(index-1), width*index, width*(index+1)];
                const outputRange = index === 0 ? ['0deg', '20deg'] : ['-20deg', '0deg', '20deg'];
                const rotate = scrollAnimation.interpolate({
                    inputRange,
                    outputRange,
                    extrapolate: 'clamp',
                });
                return(
                    <View key={index} style={styles.itemContainer}>
                        <Animated.Image
                            source={item.item_image}
                            resizeMode={'contain'}
                            style={[styles.item, { transform: [{rotate}] }]}
                        />
                    </View>
                );
            })}
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        position:'relative',
    },
    itemContainer: {
        width,
        height,
        justifyContent:'center',
        alignItems:'center',
    },
    item: {
        width: '70%',
        height:'55%',
    },
    bgContainer: {
        position:'absolute',
        width,
        height,
    },
    bg: {
        width:'100%',
        height:'100%',
        position:'absolute',
        alignItems: 'center',
        justifyContent:'flex-start',
    },
    logoContainer: {
        width:'100%',
        marginTop: 50,
        justifyContent:'center',
        alignItems:'center',
    },
    logo: {
        width:'60%',
        height: 90,
    }
});


 
export default CocaColaSlider;