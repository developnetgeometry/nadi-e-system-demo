import { Map, Clock, Users, Mail, MapPin, Calendar, AreaChart, Workflow } from "lucide-react";

const GeneralInformation = ({ site }: { site: any }) => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Map className="h-4 w-4 mr-1 text-gray-500" /> Site ID:
        </p>
        <p className="text-base font-medium">{site.id.toString()}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Clock className="h-4 w-4 mr-1 text-gray-500" /> Status:
        </p>
        <p className="text-base font-medium">{site.is_active ? "Active" : "Inactive"}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Mail className="h-4 w-4 mr-1 text-gray-500" /> Email:
        </p>
        <p className="text-base font-medium">{site.email || "Not specified"}</p>
      </div>
      {site.latitude && site.longitude && (
        <div>
          <p className="text-sm text-gray-500 flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-gray-500" /> Coordinates:
          </p>
          <p className="text-base font-medium">
            {site.latitude}, {site.longitude}
          </p>
        </div>
      )}
      {site.operate_date && (
        <div>
          <p className="text-sm text-gray-500 flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" /> Date Opened:
          </p>
          <p className="text-base font-medium">{new Date(site.operate_date).toLocaleDateString()}</p>
        </div>
      )}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <AreaChart className="h-4 w-4 mr-1 text-gray-500" /> Region:
        </p>
        <p className="text-base font-medium">{site.region_id.eng || "Not specified"}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500 flex items-center mb-2">
          <Workflow className="h-4 w-4 mr-1 text-gray-500" /> Remark:
        </p>
        <p className="text-base bg-gray-50 p-4 rounded-lg">{site.remark || "No description provided."}</p>
      </div>
    </div>
    
  );
};

export default GeneralInformation;