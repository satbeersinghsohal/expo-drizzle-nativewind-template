import { scrapeUrl } from "~/service/scraper";

export const getHomePage = async () => {
  return await scrapeUrl<{
    banners: {
      showId: string;
      title: string;
      image: string;
      date: string;
      description: string;
      epLink: string;
    }[];
    recentlyAddedShows: {
      showId: string;
      title: string;
      image: string;
      epLink: string;
      latestEpisodeNumber: string;
    }[];
    currentlyAiringShows: {
      showId: string;
      title: string;
      image: string;
      epLink: string;
      latestEpisodeNumber: string;
    }[];
    topShows: {
      showId: string;
      title: string;
      image: string;
      link: string;
      rank: string;
    }[];
  }>(
    "https://watch.hikaritv.xyz/",
    /*js*/ `
    function getText(el){return el?el.innerText.trim():""};

    function getBanners(){
        let results = [];
        let slides = document.querySelectorAll("#slider .swiper-slide");
        slides.forEach(function(slide){
          let titleEl = slide.querySelector(".desi-head-title.dynamic-name");
          let imageEl = slide.querySelector(".deslide-cover-img img");
          let dateEl = slide.querySelector(".scd-item.m-hide");
          let descriptionEl = slide.querySelector(".desi-description");
          let linkEl = slide.querySelector(".desi-buttons a");
          if(!(imageEl ? imageEl.getAttribute("data-src") || imageEl.src : "")) return;
          results.push({
            title: getText(titleEl),
            image: imageEl ? imageEl.getAttribute("data-src") || imageEl.src : "",
            date: getText(dateEl),
            description: getText(descriptionEl),
            epLink: linkEl ? linkEl.getAttribute("href") : "",
            showId:  linkEl ? new URLSearchParams(linkEl.getAttribute("href")).get("uid"):""
          });
        });
        return results;
      }
      function getRecentlyAdded(){
      let results = [];
        let slides = document.querySelectorAll("#anime-trending .swiper-slide");
        slides.forEach(function(slide){
          let titleEl = slide.querySelector(".film-detail .film-name .dynamic-name");
          let imageEl = slide.querySelector(".film-poster img.film-poster-img.lazyloaded");
          let dateEl = slide.querySelector(".scd-item.m-hide");
          let linkEl = slide.querySelector("a.film-poster-ahref");
          let epEl = slide.querySelector(".film-poster div.tick.tick-eps");

          if(!(imageEl ? imageEl.getAttribute("data-src") || imageEl.src : "")) return;
          results.push({
            title: getText(titleEl),
            image: imageEl ? imageEl.getAttribute("data-src") || imageEl.src : "",
            epLink: linkEl ? linkEl.getAttribute("href") : "",
            latestEpisodeNumber:  getText(epEl),
            showId:  linkEl ? new URLSearchParams(linkEl.getAttribute("href")).get("uid"):""

          });
        });
        return results;
      }
      function getcurrentlyAiringShows(){
        let results = [];
        let container = document.querySelector("#main-wrapper .container section.block_area.block_area_home");
        let slides = container.querySelectorAll(".swiper-slide");
        
        slides.forEach(function(slide){
        

          let titleEl = slide.querySelector(".film-detail .film-name .dynamic-name");
          let imageEl = slide.querySelector("img");
          
          let linkEl = slide.querySelector("a.film-poster-ahref");
          let epEl = slide.querySelector(".film-poster div.tick.tick-eps");
        

          if(!(imageEl ? imageEl.getAttribute("data-src") || imageEl.src : "")) return;
        

          results.push({
            title: getText(titleEl),
            image: imageEl ? imageEl.getAttribute("data-src") || imageEl.src : "",
            epLink: linkEl ? linkEl.getAttribute("href") : "",
            latestEpisodeNumber:  getText(epEl),
            showId:  linkEl ? new URLSearchParams(linkEl.getAttribute("href")).get("uid"):""

          });
        });
        return results;
      }
      function getTopShows(){
        let results = [];
        let container = document.querySelector(".top10-list");
        let slides = container.querySelectorAll("li.top10-item");
        
        slides.forEach(function(slide){
        

          let titleEl = slide.querySelector("a.anime-title");
          let imageEl = slide.querySelector("img");
          
          let linkEl = slide.querySelector("a");
          let rankEl = slide.querySelector(".rank");
          
        

          if(!(imageEl ? imageEl.getAttribute("data-src") || imageEl.src : "")) return;
        

          results.push({
            title: getText(titleEl),
            image: imageEl ? imageEl.getAttribute("data-src") || imageEl.src : "",
            link: linkEl ? linkEl.getAttribute("href") : "",
            rank:  getText(rankEl),
            showId:  linkEl ? linkEl.getAttribute("href").replace("/anime/","") :""
          });
        });
        return results;
      }
      return {
        banners:getBanners(),
        recentlyAddedShows: getRecentlyAdded(),
        currentlyAiringShows: getcurrentlyAiringShows(),
        topShows: getTopShows()
      }
    `
  );
};
