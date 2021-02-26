import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, StatusBar, Image } from 'react-native'
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';

//utilities
import { colors, images, width } from '../utility/utilities'

export default class BarcodeScanner extends Component {
    state = {
        flash: 'off',
        zoom: 0,
        autoFocus: 'on',
        depth: 0,
        type: 'back',
        whiteBalance: 'auto',
        ratio: '16:9',
        canDetectBarcode: false,
    }

    barcodeRecognized = ({ barcodes }) => {
        console.log("barcode------------>", barcodes[0]);
        if (barcodes.length != 0) {
            this.setState({ canDetectBarcode: false });
            this.props.navigation.navigate('BarcodeItemList', { barcodeData: barcodes[0] });
        }
    }

    onPressScan = () => {
        this.setState({
            canDetectBarcode: true
        })
    }

    renderCamera() {
        const { canDetectBarcode } = this.state;
        return (
            <RNCamera
                ref={ref => {
                    this.camera = ref;
                }}
                style={{
                    flex: 1,
                }}
                type={this.state.type}
                flashMode={this.state.flash}
                autoFocus={this.state.autoFocus}
                zoom={this.state.zoom}
                whiteBalance={this.state.whiteBalance}
                ratio={this.state.ratio}
                focusDepth={this.state.depth}
                trackingEnabled
                captureAudio={false}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
                onGoogleVisionBarcodesDetected={canDetectBarcode ? this.barcodeRecognized : null}
                googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.ALL}
                googleVisionBarcodeMode={
                    RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeMode.ALTERNATE
                }
            >
                <View style={styles.__innerContainer}>
                    <View style={styles.__itemListView}>
                        <TouchableOpacity
                            onPress={() => { this.props.navigation.navigate('BarcodeItemList', { barcodeData: null }) }}
                            style={styles.__buttonTopView}>
                            <Text style={styles.__buttonTopText}>
                                Item List
                        </Text>
                            <Icon name={"ios-arrow-forward"} size={18} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.__frameContent}>
                        <Image source={images.cameraFrame} style={styles.__cameraFrame} />
                    </View>
                    <TouchableOpacity onPress={this.onPressScan} style={styles.__buttonView}>
                        <Text style={styles.__buttonText}>
                            Scan
                        </Text>
                    </TouchableOpacity>
                </View>
            </RNCamera>
        );

    }

    render() {
        return (
            <View style={styles.__container}>
                <StatusBar hidden />
                {this.renderCamera()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    __container: {
        flex: 1
    },
    __innerContainer: {
        flex: 1,
        backgroundColor: colors.transparent,
    },
    __frameContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    __cameraFrame: {
        width: width / 2 + 10,
        height: width / 2 + 10,
        resizeMode: "contain"
    },
    __buttonView: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        width: width / 2,
        backgroundColor: colors.moderateCyan,
        marginVertical: 15,
        borderRadius: 50
    },
    __buttonText: {
        fontSize: 18,
        color: colors.white,
        fontFamily: "Lato-Bold"
    },
    __itemListView: {
        marginVertical: 10,
        justifyContent: "center",
        alignItems: "flex-end",
        marginRight: 10,
    },
    __buttonTopView: {
        justifyContent: "space-around",
        alignItems: "center",
        padding: 10,
        backgroundColor: colors.slightlyDesaturatedCyan,
        marginVertical: 15,
        borderRadius: 50,
        flexDirection: "row"
    },
    __buttonTopText: {
        fontSize: 16,
        color: colors.white,
        fontFamily: "Lato-Bold",
        marginHorizontal: 5
    },
})
