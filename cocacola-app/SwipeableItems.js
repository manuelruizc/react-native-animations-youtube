import React, { Component } from 'react';
import { View, StyleSheet, Text, Dimensions, Animated, PanResponder, TouchableWithoutFeedback, Easing, ImageBackground } from 'react-native';

const BackgroundImage = Animated.createAnimatedComponent(ImageBackground);

const { width, height } = Dimensions.get('screen');

class SwipeableItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isYellowCanOnFront: true,
            swipedLeft: false,
            backgroundAnimationValue: 1,
            initialAnimationFinished: false,
        }
        this.gestureAnimation = new Animated.Value(0);
        this.backgroundAnimation = new Animated.Value(1);
        this.initialAnimation = new Animated.Value(0);
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                this.gestureAnimation.setValue(gestureState.dx);
            },
            onPanResponderRelease: (evt, gestureState) => {
                const { moveX, vx } = gestureState;
                const { gestureAnimation, backgroundAnimation } = this;
                const backgroundAnimationValue = this.state.backgroundAnimationValue === 1 ? 0 : 1;
                if(moveX >= (width - 150) && vx > 0) {
                    Animated.parallel([
                        Animated.timing(gestureAnimation, {
                            toValue: width,
                            duration: 350,
                            useNativeDriver: false,
                            easing: Easing.elastic(1.8),
                        }),
                        Animated.timing(backgroundAnimation, {
                            toValue: backgroundAnimationValue,
                            duration: 350,
                            useNativeDriver: true,
                            easing: Easing.linear,
                        })
                    ]).start(() => {
                        gestureAnimation.setValue(0)
                        this.setState({
                            isYellowCanOnFront: !this.state.isYellowCanOnFront,
                            backgroundAnimationValue
                        })
                    });
                }
                else if(moveX <= 250 && vx < 0) {
                    this.setState({swipedLeft: true}, () => {
                        Animated.parallel([
                            Animated.timing(gestureAnimation, {
                                toValue: width,
                                duration: 500,
                                useNativeDriver: false,
                                easing: Easing.elastic(1.9),
                            }),
                            Animated.timing(backgroundAnimation, {
                                toValue: backgroundAnimationValue,
                                duration: 350,
                                useNativeDriver:true,
                                easing: Easing.linear,
                            })
                        ]).start(() => {
                            gestureAnimation.setValue(0)
                            this.setState({
                                isYellowCanOnFront: !this.state.isYellowCanOnFront,
                                swipedLeft: false,
                                backgroundAnimationValue
                            });
                        });
                    })
                } 
                else {
                    Animated.timing(gestureAnimation, {
                        toValue: 0,
                        duration: 300,
                        easing: Easing.elastic(1.9),
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    }

    getFrontStyle = (animation) => {
        const { swipedLeft } = this.state;
        const translateX = animation.interpolate({
            inputRange: [-width, 0, width/2, width],
            outputRange: [-120, 0, 90, 50],
            extrapolate: 'clamp',
        });
        const scale = animation.interpolate({
            inputRange: [0, width],
            outputRange: [1, 0.8],
            extrapolate:'clamp',
        });
        const rotate = animation.interpolate({
            inputRange: [-width, 0, width],
            outputRange: ['-9deg', '0deg', '13deg'],
            extrapolate:'clamp',
        });
        const zIndex = animation.interpolate({
            inputRange: [-width, 0, width],
            outputRange: !swipedLeft ? [2, 2, 0] : [0, 0, 0],
        })

        return {
            transform: [
                {translateX},
                {scale},
                {rotate}
            ],
            zIndex,
            // elevation: zIndex,
        }
    }

    getBackStyle = (animation) => {
        const { swipedLeft } = this.state;
        const translateX = animation.interpolate({
            inputRange: [-width, 0,  width],
            outputRange: [80, 50, 0],
            extrapolate: 'clamp',
        });
        const scale = animation.interpolate({
            inputRange: [0, width],
            outputRange: [0.8, 1],
            extrapolate: 'clamp',
        });
        const rotate = animation.interpolate({
            inputRange: [0, width],
            outputRange: ['13deg', '0deg'],
            extrapolate: 'clamp',
        });
        const zIndex = animation.interpolate({
            inputRange: [-width, 0, width],
            outputRange: !swipedLeft ? [0, 0, 2] : [2, 2, 2],
        })

        return {
            transform: [
                {translateX},
                {rotate},
                {scale},
            ],
            zIndex,
            // elevation: zIndex,
        }
    }

    componentDidMount() {
        Animated.timing(this.initialAnimation, {
            toValue: 1,
            duration: 500,
            easing: Easing.elastic(2.3),
            useNativeDriver: true,
        }).start(() => {
            this.setState({
                initialAnimationFinished: true,
            });
        });
    }

    render() {
        const { gestureAnimation, backgroundAnimation, initialAnimation } = this;
        const { isYellowCanOnFront, initialAnimationFinished } = this.state;
        const translateX = initialAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [width, 0],
        });
        const _translateX = initialAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [width, 50],
        });
        const initialFrontStyling = {
            transform: [
                {translateX}
            ]
        }
        const initialBackStyling = {
            transform: [
                {translateX: _translateX},
                {scale: 0.8},
                {rotate: '13deg'},
            ]
        };



        let frontStyle = isYellowCanOnFront ? this.getFrontStyle(gestureAnimation) : this.getBackStyle(gestureAnimation);
        frontStyle = initialAnimationFinished ? frontStyle : initialFrontStyling;
        let backStyle = !isYellowCanOnFront ? this.getFrontStyle(gestureAnimation) : this.getBackStyle(gestureAnimation);
        backStyle = initialAnimationFinished ? backStyle : initialBackStyling;
        return (
            <View style={styles.container}>
                <Background
                    animation={backgroundAnimation}
                />
                <View {...this.panResponder.panHandlers} style={styles.panContainer}>
                    <Animated.Image
                        source={require('./assets/dk_coca-cola-light-taste-lime.png')}
                        style={[styles.image, {position:'absolute', top: 120,}, backStyle]}
                        resizeMode={'contain'}
                    />
                    <Animated.Image
                        source={require('./assets/dk_coca-cola-light-taste-exotic-mango.png')}
                        style={[styles.image, frontStyle]}
                        resizeMode={'contain'}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <View
                            style={styles.button}>
                            <Text style={{color:'#F40009'}}>Come Back</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}


