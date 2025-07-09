export const formatInvoiceId = (createdAt: string) => {
    const date = new Date(createdAt);
    const timestamp = Math.floor(date.getTime() / 1000); // Unix timestamp
    return `t${timestamp}`;
};