import { scrapeUrl } from "~/service/scraper";

export const getSingleShowDetails = async (showId: string) => {
  return await scrapeUrl<{
    showId: string;
    title: string;
    image: string;
    date: string;
    description: string;
    seasons: {
      title: string;
      link: string;
    }[];
    score: string;
    status: string;
    duration: string;
    generes: string;
    slug: string;
  }>(
    `https://watch.hikaritv.xyz/anime/${showId}`,
    `
    function getText(el){return el?el.innerText.trim():""};
    function getSeasons() {
        const items = document.querySelectorAll('#block_area-seasons .os-list');
        let seasons = [];
        items.forEach(function(slide){
            let titleEl = slide.querySelector(".title");
            let linkEl = slide.querySelector("a");
            seasons.push({
                title: getText(titleEl),
                link: linkEl ? linkEl.getAttribute("href") : ""
            })
        })
        return seasons;
    }
    function getShowGeneralData(){
        let score = 0;
        let status = '';
        let duration = '';
        let generes = '';
        let date = '';
        const items = document.querySelectorAll('.anisc-info .item-title');
        items.forEach(item => {
            const head = item.querySelector('.item-head');
            const name = item.querySelector('.name');
            if (head && name) {
                const text = getText(head);
                if (text.includes('MAL Score:')) {
                    score = parseFloat(getText(name) || '0');
                } else if (text.includes('Status:')) {
                    status = getText(name) || '';
                } else if (text.includes('Duration:')) {
                    duration = getText(name) || '';
                } else if(text.includes('Aired:')) {
                    date =  getText(name) || '';
                }
            }
        });
        const genreContainer = document.querySelector('.anisc-info .item-list');
        if (genreContainer) {
            const anchors = genreContainer.querySelectorAll('a');
            const genresArr = Array.from(anchors).map(anchor => anchor.textContent?.trim() || '');
            generes = genresArr.join(', ');
        }
        return {
            score,
            status,
            duration,
            generes,
            date
        }
    }
    function getShowData(){
    log(" ok in ");
        let titleEl = document.querySelector(".anisc-detail .film-name.dynamic-name");
        let imageEl = document.querySelector("img.film-poster-img");
        let descriptionEl = document.querySelector(".anime-description p");
        let dateEl = document.querySelector(".scd-item.m-hide");
        let status = document.querySelector(".scd-item.m-hide");
        let linkEl = document.querySelector(".film-buttons a.btn.btn-radius.btn-primary.btn-play");

        if(!(imageEl ? imageEl.getAttribute("data-src") || imageEl.src : "")) return null;
    
         return {
            title: getText(titleEl),
            image: imageEl ? imageEl.getAttribute("data-src") || imageEl.src : "",
            date: getText(dateEl),
            description: getText(descriptionEl),
            seasons:getSeasons(),
            slug: linkEl ? new URLSearchParams(linkEl.getAttribute("href").split("?")?.[1]).get("anime"):"" ,
            ...getShowGeneralData()
          }
      }
     
      return getShowData()
    `
  );
};
