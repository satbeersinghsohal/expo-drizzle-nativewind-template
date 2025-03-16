import { scrapeUrl } from "~/service/scraper";

export const getShowsByFilter = async (filters: { searchQuery: string }) => {
  return await scrapeUrl<
    {
      showId: string;
      title: string;
      image: string;
      link: string;
      rank: string;
    }[]
  >(
    `https://watch.hikaritv.xyz/search?keyword=${filters.searchQuery}`,
    /*js*/ `
    function getText(el){return el?el.innerText.trim():""};
    
    function getTopShows(){
        
        let results = [];
        let slides = document.querySelectorAll(".film_list-wrap .flw-item");
        slides.forEach(function(slide){
        
          let titleEl = slide.querySelector(".film-detail .film-name a.dynamic-name");
          let linkEl = slide.querySelector(".film-poster-ahref");
          let imageEl = slide.querySelector("img");
          
          
          let rankEl = slide.querySelector(".tick.rtl .tick-item");

          if(!(imageEl ? imageEl.getAttribute("data-src") || imageEl.src : "")) return;
        
        

          results.push({
            title: getText(titleEl),
            image: imageEl ? imageEl.getAttribute("data-src") || imageEl.src : "",
            link: linkEl ? linkEl.getAttribute("href") : "",
            rank:  getText(rankEl),
            showId:  linkEl ? linkEl.getAttribute("data-id"):""
          });
        });
        return results;
      }
     
      return getTopShows()
    `
  );
};
