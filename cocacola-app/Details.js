import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Animated, Easing, Dimensions, Image, ImageBackground } from 'react-native';

const { width, height } = Dimensions.get('window');

class Details extends Component {
    animations = [
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ];

    componentDidMount() {
        const { animations } = this
        const duration = 450;
        const elasticValue = 1.8;
        Animated.stagger(70, [
            Animated.timing(animations[0], {
                toValue: 1,
                duration,
                easing: Easing.elastic(elasticValue),
                useNativeDriver: true
            }),
            Animated.timing(animations[1], {
                toValue: 1,
                duration,
                easing: Easing.elastic(elasticValue),
                useNativeDriver: true
            }),
            Animated.timing(animations[2], {
                toValue: 1,
                duration,
                easing: Easing.elastic(elasticValue),
                useNativeDriver: true
            }),
            Animated.timing(animations[3], {
                toValue: 1,
                duration,
                easing: Easing.elastic(elasticValue),
                useNativeDriver: true
            }),
            Animated.timing(animations[4], {
                toValue: 1,
                duration,
                easing: Easing.elastic(elasticValue),
                useNativeDriver: true
            }),
            Animated.timing(animations[5], {
                toValue: 1,
                duration,
                easing: Easing.elastic(elasticValue),
                useNativeDriver: true
            }),
            Animated.timing(animations[6], {
                toValue: 1,
                duration,
                easing: Easing.elastic(elasticValue),
                useNativeDriver: true
            }),
        ]).start();
    }

    render() {
        const logoAnimationValue = this.animations[5];
        const { goBack, state } = this.props.navigation;
        const { background, logo } = state.params;
        return (
            <ImageBackground
                style={{flex: 1, justifyContent: 'space-evenly', alignItems:'center', }}
                source={background}
                resizeMode={'cover'}
            >
                <Animated.View style={[styles.title_container,]}>
                    <Image
                        style={[styles.image]}
                        resizeMode={'contain'}
                        source={logo}
                    />
                </Animated.View>
                <View style={{width:width*0.65, height: height*0.38, justifyContent: 'space-between', alignItems:'flex-start',}}>
                    <TextContainer goBack={goBack} animations={this.animations} />
                </View>
            </ImageBackground>
        );
    }
};



class TextContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { animations, goBack } = this.props;
        const interpolatedAnimations = animations.map(_ => {
            return _.interpolate({
                inputRange: [0, 1],
                outputRange: [width, 0]
            });
        });
        const interpolatedStyles = interpolatedAnimations.map(interpolatedValue => {
            return {
                transform: [
                    {translateX: interpolatedValue}
                ]
            }
        });
        const buttonAnimationValue = animations[5].interpolate({
            inputRange: [0, 1],
            outputRange: [-width, 0],
        });

        return (
            <>  
                <Animated.View style={[styles.horizontal_text_container, styles.containerDivisor, interpolatedStyles[0] ]}>
                    <Text style={styles.bold_text}>Energy Value:</Text>
                    <Text style={styles.normal_text}>597 kj / 139 Kcal</Text>
                </Animated.View>
                <Animated.View style={[styles.horizontal_text_container, interpolatedStyles[1]]}>
                    <Text style={styles.bold_text}>Fat:</Text>
                    <Text style={styles.normal_text}>0g</Text>
                </Animated.View>
                <Animated.View style={[styles.horizontal_text_container, interpolatedStyles[2] ]}>
                    <Text style={[styles.normal_text, { marginTop: -20 }]}>sat. fatty acids:</Text>
                    <Text style={[styles.normal_text, { marginTop: -20 }]}>0g</Text>
                </Animated.View>
                <Animated.View style={[styles.horizontal_text_container, interpolatedStyles[3]]}>
                    <Text style={[styles.bold_text, { marginTop: -10, }]}>Carbohydrates:</Text>
                    <Text style={[styles.normal_text, { marginTop: -10, }]}>35g</Text>
                </Animated.View>
                <Animated.View style={[styles.horizontal_text_container, styles.containerDivisor, interpolatedStyles[4]]}>
                    <Text style={[styles.normal_text, { marginTop:-20 }]}>of which sugars:</Text>
                    <Text style={[styles.normal_text, { marginTop:-20 }]}>35g</Text>
                </Animated.View>
                <Animated.View style={[styles.horizontal_text_container, interpolatedStyles[5] ]}>
                    <Text style={styles.bold_text}>Protein:</Text>
                    <Text style={styles.normal_text}>0g</Text>
                </Animated.View>
                <Animated.View style={[styles.horizontal_text_container, { marginTop: -16 }, interpolatedStyles[6]]}>
                    <Text style={styles.bold_text}>Salt:</Text>
                    <Text style={styles.normal_text}>0g</Text>
                </Animated.View>
                <TouchableWithoutFeedback
                    onPress={() => goBack()}
                >
                    <Animated.View
                        style={[styles.button, {transform: [{translateX: buttonAnimationValue}]}]}>
                        <Text style={{color:'#F40009'}}>Come Back</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </>
        );
    }
}

const styles = StyleSheet.create({
    title_container: {
        width: width*0.5,
        height: height * 0.1,
    },
    image: {
        width:'100%',
        height:'100%',
    },
    horizontal_text_container: {
        width: '100%',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
    },
    containerDivisor: {
        paddingBottom: 8,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)'
    },
    bold_text: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 14,
        width: '45%',
    },
    normal_text: {
        fontSize:14,
        color:'white',
        width:'45%',
    },
    button: {
        backgroundColor:'white',
        transform: [{translateY: 50}, ],
        borderRadius:100,
        alignSelf: 'center',
        paddingLeft:22,
        paddingRight:22,
        paddingTop: 12,
        paddingBottom: 12,
        justifyContent:'center',
        alignItems:'center'
    }
});
 
export default Details;