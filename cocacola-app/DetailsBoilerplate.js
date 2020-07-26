import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Animated, Easing, Dimensions, Image, ImageBackground } from 'react-native';

const { width, height } = Dimensions.get('window');
const inputRange = [0, 1];

class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        return (
            <ImageBackground
                style={{flex: 1, justifyContent: 'space-evenly', alignItems:'center', }}
                source={require('./assets/background_red.png')}
                resizeMode={'cover'}
            >
                <Animated.View style={[styles.title_container,]}>
                    <Image
                        style={[styles.image]}
                        resizeMode={'contain'}
                        source={require('./assets/classic_coke_logo.png')}
                    />
                </Animated.View>
                <View style={{width:width*0.65, height: height*0.38, justifyContent: 'space-between', alignItems:'flex-start',}}>
                    <TextContainer />
                </View>
            </ImageBackground>
        );
    }
};



const TextContainer = () => {
    return (
        <>  
            <Animated.View style={[styles.horizontal_text_container, styles.textContainerWithDivisor]}>
                <Text style={styles.bold_text}>Energy Value:</Text>
                <Text style={styles.normal_text}>597 kj / 139 Kcal</Text>
            </Animated.View>
            <Animated.View style={[styles.horizontal_text_container,]}>
                <Text style={styles.bold_text}>Fat:</Text>
                <Text style={styles.normal_text}>0g</Text>
            </Animated.View>
            <Animated.View style={[styles.horizontal_text_container, ] }>
                <Text style={[styles.normal_text, { marginTop: -20 }]}>sat. fatty acids:</Text>
                <Text style={[styles.normal_text, { marginTop: -20 }]}>0g</Text>
            </Animated.View>
            <Animated.View style={[styles.horizontal_text_container,] }>
                <Text style={[styles.bold_text, { marginTop: -10, }]}>Carbohydrates:</Text>
                <Text style={[styles.normal_text, { marginTop: -10, }]}>35g</Text>
            </Animated.View>
            <Animated.View style={[styles.horizontal_text_container, styles.textContainerWithDivisor]}>
                <Text style={[styles.normal_text, { marginTop:-20 }]}>of which sugars:</Text>
                <Text style={[styles.normal_text, { marginTop:-20 }]}>35g</Text>
            </Animated.View>
            <Animated.View style={[styles.horizontal_text_container,] }>
                <Text style={styles.bold_text}>Protein:</Text>
                <Text style={styles.normal_text}>0g</Text>
            </Animated.View>
            <Animated.View style={[styles.horizontal_text_container, {marginTop: -16} ]}>
                <Text style={styles.bold_text}>Salt:</Text>
                <Text style={styles.normal_text}>0g</Text>
            </Animated.View>
            <TouchableWithoutFeedback
            >
                <Animated.View style={styles.button}>
                    <Text style={{color:'#F40009'}}>Come Back</Text>
                </Animated.View>
            </TouchableWithoutFeedback>
        </>
    );
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
    textContainerWithDivisor: {
        marginBottom:8,
        paddingBottom: 8,
        borderBottomWidth:1,
        borderBottomColor:'rgba(255, 255, 255,0.3)'
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
        transform: [{translateY: 50},],
        borderRadius:100,
        alignSelf: 'center',
        paddingLeft:22,
        paddingRight:22,
        paddingTop: 12,
        paddingBottom: 12,
        justifyContent:'center',
        alignItems:'center',
    }
});
 
export default Details;