import { useState, useEffect } from "react";
import useClaimCategorySimple from "@/components/claims/hook/use-claim-categoy-simple";
import React from "react";

type ItemData = {
  id: number;
  name: string;
  need_support_doc: boolean;
  need_summary_report: boolean;
};

type CategoryData = {
  id: number;
  name: string;
  item_ids: ItemData[];
};

type ClaimData = {
  category_ids: CategoryData[];
};

type ClaimRequestFormProps = ClaimData & {
  updateFields: (fields: Partial<ClaimData>) => void;
};

export function ClaimRequestForm({
  category_ids,
  updateFields,
}: ClaimRequestFormProps) {
  const { categories, error } = useClaimCategorySimple();
  const [selectedItems, setSelectedItems] = useState<CategoryData[]>([]);

  // Initialize selectedItems from item_ids
  useEffect(() => {
    setSelectedItems(category_ids);
  }, [category_ids]);

  const handleItemChange = (
    itemId: number,
    isChecked: boolean,
    categoryId: number,
    categoryName: string,
    itemName: string,
    needSupportDoc: boolean,
    needSummaryReport: boolean
  ) => {
    // Find the category to update
    const categoryToUpdate = selectedItems.find((category) => category.id === categoryId);

    let updatedCategory;

    if (categoryToUpdate) {
      // Update the existing category
      const updatedItems = isChecked
        ? [
          ...categoryToUpdate.item_ids,
          {
            id: itemId,
            name: itemName,
            need_support_doc: needSupportDoc,
            need_summary_report: needSummaryReport,
          },
        ]
        : categoryToUpdate.item_ids.filter((item) => item.id !== itemId);

      updatedCategory = { ...categoryToUpdate, item_ids: updatedItems };
    } else {
      // Add a new category if it doesn't exist
      updatedCategory = {
        id: categoryId,
        name: categoryName,
        item_ids: isChecked
          ? [
            {
              id: itemId,
              name: itemName,
              need_support_doc: needSupportDoc,
              need_summary_report: needSummaryReport,
            },
          ]
          : [],
      };
    }

    // Update the selectedItems array
    const newSelectedItems = [
      ...selectedItems.filter((category) => category.id !== categoryId),
      updatedCategory,
    ].filter((category) => category.item_ids.length > 0); // Remove categories with no items

    setSelectedItems(newSelectedItems);

    // Update item_ids with the correct category_id and item details
    updateFields({
      category_ids: newSelectedItems,
    });
  };

  return (
    <>
      <h2 className="text-lg font-bold mb-4">Claim Request Form</h2>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Item</th>
              <th className="border border-gray-300 px-4 py-2">Need Support Doc</th>
              <th className="border border-gray-300 px-4 py-2">Need Summary Report</th>
              <th className="border border-gray-300 px-4 py-2">Select</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <React.Fragment key={category.id}>
                {(category.children || []).map((item, index) => (
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
                      <input
                        type="checkbox"
                        checked={selectedItems.some(
                          (selectedCategory) =>
                            selectedCategory.id === category.id &&
                            selectedCategory.item_ids.some((selectedItem) => selectedItem.id === item.id)
                        )}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            e.target.checked,
                            category.id,
                            category.name,
                            item.name,
                            item.need_support_doc,
                            item.need_summary_report
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Debugging: Display Selected Items */}
      {/* <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(selectedItems, null, 2)}</pre> */}
      {/* <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(categories, null, 2)}</pre> */}
    </>
  );
}