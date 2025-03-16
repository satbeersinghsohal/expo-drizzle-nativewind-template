import { getEpisodes } from "./hikari/episodes";
import { getHomePage } from "./hikari/homepage";
import { getShowsByFilter } from "./hikari/shows";
import { getSingleShowDetails } from "./hikari/singleShow";

export const HikariTv = {
  getHomePage,
  getSingleShowDetails,
  getEpisodes,
  getShowsByFilter
};
