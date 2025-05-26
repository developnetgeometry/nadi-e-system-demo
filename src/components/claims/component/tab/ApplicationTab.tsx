import React from "react";
import useClaimCategorySimple from "../../hook/use-claim-categoy-simple";

interface ApplicationProps {
  claimData: {
    item_ids: number[];
  };
}

const Application: React.FC<ApplicationProps> = ({ claimData }) => {
  const { item_ids } = claimData;
  const { categories, error } = useClaimCategorySimple();

  if (error) {
    return <p>Error loading categories</p>;
  }

  // Filter categories to include only those with selected items
  const filteredCategories = categories
    .map((category) => ({
      ...category,
      children: category.children?.filter((item) => item_ids?.includes(item.id)),
    }))
    .filter((category) => category.children && category.children.length > 0);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Application Items</h2>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Item</th>
              <th className="border border-gray-300 px-4 py-2">Need Support Doc</th>
              <th className="border border-gray-300 px-4 py-2">Need Summary Report</th>
              <th className="border border-gray-300 px-4 py-2">Selected</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <React.Fragment key={category.id}>
                {(category?.children || []).map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {index === 0 && (
                      <td
                        className="border border-gray-300 px-4 py-2 font-semibold"
                        rowSpan={category.children?.length || 1}
                      >
                        {category.name}
                      </td>
                    )}
                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {item.need_support_doc ? "Yes" : "No"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {item.need_summary_report ? "Yes" : "No"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {item_ids?.includes(item.id) ? "✔️" : ""}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Application;