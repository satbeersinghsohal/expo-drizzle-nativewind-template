import { useQuery } from "@tanstack/react-query";
import * as providers from "~/service/api";
import { useGetSession } from "./useGetSession";

export const useGetShowsByFilter = (filter: { searchQuery: string }) => {
  const session = useGetSession();
  return useQuery({
    queryKey: ["SHOW_SEARCH", filter.searchQuery],
    queryFn: () =>
      filter.searchQuery && session.selectedProvider
        ? providers[session.selectedProvider].getShowsByFilter(filter)
        : null,
    staleTime: 1000 * 60,
  });
};
