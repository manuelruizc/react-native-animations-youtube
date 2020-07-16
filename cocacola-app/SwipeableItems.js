import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions, Image, ImageBackground, Easing, StyleSheet } from 'react-native';

const {width, height} = Dimensions.get('screen');

const BackgroundImage = Animated.createAnimatedComponent(ImageBackground);

class SwipeableItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialAnimation: new Animated.Value(0),
            initialAnimationFinished: false,
            cansAnimation: new Animated.Value(0),
            isYellowOnFront: true,
            swipedLeft: false,
            opacityAnimation: new Animated.Value(1),
            opacityValue: 1,
        };
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gestureState) => {
                this.state.cansAnimation.setValue(gestureState.dx);
            },
            onPanResponderRelease: (e, gestureState) => {
                const {vx, moveX} = gestureState;
                if(vx > 0 && moveX >= width-150) {
                    const opacityValue = this.state.opacityValue === 1 ? 0 : 1;
                    Animated.parallel([
                        Animated.timing(this.state.cansAnimation, {
                            toValue: width,
                            duration: 100,
                            easing: Easing.linear,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.opacityAnimation, {
                            toValue: opacityValue,
                            duration: 220,
                            easing: Easing.linear,
                            useNativeDriver: true,
                        })
                    ]).start(() => {
                        this.state.cansAnimation.setValue(0);
                        this.setState({isYellowOnFront: !this.state.isYellowOnFront, opacityValue});
                    });
                }
                else if(vx < 0 && moveX <= 150) {
                    const opacityValue = this.state.opacityValue === 1 ? 0 : 1;
                    this.setState({swipedLeft: true}, () => {
                        Animated.parallel([
                            Animated.timing(this.state.cansAnimation, {
                                toValue: width,
                                duration: 1000,
                                useNativeDriver: false,
                                easing: Easing.elastic(1.9),
                            }),
                            Animated.timing(this.state.opacityAnimation, {
                                toValue: opacityValue,
                                duration: 220,
                                useNativeDriver: true,
                            }),
                        ]).start(() => {
                            this.state.cansAnimation.setValue(0);
                            this.setState({isYellowOnFront: !this.state.isYellowOnFront, swipedLeft: false, opacityValue});
                        });
                    });
                }
                else {
                    Animated.spring(this.state.cansAnimation, {
                        toValue: 0,
                        friction: 50,
                        easing: Easing.elastic(1.9),
                        useNativeDriver: false,
                    }).start(() => {
                        this.panResponderActive = true;
                    })
                }
            }
        })
    }

    componentDidMount() {
        Animated.timing(this.state.initialAnimation, {
            toValue:1,
            duration: 750,
            easing: Easing.elastic(2.1),
            useNativeDriver: true,
        }).start(() => {
            this.setState({initialAnimationFinished: true});
        })
    }

    getFrontStyle = (animation) => {
        const {swipedLeft} = this.state;
        const translateX = animation.interpolate({
            inputRange: [-width, 0, width/2, width],
            outputRange: [-100, 0, 90, 40],
            extrapolate: 'clamp',
        });
        const rotate = animation.interpolate({
            inputRange: [-width, 0, width],
            outputRange: ['-14deg', '0deg', '10deg'],
            extrapolate:'clamp'
        });
        const scale = animation.interpolate({
            inputRange: [0, width],
            outputRange: [1, 0.85],
            extrapolate:'clamp'
        });
        const zIndex = animation.interpolate({
            inputRange: [-width, 0, width/3, width],
            outputRange: !swipedLeft ? [3, 3, 0, 0] : [0, 0, 0, 0],
            extrapolate:'clamp',
        })

        return {
            transform: [
                {translateX},
                {rotate},
                {scale},
            ],
            zIndex,
            elevation: zIndex,
        };
    }

    getBackStyle = (animation) => {
        const {swipedLeft} = this.state;
        const translateX = animation.interpolate({
            inputRange: [-width, 0, width/2, width],
            outputRange: [35, 40, 10, 0],
            extrapolate: 'clamp',
        });
        const rotate = animation.interpolate({
            inputRange: [-width, 0, width],
            outputRange: ['9deg', '10deg', '0deg'],
            extrapolate:'clamp'
        });
        const scale = animation.interpolate({
            inputRange: [-width, 0, width],
            outputRange: [0.9, 0.85, 1],
            extrapolate:'clamp'
        });
        const zIndex = animation.interpolate({
            inputRange: [-width, 0, width/3, width],
            outputRange: !swipedLeft ? [4, 0, 0, 4] : [4, 4, 4, 4],
            extrapolate:'clamp',
        })

        return {
            transform: [
                {translateX},
                {rotate},
                {scale}
            ],
            zIndex,
            elevation: zIndex,
        };
    }

    render() {
        const {
            initialAnimation,
            initialAnimationFinished,
            cansAnimation,
            isYellowOnFront,
        } = this.state;
        const _translateX = initialAnimation.interpolate({
            inputRange: [0,1],
            outputRange: [width, 40],
            extrapolateLeft:'clamp'
        });
        const translateX = initialAnimation.interpolate({
            inputRange: [0,1],
            outputRange: [width, 0],
            extrapolateLeft:'clamp'
        });

        const frontStyle = !initialAnimationFinished ?
                            { transform: [{translateX}] } :
                            isYellowOnFront ? this.getFrontStyle(cansAnimation) : this.getBackStyle(cansAnimation);
        const backStyle = !initialAnimationFinished ?
                            { transform: [{translateX: _translateX}, {scale: 0.85}, {rotate: '10deg'}] } :
                            !isYellowOnFront ? this.getFrontStyle(cansAnimation) : this.getBackStyle(cansAnimation);
        return (
            <View style={styles.container}>
                <Background
                    opacityAnimation={this.state.opacityAnimation}
                />
                <View
                    {...this.panResponder.panHandlers}
                    style={styles.panContainer}
                >
                    <Animated.View
                        style={[styles.itemContainer,{ position: 'absolute'}, backStyle]}
                    >
                        <Image
                            source={require('./assets/dk_coca-cola-light-taste-lime.png')}
                            resizeMode={'contain'}
                            style={styles.item}
                        />
                    </Animated.View>
                    <Animated.View
                        style={[styles.itemContainer, frontStyle]}
                    >
                        <Image
                            source={require('./assets/dk_coca-cola-light-taste-exotic-mango.png')}
                            resizeMode={'contain'}
                            style={styles.item}
                        />
                    </Animated.View>
                </View>
            </View>
        );
    }
};

