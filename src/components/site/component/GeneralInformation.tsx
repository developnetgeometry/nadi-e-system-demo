import { Map, Clock, Users, Mail, MapPin, Calendar, AreaChart, Workflow, Globe } from "lucide-react";

const GeneralInformation = ({ site }: { site: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Site ID */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Map className="h-4 w-4 mr-1 text-gray-500" /> Site ID:
        </p>
        <p className="text-base font-medium">{site.id || "Not specified"}</p>
      </div>

      {/* Region */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <AreaChart className="h-4 w-4 mr-1 text-gray-500" /> Region:
        </p>
        <p className="text-base font-medium">{site.region_id?.eng || "Not specified"}</p>
      </div>

      {/* Phase */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Workflow className="h-4 w-4 mr-1 text-gray-500" /> Phase:
        </p>
        <p className="text-base font-medium">{site.phase_id?.name || "Not specified"}</p>
      </div>

      {/* State */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Map className="h-4 w-4 mr-1 text-gray-500" /> State:
        </p>
        <p className="text-base font-medium">{site.state_id?.name || "Not specified"}</p>
      </div>

      {/* Parliament */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Users className="h-4 w-4 mr-1 text-gray-500" /> Parliament:
        </p>
        <p className="text-base font-medium">{site.parliament_rfid?.fullname || "Not specified"}</p>
      </div>

      {/* DUN */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Users className="h-4 w-4 mr-1 text-gray-500" /> DUN:
        </p>
        <p className="text-base font-medium">{site.dun_rfid?.full_name || "Not specified"}</p>
      </div>

      {/* Mukim */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-gray-500" /> Mukim:
        </p>
        <p className="text-base font-medium">{site.mukim_id?.name || "Not specified"}</p>
      </div>

      {/* Active Status */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Clock className="h-4 w-4 mr-1 text-gray-500" /> Active Status:
        </p>
        <p className="text-base font-medium">{site.active_status?.eng || "Not specified"}</p>
      </div>

      {/* Latitude and Longitude */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-gray-500" /> Coordinates:
        </p>
        <p className="text-base font-medium">
          {site.latitude && site.longitude
            ? `${site.latitude}, ${site.longitude}`
            : "Not specified"}
        </p>
      </div>

      {/* Email */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Mail className="h-4 w-4 mr-1 text-gray-500" /> Email:
        </p>
        <p className="text-base font-medium">{site.email || "Not specified"}</p>
      </div>

      {/* Website */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Globe className="h-4 w-4 mr-1 text-gray-500" /> Website:
        </p>
        <p
          className="text-base font-medium truncate hover:overflow-visible hover:whitespace-normal"
          title={site.website || "Not specified"}
        >
          {site.website || "Not specified"}
        </p>
      </div>

      {/* Operate Date */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-gray-500" /> Operate Date:
        </p>
        <p className="text-base font-medium">
          {site.operate_date
            ? new Date(site.operate_date).toLocaleDateString()
            : "Not specified"}
        </p>
      </div>

      {/* Area */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <AreaChart className="h-4 w-4 mr-1 text-gray-500" /> Area:
        </p>
        <p className="text-base font-medium">{site.area_id?.name || "Not specified"}</p>
      </div>

      {/* Remark */}
      <div className="col-span-3">
        <p className="text-sm text-gray-500 flex items-center mb-2">
          <Workflow className="h-4 w-4 mr-1 text-gray-500" /> Remark:
        </p>
        <p className="text-base font-medium">{site.remark || "No description provided."}</p>
      </div>
    </div>
  );
};

export default GeneralInformation;