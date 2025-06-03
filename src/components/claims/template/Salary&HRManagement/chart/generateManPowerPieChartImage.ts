import React from "react";
import * as ReactDOMClient from "react-dom/client";
import html2canvas from "html2canvas";
import ManPowerPieChart from "./ManPowerPieChart";

/**
 * Generate a chart image (base64 PNG) from manpower data for PDF embedding
 * @param manpower 
 * @returns Promise<string> base64 image string
 */
export async function generateManPowerPieChartImage(manpower) {
    // Prepare chart data: group by position and count as vacant
    console.log("Manpower data",manpower)
    const positionGroups = {};
    manpower.forEach(item => {
        const position = item.position || "Unknown";
        if (!positionGroups[position]) {
            positionGroups[position] = 0;
        }
        positionGroups[position] += 1;
    });
    const chartData = Object.entries(positionGroups).map(([position, count], index) => ({
        position,
        vacant: count,
        color: ["#4285F4", "#EA4335", "#FBBC05", "#34A853", "#FF6D01", "#46BDC6"][index % 6]
    }));

    // Create a container div offscreen
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    // Render the chart into the container using React 18+ API
    const root = ReactDOMClient.createRoot(container);
    root.render(React.createElement(ManPowerPieChart, { data: chartData, width: 650, height: 380 }));

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
export default generateManPowerPieChartImage;