const Background = (props) => {
    const {opacityAnimation} = props;
    const scale = opacityAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });
    return(
        <View style={styles.bgContainer}>
            <BackgroundImage
                        style={[styles.bg, {zIndex: -1,}]}
                        resizeMode={'cover'}
                        source={require('./assets/bg_green.png')}
            >
                <View style={styles.logoContainer}>
                    <Animated.Image
                        style={[styles.logo, {transform: [{scale}]}]}
                        resizeMode={'contain'}
                        source={require('./assets/light_tastes_lime_logo.png')}
                    />
                </View>
            </BackgroundImage>
            <BackgroundImage
                        style={[styles.bg, {opacity: opacityAnimation}]}
                        resizeMode={'cover'}
                        source={require('./assets/bg_orange.png')}
            >
                <View style={styles.logoContainer}>
                    <Animated.Image
                        style={[styles.logo, {transform: [{scale: opacityAnimation}]}]}
                        resizeMode={'contain'}
                        source={require('./assets/light_tastes_mango_logo.png')}
                    />
                </View>
            </BackgroundImage>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
    },
    panContainer: {
        width,
        height,
        justifyContent:'center',
        alignItems: 'center',
        zIndex: 10,
    },
    itemContainer: {
        width:'55%',
        height: '62%',
        paddingTop: 50,
    },
    item: {
        width:'100%',
        height: '100%',
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
        width:'50%',
        height: 90,
    }
});

export default SwipeableItems;