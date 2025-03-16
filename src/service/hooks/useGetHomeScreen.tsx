import { useQuery } from "@tanstack/react-query";
import * as providers from "~/service/api";
import { useGetSession } from "./useGetSession";

export const useGetHomePage = () => {
  const session = useGetSession();
  return useQuery({
    queryKey: ["HOMEPAGE", session.selectedProvider],
    queryFn: () =>
      session.selectedProvider
        ? providers[session.selectedProvider].getHomePage()
        : null,
  });
};
