import React from "react";
import * as ReactDOMClient from "react-dom/client";
import MaintenanceStatusChart from "./MaintenanceStatusChart";
import html2canvas from "html2canvas";

/**
 * Generate a chart image (base64 PNG) from maintenance data for PDF embedding
 * @param maintenance MaintenanceData[]
 * @returns Promise<string> base64 image string
 */
export async function generateMaintenanceChartImage(maintenance) {
    // Find all unique SLA types in the data (case-insensitive, but keep original for display)
    const slaSet = new Set<string>();
    maintenance.forEach(item => {
        if (item.docket_SLA) slaSet.add(item.docket_SLA);
    });
    const slaTypes = Array.from(slaSet) as string[];

    // Prepare chart data: group by status and count for each SLA type
    const statusMap = {};
    maintenance.forEach(item => {
        const status = item.docket_status || "Unknown";
        if (!statusMap[status]) {
            statusMap[status] = { status };
            slaTypes.forEach(sla => { statusMap[status][sla] = 0; });
        }
        if (item.docket_SLA && slaTypes.includes(item.docket_SLA)) {
            statusMap[status][item.docket_SLA]++;
        }
    });
    const chartData = Object.values(statusMap);
    console.log("Chart data for MaintenanceStatusChart:", chartData);

    // Create a container div offscreen
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    // Render the chart into the container using React 18+ API
    const root = ReactDOMClient.createRoot(container);
    root.render(React.createElement(MaintenanceStatusChart, { data: chartData, width: 650, height: 380, slaTypes }));

    // Wait for the chart to render
    await new Promise(resolve => setTimeout(resolve, 100));

    // Convert the chart to image using html2canvas
    const chartNode = container.firstElementChild as HTMLElement;
    const canvas = await html2canvas(chartNode, { backgroundColor: "#fff" });
    const dataUrl = canvas.toDataURL("image/png");

    // Clean up
    root.unmount();
    document.body.removeChild(container);

    return dataUrl;
}
