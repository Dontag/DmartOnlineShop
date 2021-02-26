import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, StatusBar, Image, FlatList, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';


//utilities
import { colors, currency, images, width, barCodeList } from '../utility/utilities'

export default class BarcodeItemList extends Component {
    state = {
        itemList: [],
        totalCost: 0,
        totalCount: 0,
        loading: false
    }

    componentDidMount() {
        this.getData()
    }

    getData = async () => {
        const contentItemList = await AsyncStorage.getItem('itemList');
        let { itemList } = this.state;
        let totalCollectedCost = 0;
        let { barcodeData } = this.props.route.params;
        if (barcodeData != null) {
            if (contentItemList) {
                this.setState({ loading: true });
                let parsedList = JSON.parse(contentItemList);
                let itemObj = barCodeList.filter((item) => item.barcode === barcodeData.data);
                console.log("itemObj if async----", itemObj)
                if (itemObj.length != 0) {
                    Promise.all(itemObj).then(async () => {
                        let data = [
                            ...itemObj,
                            ...parsedList
                        ]
                        console.log("data if async----", data)
                        data.map((item, index) => {
                            totalCollectedCost = item.cost + totalCollectedCost;
                            this.setState({ totalCost: totalCollectedCost })
                        })
                        this.setState({ itemList: data, totalCount: data.length, loading: false })
                        await AsyncStorage.setItem('itemList', JSON.stringify(data))
                    })
                }
                else {
                    let newItemObj = {
                        name: `Item ${barcodeData.data}`,
                        quantity: 1,
                        cost: Math.floor(Math.random() * (1500 - 100)) + 100,
                        barcode: barcodeData.data
                    }
                    let data = [
                        newItemObj,
                        ...parsedList
                    ]
                    console.log("data Rand----", data)
                    data.map((item, index) => {
                        totalCollectedCost = item.cost + totalCollectedCost;
                        this.setState({ totalCost: totalCollectedCost })
                    })
                    this.setState({ itemList: data, totalCount: data.length, loading: false })

                    await AsyncStorage.setItem('itemList', JSON.stringify(data))
                }
            } else {
                this.setState({ loading: true });
                let itemObj = barCodeList.filter((item) => item.barcode === barcodeData.data);
                console.log("itemObj----", itemObj)
                if (itemObj.length != 0) {
                    Promise.all(itemObj).then(async () => {
                        let data = [
                            ...itemObj,
                            ...itemList
                        ];
                        console.log("data----", data)
                        data.map((item, index) => {
                            totalCollectedCost = item.cost + totalCollectedCost;
                            this.setState({ totalCost: totalCollectedCost })
                        })
                        this.setState({ itemList: data, totalCount: data.length, loading: false })
                        await AsyncStorage.setItem('itemList', JSON.stringify(data))
                    })
                } else {
                    let newItemObj = {
                        name: `Item ${barcodeData.data}`,
                        quantity: 1,
                        cost: Math.floor(Math.random() * (1500 - 100)) + 100,
                        barcode: barcodeData.data
                    }
                    let data = [
                        newItemObj,
                        ...itemList
                    ]
                    console.log("data Rand----", data)
                    data.map((item, index) => {
                        totalCollectedCost = item.cost + totalCollectedCost;
                        this.setState({ totalCost: totalCollectedCost })
                    })
                    this.setState({ itemList: data, totalCount: data.length, loading: false })

                    await AsyncStorage.setItem('itemList', JSON.stringify(data))
                }

            }
        } else {
            if (contentItemList) {
                this.setState({ loading: true });
                let parsedList = JSON.parse(contentItemList);
                parsedList.map((item, index) => {
                    totalCollectedCost = item.cost + totalCollectedCost;
                    this.setState({ totalCost: totalCollectedCost })
                })
                this.setState({ itemList: parsedList, totalCount: parsedList.length, loading: false })
            } else {
                this.setState({ loading: false })
            }
        }
    }

    onDelete = async () => {
        await AsyncStorage.removeItem('itemList');
        await this.props.navigation.setParams({ barcodeData: null })
        this.setState({ itemList: [], totalCost: 0, totalCount: 0 });
    }

    renderItem = ({ item, index }) => {
        return (
            <View key={index} style={styles.__cardContainer}>
                <Text style={styles.__itemName}>
                    {item.name}
                </Text>
                <View style={styles.__cardBottom}>
                    <View style={styles.__cardBottomLeft}>
                        <Text style={styles.__itemQuantityHeader}>
                            Quantity:
                        </Text>
                        <Text style={styles.__itemQuantity}>
                            {item.quantity}
                        </Text>
                    </View>
                    <Text style={styles.__itemCost}>
                        {currency}{item.cost}
                    </Text>
                </View>
            </View>
        );
    }
    keyExtractor = (_, index) => String(index);

