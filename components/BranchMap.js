import React from 'react';

import { WebView } from 'react-native-webview';

const BranchMap = (props) => {
    return (<WebView source={{ uri: 'https://eden.bagistudio.com/map' }} />);
}

export default BranchMap;

