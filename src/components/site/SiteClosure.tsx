import React, { useState } from "react";

interface SiteClosureFormProps {
  siteId: string;
  siteDetails: string;
  location: string;
  onSubmit: (data: {
    siteId: string;
    reason: string;
    closureDate: string;
  }) => void;
  onClose: () => void; // Added onClose property
}

const closureCategories = [
  { value: "permanent", label: "Permanent Closure" },
  { value: "temporary", label: "Temporary Closure" },
];

const closureSubCategories = [
  { value: "maintenance", label: "Maintenance" },
  { value: "naturalDisaster", label: "Natural Disaster" },
  { value: "other", label: "Other" },
];

const closureAffectAreas = [
  { value: "zone1", label: "Zone 1" },
  { value: "zone2", label: "Zone 2" },
  { value: "zone3", label: "Zone 3" },
];

const SiteClosureForm: React.FC<SiteClosureFormProps> = ({
  siteId,
  siteDetails,
  location,
  onSubmit,
}) => {
  const [reason, setReason] = useState("");
  const [closureDate, setClosureDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ siteId, reason, closureDate });
  };

  return (
    <form onSubmit={handleSubmit} className="site-closure-form">
      <h2>Site Closure Form</h2>
      <div>
        <label htmlFor="siteId">Site ID:</label>
        <input type="text" id="siteId" value={siteId} readOnly />
      </div>
      <div>
        <label htmlFor="siteDetails">Site Details:</label>
        <input type="text" id="siteDetails" value={siteDetails} readOnly />
      </div>
      <div>
        <label htmlFor="location">Location:</label>
        <input type="text" id="location" value={location} readOnly />
      </div>
      <div>
        <label htmlFor="reason">Reason for Closure:</label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="closureDate">Closure Date:</label>
        <input
          type="date"
          id="closureDate"
          value={closureDate}
          onChange={(e) => setClosureDate(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="closureRequest"
          className="block text-sm font-medium text-gray-700"
        >
          Closure Category
        </label>
        <select
          id="closureRequest"
          name="closureRequest"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select a category</option>
          {closureCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="closureSubCategory" className="block text-sm font-medium text-gray-700">
          Closure Sub-Category
        </label>
        <select
          id="closureSubCategory"
          name="closureSubCategory"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select a sub-category</option>
          {closureSubCategories.map((subCategory) => (
            <option key={subCategory.value} value={subCategory.value}>
              {subCategory.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="closureAffectArea" className="block text-sm font-medium text-gray-700">
          Closure Affect Area
        </label>
        <select
          id="closureAffectArea"
          name="closureAffectArea"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select an affected area</option>
          {closureAffectAreas.map((area) => (
            <option key={area.value} value={area.value}>
              {area.label}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SiteClosureForm;
