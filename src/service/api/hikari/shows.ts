import { scrapeUrl } from "~/service/scraper";
type FilterKeys = "searchQuery" | "year" | "season";

export const getShowsByFilter = async (filters: Record<FilterKeys, string>) => {
  console.log("fetching data from", `https://watch.hikaritv.xyz/${
      filters.searchQuery ? "search" : "filter"
    }?keyword=${
      filters.searchQuery
    }&type=&country=&stats=&rate=&source=1&season=${
      filters.season
    }&aired_year=${
      filters.year
    }&aired_month=&aired_day=&sort=default&language=0&genres=`)
  return await scrapeUrl<
    {
      showId: string;
      title: string;
      image: string;
      link: string;
      rank: string;
    }[]
  >(
    `https://watch.hikaritv.xyz/${
      filters.searchQuery ? "search" : "filter"
    }?keyword=${
      filters.searchQuery
    }&type=&country=&stats=&rate=&source=1&season=${
      filters.season
    }&aired_year=${
      filters.year
    }&aired_month=&aired_day=&sort=default&language=0&genres=`,
    /*js*/ `
    function getText(el){return el?el.innerText.trim():""};
    function sleep() {
      return new Promise((r) => setTimeout(r, 1000));
    }
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
