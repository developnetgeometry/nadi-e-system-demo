import { useQuery } from "@tanstack/react-query";
import { useSiteId } from "@/hooks/use-site-id";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { bookingClient } from "./booking-client";

export const useBookingQueries = () => {
    const userMetadata = useUserMetadata();
    const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
    const organizationId =
        parsedMetadata?.user_type !== "super_admin" &&
        parsedMetadata?.user_group_name === "TP" &&
        parsedMetadata?.organization_id
        ? parsedMetadata.organization_id
        : null;

    const useBookingQuery = (siteId: number) =>
        useQuery({
            queryKey: ["booking", organizationId, siteId],
            queryFn: () => bookingClient.getBooking(),
            enabled:
                !!siteId
        });

    const useBookingAssetBrandQuery = () =>
        useQuery({
            queryKey: ["brand"],
            queryFn: () => bookingClient.getBrands()
        })

    const useTpsSites = (dusp_tp_id: string | null) => 
        useQuery({
            queryKey: ["tpsSites", dusp_tp_id],
            queryFn: () => bookingClient.getAllTpsSites(dusp_tp_id),
            enabled: !!dusp_tp_id
        })

    const useBookingAssetInTpsSites = (tps_site_ids: number[]) => 
        useQuery({
            queryKey: ["bookingInTpsSites", tps_site_ids],
            queryFn: () => bookingClient.getAllPcBoookingInTpsSites(tps_site_ids),
            enabled: tps_site_ids.length > 0
        })

    const useAllBookings = (isSuperAdmin: boolean) =>
        useQuery({
            queryKey: ["allBookings"],
            queryFn: () => bookingClient.getAllBookings(isSuperAdmin),
            enabled: isSuperAdmin
        })

    const useAllSpaces = (isSuperAdmin: boolean) =>
        useQuery({
            queryKey: ["allSPaces"],
            queryFn: () => bookingClient.getAllSpaces(isSuperAdmin),
            enabled: isSuperAdmin
        })

    const useSitesSpaces = (siteId: number) =>
        useQuery({
            queryKey: ["sitesSpaces", siteId],
            queryFn: () => bookingClient.getSitesSpaces(siteId),
            enabled: !!siteId
        })

    const useAllSpacesBookings = (isSuperAdmin: boolean) =>
        useQuery({
            queryKey: ["allSpacesBookings"],
            queryFn: () => bookingClient.getAllSpaceBookings(isSuperAdmin),
            enabled: isSuperAdmin
        })

    const usesitesSpacesBookings = (siteId: number) =>
        useQuery({
            queryKey: ["sitesSpaceBookings", siteId],
            queryFn: () => bookingClient.getSitesSpaceBookings(siteId),
            enabled: !!siteId
        })

    const useBookingSpacesInTpsSites = (siteIds: number[]) =>
        useQuery({
            queryKey: ["BookingSpaceInTpsSites", siteIds],
            queryFn: () => bookingClient.getAllPcBoookingInTpsSites(siteIds),
            enabled: siteIds.length > 0
        })

    const useSpacesBySite = (site_id: number) =>
        useQuery({
            queryKey: ["sitesSpaces", site_id],
            queryFn: () => bookingClient.getSitesSpaces(site_id),
            enabled: !!site_id
        })

    return {
        useBookingQuery,
        useBookingAssetBrandQuery,
        useTpsSites,
        useBookingAssetInTpsSites,
        useAllBookings,
        useAllSpaces,
        useSitesSpaces,
        useAllSpacesBookings,
        usesitesSpacesBookings,
        useBookingSpacesInTpsSites,
        useSpacesBySite
    };
};