    render() {
        let { itemList, totalCost, totalCount, loading } = this.state;
        if (loading) {
            return (
                <View style={[styles.__container, { justifyContent: "center", alignItems: "center" }]}>
                    <StatusBar hidden={false} backgroundColor={colors.moderateBlue} barStyle={"light-content"} />
                    <ActivityIndicator size={"large"} color={colors.moderateBlue} />
                </View>
            );
        }
        return (
            <View style={styles.__container}>
                <StatusBar hidden={false} backgroundColor={colors.moderateBlue} barStyle={"light-content"} />
                <View style={styles.__topContent}>
                    <View style={styles.__topContentView}>
                        <Text style={styles.__topHeader}>TOTAL ITEMS</Text>
                        <Text style={styles.__topData}>{totalCount}</Text>
                    </View>
                    <View style={styles.__topContentView}>
                        <Text style={styles.__topHeader}>TOTAL COST</Text>
                        <Text style={styles.__topData}>{currency} {totalCost}</Text>
                    </View>
                </View>
                <View style={styles.__listHeader}>
                    <Text style={styles.__listHeaderTitle}>
                        Items
                    </Text>
                    <Icon name={"ios-trash"} onPress={() => { this.onDelete() }} style={{ paddingHorizontal: 5, paddingVertical: 3 }} size={20} color={colors.slightSoftRed} />
                </View>
                { itemList.length != 0 ? < FlatList
                    data={itemList}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                /> :
                    <View style={[styles.__container, { justifyContent: "center", alignItems: "center" }]}>
                        <Text style={styles.__noContentText}>
                            No Item Added
                        </Text>
                    </View>}
                <TouchableOpacity onPress={() => { this.props.navigation.goBack() }} style={styles.__buttonBottomView}>
                    <Text style={styles.__buttonBottomText}>
                        Add New Items
                        </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    __container: {
        flex: 1,
        // backgroundColor: colors.white
    },
    __topContent: {
        backgroundColor: colors.white,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    __topContentView: {
        marginVertical: 15,
        backgroundColor: colors.moderateCyan,
        width: width / 2 - 20,
        height: 100,
        borderRadius: 20,
        elevation: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    __topHeader: {
        fontSize: 20,
        color: colors.white,
        marginVertical: 5,
        fontFamily: "Lato-Regular"
    },
    __topData: {
        marginVertical: 5,
        fontSize: 22,
        color: colors.white,
        fontFamily: "Lato-Bold"
    },
    __listHeader: {
        padding: 5,
        paddingHorizontal: 10,
        backgroundColor: `${colors.moderateCyan}30`,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    __listHeaderTitle: {
        fontSize: 16,
        color: colors.veryDarkDesaturatedBlue,
        fontFamily: "Lato-Regular"
    },
    __cardContainer: {
        marginVertical: 8,
        width: width - 15,
        borderRadius: 20,
        backgroundColor: colors.white,
        elevation: 3,
        alignSelf: "center"
    },
    __itemName: {
        marginVertical: 10,
        flex: 1,
        paddingHorizontal: 15,
        fontSize: 18,
        color: colors.veryDarkDesaturatedBlue,
        fontFamily: "Lato-Bold",

    },
    __cardBottom: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        marginVertical: 10
    },
    __cardBottomLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    __itemQuantityHeader: {
        paddingLeft: 15,
        fontSize: 16,
        color: colors.moderateBlue,
        fontFamily: "Lato-Regular",
    },
    __itemQuantity: {
        paddingLeft: 10,
        fontSize: 16,
        color: colors.veryDarkDesaturatedBlue,
        fontFamily: "Lato-Bold",
    },
    __itemCost: {
        paddingRight: 25,
        fontSize: 16,
        color: colors.limeGreen,
        fontFamily: "Lato-Bold",
    },
    __buttonBottomView: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12,
        width: width / 2,
        backgroundColor: colors.slightlyDesaturatedCyan,
        marginVertical: 15,
        borderRadius: 50
    },
    __buttonBottomText: {
        fontSize: 16,
        color: colors.white,
        fontFamily: "Lato-Bold"
    },
    __noContentText: {
        fontSize: 20,
        color: colors.slightlyDesaturatedCyan,
        fontFamily: "Lato-Bold"
    }
})
