import React from "react";
import { useSiteProfilesByIds } from "../../tp/hooks/use-generate-claim-report";

interface NadiSitesProps {
  claimData: {
    site_profile_ids: number[];
    phase_id?: { id?: number; name?: string } | null;
  };
}

const NadiSites: React.FC<NadiSitesProps> = ({ claimData }) => {
  const { site_profile_ids, phase_id } = claimData;
  const { siteProfiles, isLoading, error } = useSiteProfilesByIds(site_profile_ids);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <p>Error loading site profiles</p>;
  }

  return (
    <div>
            <h2 className="text-lg font-bold mb-4">Phase : <span className="font-normal"> {phase_id?.name ?? "N/A"}</span></h2>
      <h2 className="text-lg font-bold mb-4">Nadi Sites</h2>


      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Ref ID (MCMC)</th>
              <th className="border border-gray-300 px-4 py-2">Ref ID (TP)</th>
              <th className="border border-gray-300 px-4 py-2">Full Name</th>
            </tr>
          </thead>
          <tbody>
            {siteProfiles?.map((profile, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border border-gray-300 px-4 py-2">{profile.refid_mcmc}</td>
                <td className="border border-gray-300 px-4 py-2">{profile.refid_tp}</td>
                <td className="border border-gray-300 px-4 py-2">{profile.fullname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NadiSites;