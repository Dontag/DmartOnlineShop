import AsyncStorage from '@react-native-community/async-storage';

import { Dimensions, StatusBar } from 'react-native';

export { barCodeList } from './barCodeList';

export const { width, height } = Dimensions.get("window");

export const StatusBarHeight = StatusBar.currentHeight;

export { images } from './images';

export { colors } from './colors';

export const currency = '\u20B9';