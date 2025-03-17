import { useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from 'expo-status-bar';
import * as React from "react";
import { View } from "react-native";
import WebView from "react-native-webview";
import { Text } from "~/components/ui/text";
import {
  useEpisodeProgressMutation,
  useGetEpisodes
} from "~/service/hooks/useGetSingleShow";

export default function Screen() {
  const item = useLocalSearchParams();

  const episodeQuery = useGetEpisodes(item.id as string, item.slug as string);
  const selectedEpisode = episodeQuery.data?.find((i) => i.iframe);
  const iframeUrl = selectedEpisode?.iframe;
  const progress = selectedEpisode?.progress
  const progressMutation = useEpisodeProgressMutation();

  React.useEffect(() => {
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch (error) {
        console.error("Failed to lock orientation", error);
      }
    };
    lockOrientation();

    return () => {
      const unlockOrientation = async () => {
        try {
          await ScreenOrientation.unlockAsync();
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT
          );
        } catch (error) {
          console.error("Failed to unlock orientation", error);
        }
      };
      unlockOrientation();
    };
  }, []);
  
  const js = `


   const sleep  = (ms) => new Promise(r => setTimeout(r,ms || 100));
  (async function() {
  try{
     
    
      while(true){
        await sleep(300);
        const player = window.jwplayer();
        if(player && player.setMute){
          player.setMute(false);
          break;
        }
      }

      const player = window.jwplayer();
      while(true){
        await sleep(300);
         const player = window.jwplayer();
        if(player){
        
          player.seek(${progress?.progress || 0})

        break;
        }
        document.querySelector('.ad-placement')?.remove()
        document.querySelector('a')?.remove()
      }

      while(true){
        await sleep(1000);
        const player = window.jwplayer();
         document.querySelector('.ad-placement')?.remove()
        document.querySelector('a')?.remove()
        if(player.getState() == "playing" ){
        
        window.ReactNativeWebView.postMessage(JSON.stringify({
          progress:player.getPosition()/player.getDuration(),
          progressInSec:player.getPosition()
          }));
          
          }
      
      }

          
    }catch(e){
      alert(e.message)
    }

})();


;

  `;

  if (!iframeUrl || episodeQuery.isPending || !progress)
    return (
      <View className="flex-1 items-center justify-center h-screen w-screen bg-secondary">
        <Text>Loading....</Text>
      </View>
    );
  
  return (
    <>
    <StatusBar hidden={true}/>
    <WebView
      source={{ uri: iframeUrl }}
      style={{ width: "100%", height: "100%" }}
      incognito={true}
      injectedJavaScript={js}
      domStorageEnabled={false}

      onMessage={(e) => {
        const data = JSON.parse(e.nativeEvent.data);
        if (data.progress > 0) {
          
          progressMutation.mutate({
            episodeRefId: selectedEpisode.episodeNumber,
            progress: data.progressInSec,
            progressPercentage: data.progress,
            refShowId: item.id as string,
          });
        }
      }}
      userAgent="Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36"
    />
    </>
  );
}
