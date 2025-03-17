import { scrapeUrl } from "~/service/scraper";

export const getEpisodes = async (showId: string, slug: string) => {
  return await scrapeUrl<
    {
      title: string;
      episodeNumber: string;
      iframe?: string;
    }[]
  >(
    `https://watch.hikaritv.xyz/watch/?uid=${showId}&eps=1&anime=${slug}`,
    /*js*/ `
    function getText(el){return el?el.innerText.trim():""};
    function sleep() {
  return new Promise((r) => setTimeout(r, 1000));
}
    async function getShowData(){
        let results = [];
        while(true){
            await sleep();
            log("wating")
            if(document.querySelector("#detail-ss-list")){
                break;
            }
        }
        await sleep();
        await sleep();

        let slides = [];
        if(document.querySelector("#episodes-load")){

            slides=  document.querySelectorAll("#episodes-content a");
        }else {
            slides = document.querySelectorAll("#episodes-content div[data-page] a");

        }
        const iframeUrl = document.querySelector("#iframe-embed iframe")?.getAttribute("src") || "";
        log("iframe", iframeUrl)


        slides.forEach(function(slide){
          let linkEl = slide;
          

          
          results.push({
            title: getText(linkEl),
            episodeNumber:  linkEl ? new URLSearchParams(linkEl.getAttribute("href").split("?")?.[1]).get("eps"):"",
            iframe: linkEl?.getAttribute("class")?.includes("active") ? iframeUrl :""
          });
        });
        return results;
      }
     
      return await getShowData()
    `
  );
};
