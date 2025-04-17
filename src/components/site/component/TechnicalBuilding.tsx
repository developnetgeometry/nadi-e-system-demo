import { Building, MapPin, Users, Workflow, Cpu, Wifi, Layers, Ruler, DollarSign } from "lucide-react";

const TechnicalBuilding = ({
  site,
  socioeconomics,
  space,
}: {
  site: any;
  socioeconomics: any[];
  space: any[];
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Building Type */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Building className="h-4 w-4 mr-1 text-gray-500" /> Building Type:
        </p>
        <p className="text-base font-medium">{site.building_type_id?.eng || "Not specified"}</p>
      </div>

      {/* Zone */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-gray-500" /> Zone:
        </p>
        <p className="text-base font-medium">{site.zone_id?.area || "Not specified"}</p>
      </div>

      {/* Total Population */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Users className="h-4 w-4 mr-1 text-gray-500" /> Total Population:
        </p>
        <p className="text-base font-medium">{site.total_population || "Not specified"}</p>
      </div>

      {/* Technology */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Cpu className="h-4 w-4 mr-1 text-gray-500" /> Technology:
        </p>
        <p className="text-base font-medium">{site.technology?.name || "Not specified"}</p>
      </div>

      {/* Bandwidth */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Wifi className="h-4 w-4 mr-1 text-gray-500" /> Bandwidth:
        </p>
        <p className="text-base font-medium">{site.bandwidth?.name || "Not specified"}</p>
      </div>

      {/* Level */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Layers className="h-4 w-4 mr-1 text-gray-500" /> Level:
        </p>
        <p className="text-base font-medium">{site.level_id?.eng || "Not specified"}</p>
      </div>

      {/* Building Area */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <Ruler className="h-4 w-4 mr-1 text-gray-500" /> Building Area:
        </p>
        <p className="text-base font-medium">
          {site.building_area_id ? `${site.building_area_id} sq ft` : "Not specified"}
        </p>
      </div>

      {/* Building Rental */}
      <div>
        <p className="text-sm text-gray-500 flex items-center">
          <DollarSign className="h-4 w-4 mr-1 text-gray-500" /> Building Rental:
        </p>
        <p className="text-base font-medium">
          {site.building_rental_id !== undefined ? (site.building_rental_id ? "Yes" : "No") : "Not specified"}
        </p>
      </div>

      {/* Socioeconomics */}
      <div className="col-span-3">
        <p className="text-sm text-gray-500 flex items-center">
          <Workflow className="h-4 w-4 mr-1 text-gray-500" /> Socioeconomics:
        </p>
        <ul className="list-disc pl-6">
          {socioeconomics.length > 0 ? (
            socioeconomics.map((item, index) => (
              <li key={index}>{item.eng || "Not specified"}</li>
            ))
          ) : (
            <li>No socioeconomic data available</li>
          )}
        </ul>
      </div>

      {/* Space */}
      <div className="col-span-3">
        <p className="text-sm text-gray-500 flex items-center">
          <Workflow className="h-4 w-4 mr-1 text-gray-500" /> Space:
        </p>
        <ul className="list-disc pl-6">
          {space.length > 0 ? (
            space.map((item, index) => (
              <li key={index}>{item.eng || "Not specified"}</li>
            ))
          ) : (
            <li>No space data available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TechnicalBuilding;