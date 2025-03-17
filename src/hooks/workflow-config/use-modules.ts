
import { useState, useEffect } from "react";

export function useModules() {
  const [modules, setModules] = useState<{ id: string, name: string }[]>([]);

  // Fetch available modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        // In a real application, you would fetch from a modules table
        // For now, we'll use mock data
        setModules([
          { id: "work_orders", name: "Work Orders" },
          { id: "training", name: "Training" },
          { id: "center_management", name: "Center Management" },
          { id: "finance", name: "Finance" },
          { id: "inventory", name: "Inventory" },
        ]);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchModules();
  }, []);

  return modules;
}
