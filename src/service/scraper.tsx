import React from "react";
import { View } from "react-native";
import RootSiblings from "react-native-root-siblings";
import { WebView } from "react-native-webview";

export function scrapeUrl<T>(url: string, injectedJS: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const sibling: RootSiblings | null = new RootSiblings(
      (
        <View style={{ height: 0, width: 0, opacity: 0 }}>
          <WebView
            source={{ uri: url }}
            userAgent="Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36"
            injectedJavaScript={`function log(...args) {window.ReactNativeWebView.postMessage(JSON.stringify({type:"log",data:args}));}; async function mainFunction(){  async function getData() { ${injectedJS} } ;  window.ReactNativeWebView.postMessage(JSON.stringify({type:"data",data:await getData()}));};mainFunction();`}
            onMessage={(event) => {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === "log") {
                console.log("[webview]:", ...data.data);
              } else {
                resolve(data.data);
                sibling?.destroy();
              }
            }}
            onError={(e) => {
              reject(e.nativeEvent);
              sibling?.destroy();
            }}
          />
        </View>
      )
    );
  });
}
