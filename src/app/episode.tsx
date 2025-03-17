import { useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import * as React from "react";
import { View } from "react-native";
import WebView from "react-native-webview";
import { Text } from "~/components/ui/text";
import {
  useEpisodeProgressMutation,
  useGetEpisodeProgress,
  useGetEpisodes,
} from "~/service/hooks/useGetSingleShow";

export default function Screen() {
  const item = useLocalSearchParams();

  const episodeQuery = useGetEpisodes(item.id as string, item.slug as string);
  const selectedEpisode = episodeQuery.data?.find((i) => i.iframe);
  const iframeUrl = selectedEpisode?.iframe;
  const data = useGetEpisodeProgress(
    item.id as string,
    episodeQuery.data?.find((i) => i.iframe)?.episodeNumber as string
  );
  const progressMutation = useEpisodeProgressMutation();
  React.useEffect(() => {
    if (!selectedEpisode) return;
    if (!item) return;
    progressMutation.mutate({
      episodeRefId: selectedEpisode.episodeNumber,
      progress: 0,
      progressPercentage: 0,
      refShowId: item.id as string,
    });
  }, [item?.id, selectedEpisode?.episodeNumber]);
  console.log("kkkkkkkkkkkkkkkiframeUrl", iframeUrl);
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
        if(player.getState() == "playing" ){
          player.seek(${data?.progress?.progress || 0})

        break;
        }
      }
      while(true){
        await sleep(1000);
        const player = window.jwplayer();
        if(player.getState() == "playing" ){
        
        window.ReactNativeWebView.postMessage(JSON.stringify({
          progress:player.getPosition()/player.getDuration(),
          progressInSec:player.getPosition()
          }));
          
          }
      }
      while(true){
        await sleep(300);
        document.querySelector('.ad-placement')?.remove()
        document.querySelector('a')?.remove()

      }
    }catch(e){
      alert(e.message)
    }

})();


;

  `;

  if (!iframeUrl || episodeQuery.isPending)
    return (
      <View className="flex-1 items-center justify-center h-screen w-screen">
        <Text>Loading....</Text>
      </View>
    );
  return (
    <WebView
      source={{ uri: iframeUrl }}
      incognito={true}
      injectedJavaScript={js}
      domStorageEnabled={false}

      onMessage={(e) => {
        const data = JSON.parse(e.nativeEvent.data);
        if (data) {
          console.log(data.progressInSec);
          progressMutation.mutate({
            episodeRefId: selectedEpisode.episodeNumber,
            progress: data.progressInSec,
            progressPercentage: data.progress,
            refShowId: item.id as string,
          });
        }
      }}
      userAgent="Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0"
    />
  );
}
