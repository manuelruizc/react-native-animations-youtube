import React, { Component } from 'react';

import {
    View,
    Animated,
    Easing,
    Image,
    ImageBackground,
    PanResponder,
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';

const BackgroundImage = Animated.createAnimatedComponent(ImageBackground);

const {width, height} = Dimensions.get('screen');


class SwipeableItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacityAnimation: new Animated.Value(1),
            initialAnimation: new Animated.Value(0),
            cansAnimation: new Animated.Value(1),
            initialAnimationFinished: false,
            swipedLeft: false,
            isYellowOnFront: true,
            opacityValue: 1,
        }
        this.panResponderActive = false;
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gestureState) => {
                this.state.cansAnimation.setValue(gestureState.dx)
            },
            onPanResponderRelease: (e, gestureState) => {
                const { vx, moveX } = gestureState;
                if(moveX >= (width - 150) && vx > 0) {
                    const opacityValue = this.state.opacityValue === 1 ? 0 : 1;
                    Animated.parallel([
                        Animated.spring(this.state.cansAnimation, {
                            toValue: width,
                            friction: 150,
                            tension: 120,
                            easing: Easing.elastic(1.2),
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.opacityAnimation, {
                            toValue: opacityValue,
                            duration: 250,
                            easing: Easing.linear,
                            useNativeDriver: true,
                        })
                    ]).start(() => {
                        this.state.cansAnimation.setValue(0);
                        this.setState({isYellowOnFront: !this.state.isYellowOnFront, opacityValue, swipedLeft: false}, () => {
                            console.log("IS ZERO", this.state.cansAnimation);
                        });
                    });
                }
                else if(moveX <= 100 && vx < 0) {
                    const opacityValue = this.state.opacityValue === 1 ? 0 : 1;
                    this.setState({swipedLeft: true}, () => {
                        Animated.parallel([
                            Animated.timing(this.state.cansAnimation, {
                                toValue: width,
                                duration: 150,
                                easing: Easing.linear,
                                useNativeDriver: false
                            }),
                            Animated.timing(this.state.opacityAnimation, {
                                toValue: opacityValue,
                                duration: 250,
                                easing: Easing.linear,
                                useNativeDriver: true,
                            })
                        ]).start(() => {
                            this.state.cansAnimation.setValue(0)
                            this.setState({
                                swipedLeft: false,
                                opacityValue,
                                isYellowOnFront: !this.state.isYellowOnFront
                            }, () => {
                                console.log(this.state.swipedLeft)
                            });
                        });
                    })
                }
                else {
                    Animated.timing(this.state.cansAnimation, {
                        toValue: 0,
                        duration: 550,
                        useNativeDriver: false,
                        easing: Easing.elastic(1.8)
                    }).start()
                }
            },
        });
    }

    componentDidMount() {
        Animated.timing(this.state.initialAnimation, {
            toValue: 1,
            duration: 450,
            easing: Easing.elastic(2.3),
            useNativeDriver: false,
        }).start(() => {
            this.setState({initialAnimationFinished: true});
        });
    }

    getBackStyles = (animation) => {
        const {swipedLeft} = this.state;
        const translateX = animation.interpolate({
            inputRange: [-width, 0, width/2, width],
            outputRange: [100, 40, 40, 0],
            extrapolate: 'clamp',
        });
        const rotate = animation.interpolate({
            inputRange: [-width, 0, width/2, width],
            outputRange: ['0deg', '13deg', '0deg', '0deg'],
            extrapolate:'clamp',
        });
        const scale = animation.interpolate({
            inputRange: [-width, 0, width],
            outputRange: [0.9, 0.85, 1],
            extrapolate:'clamp',
        });
        const inputRange = [-width, 0, width / 2, width];
        const outputRange = !this.state.swipedLeft ? [2, 0, 0, 2] : [2, 2, 2, 2];
        const zIndex = animation.interpolate({
            inputRange,
            outputRange,
            extrapolate: 'clamp',
        });

        
        return {
            transform: [
                {translateX},
                {scale},
                {rotate},
            ],
            zIndex,
            elevation: zIndex,
        }
    }

    getFrontStyles = (animation) => {
        const {swipedLeft} = this.state;
        console.log("SIPEDLEF", swipedLeft)
        const translateX = animation.interpolate({
            inputRange: [-width, 0, width/2, width],
            outputRange: [-150, 0, 100, 40],
            extrapolate: 'clamp',
        });
        const rotate = animation.interpolate({
            inputRange: [-width, 0, width],
            outputRange: ['-13deg', '0deg', '13deg'],
            extrapolate:'clamp',
        });
        const scale = animation.interpolate({
            inputRange: [-width, 0, width],
            outputRange: [1, 1, 0.85],
            extrapolate:'clamp',
        });
        const inputRange = [-width, 0, width / 2, width];
        const outputRange = !this.state.swipedLeft ? [3, 3, 0, 0] : [0, 0, 0, 0];
        const zIndex = animation.interpolate({
            inputRange,
            outputRange,
            extrapolate: 'clamp',
        });


        return {
            transform: [
                {translateX},
                {rotate},
                {scale}
            ],
            zIndex,
            elevation: zIndex,
        }
    }

    render() {
        const { 
            cansAnimation,
            initialAnimation,
            initialAnimationFinished,
            isYellowOnFront,
            opacityAnimation,
        } = this.state;
        console.log(isYellowOnFront)
        const {getBackStyles, getFrontStyles} = this;
        const initialBackTranslateX = initialAnimation.interpolate({
            inputRange:[0, 1],
            outputRange:[width, 40],
        });
        const initialFrontTranslateX = initialAnimation.interpolate({
            inputRange:[0, 1],
            outputRange:[width, 0],
        });
        const backStyles = !initialAnimationFinished ?
                            { transform: [{translateX: initialBackTranslateX}, {scale:0.85}, {rotate:'13deg'}] }
                            : !isYellowOnFront ? getFrontStyles(cansAnimation) : getBackStyles(cansAnimation);
        const frontStyles = !initialAnimationFinished ? { transform: [{translateX: initialFrontTranslateX}] }
                            : isYellowOnFront ? getFrontStyles(cansAnimation) : getBackStyles(cansAnimation);
        return (
            <View style={styles.container}>
                <Background
                    opacityAnimation={opacityAnimation}
                />
                <View
                    {...this.panResponder.panHandlers}
                    style={styles.panContainer}
                >
                    <Animated.View
                        style={[
                            {width: '60%', height: '78%', position: 'absolute',},
                            backStyles
                        ]}>
                        <TouchableWithoutFeedback
                            style={{width: '100%', height: '100%'}}
                        >
                            <Image
                                style={{width: '100%', height: '100%'}}
                                resizeMode={'contain'}
                                source={require('./assets/dk_coca-cola-light-taste-lime.png')}
                            />
                        </TouchableWithoutFeedback>
                    </Animated.View>
                    <Animated.View
                        style={[
                            {width: '60%', height: '78%',},
                            frontStyles
                        ]}>
                        <TouchableWithoutFeedback
                            style={{width: '100%', height: '100%'}}
                        >
                            <Image
                                style={{width: '100%', height: '100%'}}
                                resizeMode={'contain'}
                                source={require('./assets/dk_coca-cola-light-taste-exotic-mango.png')}
                            />
                        </TouchableWithoutFeedback>
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
        extrapolate: 'clamp'
    });
    return(
        <View style={styles.bgContainer}>
            <BackgroundImage
                        style={[styles.bg, {zIndex: 1, opacity: opacityAnimation}]}
                        resizeMode={'cover'}
                        source={require('./assets/bg_orange.png')}
            >
                <View style={styles.logoContainer}>
                    <Animated.Image
                        style={[styles.logo, { transform: [{ scale: opacityAnimation }] }]}
                        resizeMode={'contain'}
                        source={require('./assets/light_tastes_mango_logo.png')}
                    />
                </View>
            </BackgroundImage>
            <BackgroundImage
                        style={[styles.bg, {zIndex: 0}]}
                        resizeMode={'cover'}
                        source={require('./assets/bg_green.png')}
            >
                <View style={styles.logoContainer}>
                    <Animated.Image
                        style={[styles.logo, { transform: [{ scale }] }]}
                        resizeMode={'contain'}
                        source={require('./assets/light_tastes_lime_logo.png')}
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
        backgroundColor:'#4d5eef',
    },
    panContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 60,
        zIndex: 2,
    },
    bgContainer: {
        position:'absolute',
        top:0, left: 0,
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
 
export default SwipeableItems;