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
    // Prepare chart data: group by status and sum all minor/major for each status
    const statusMap = {};
    maintenance.forEach(item => {
        const status = item.docket_status || "Unknown";
        if (!statusMap[status]) statusMap[status] = { status, minor: 0, major: 0 };
        if (item.docket_SLA?.toLowerCase() === "minor") statusMap[status].minor++;
        if (item.docket_SLA?.toLowerCase() === "major") statusMap[status].major++;
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
    root.render(React.createElement(MaintenanceStatusChart, { data: chartData, width: 650, height: 380 }));

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