const Background = ({animation}) => {
    const scale = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });
    return(
        <View style={styles.bgContainer}>
            <BackgroundImage
                style={[styles.bg]}
                resizeMode={'cover'}
                source={require('./assets/bg_green.png')}
            >
                <View style={styles.logoContainer}>
                    <Animated.Image
                        style={[styles.logo, { transform: [{scale}] }]}
                        resizeMode={'contain'}
                        source={require('./assets/light_tastes_lime_logo.png')}
                    />
                </View>
            </BackgroundImage>
            <BackgroundImage
                style={[styles.bg, {opacity: animation}]}
                resizeMode={'cover'}
                source={require('./assets/bg_orange.png')}
            >
                <View style={styles.logoContainer}>
                    <Animated.Image
                        style={[styles.logo, {transform: [ {scale: animation} ]}]}
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
        backgroundColor:'lightgreen',
    },
    panContainer: {
        width,
        height,
        justifyContent: 'center',
        alignItems:'center',
        zIndex: 1,
    },
    image: {
        marginTop: 100,
        width: '55%',
        height: '60%',
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
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 35,
        left: 0,
        width: '100%',
        zIndex: 6,
    },
    button: {
        backgroundColor:'white',
        borderRadius:100,
        alignSelf: 'center',
        paddingLeft:22,
        paddingRight:22,
        paddingTop: 12,
        paddingBottom: 12,
        justifyContent:'center',
        alignItems:'center'
    }
})
 
export default SwipeableItems;