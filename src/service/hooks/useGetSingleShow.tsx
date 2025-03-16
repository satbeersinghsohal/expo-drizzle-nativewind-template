import { useQuery } from "@tanstack/react-query";
import * as providers from "~/service/api";
import { useGetSession } from "./useGetSession";

export const useGetSingleShowDetails = (showId?: string) => {
  const session = useGetSession();
  return useQuery({
    queryKey: ["SHOW", showId, session.selectedProvider],
    queryFn: () =>
      showId && session.selectedProvider
        ? providers[session.selectedProvider].getSingleShowDetails(showId)
        : null,
    staleTime: 1000 * 6000,
  });
};

export const useGetEpisodes = (showId?: string, slug?: string) => {
  const session = useGetSession();
  return useQuery({
    queryKey: ["EPISODE", slug, showId, session.selectedProvider],
    queryFn: () =>
      showId && slug && session.selectedProvider
        ? providers[session.selectedProvider].getEpisodes(showId, slug)
        : null,
    staleTime: 1000 * 60,
  });
};
