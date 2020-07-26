import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Animated, ImageBackground, Dimensions, Easing, TouchableWithoutFeedback } from 'react-native';

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
        this.state = { 
            initialAnimationFinished: false,
        }
        this.scrollAnimation = new Animated.Value(0);
        this.initialAnimation = new Animated.Value(0);
    }

    componentDidMount() {
        Animated.timing(this.initialAnimation, {
            toValue: 1,
            duration: 500,
            easing: Easing.elastic(2.4),
            useNativeDriver: true,
        }).start(() => {
            this.setState({
                initialAnimationFinished: true,
            });
        })
    }

    navigateTo = (index) => {
        const { navigate } = this.props.navigation;
        if(index === 2) {
            navigate('Swipeable');
        }
        else {
            navigate('Details', {
                background: items[index].background,
                logo: items[index].logo,
            });
        }
    }

    render() {
        const { scrollAnimation, initialAnimation } = this;
        const { initialAnimationFinished } = this.state;
        return (
            <View style={styles.container}>
                <Background
                    scrollAnimation={scrollAnimation}
                    items={items}
                    initialAnimation={initialAnimation}
                    initialAnimationFinished={initialAnimationFinished}
                />
                <Animated.ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    style={{zIndex: items.length + 1}}
                    onScroll={Animated.event(
                        [ { nativeEvent: { contentOffset: { x: this.scrollAnimation } } } ],
                        {
                            useNativeDriver: true,
                        }
                    )}
                >
                    <Items navigateTo={this.navigateTo} initialAnimation={initialAnimation} scrollAnimation={scrollAnimation} items={items} />
                </Animated.ScrollView>
            </View>
        );
    }
}


const Background = ({scrollAnimation, items, initialAnimation, initialAnimationFinished}) => {
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
                        key={`item-${index}`}
                        style={[styles.bg, {zIndex, opacity}]}
                        resizeMode={'cover'}
                        source={item.background}
                    >
                        <View style={styles.logoContainer}>
                            <Animated.Image
                                style={[styles.logo, { transform: [{ scale: index === 0 && !initialAnimationFinished ? initialAnimation : scale }] }]}
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

const Items = ({ scrollAnimation, items, initialAnimation, navigateTo }) => {
    const translateY =  initialAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });
    return(
        <>
            {items.map((item, index) => {
                const inputRange = index === 0 ? [0, width] : [width*(index-1), width*index, width*(index+1)];
                const outputRange = index === 0 ? ['0deg', '-20deg'] : ['20deg', '0deg', '-20deg'];
                const rotate = scrollAnimation.interpolate({
                    inputRange,
                    outputRange,
                    extrapolate: 'clamp',
                });
                return(
                    <TouchableWithoutFeedback key={index} onPress={() => navigateTo(index)}>
                        <Animated.View style={[styles.itemContainer, { transform: [{translateY: index === 0 ? translateY : 0}] }]}>
                            <Animated.Image
                                source={item.item_image}
                                resizeMode={'contain'}
                                style={[styles.item, { transform: [{rotate}] }]}
                            />
                        </Animated.View>
                    </TouchableWithoutFeedback>
                );
            })}
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        position:'relative',
        backgroundColor: 'red'
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