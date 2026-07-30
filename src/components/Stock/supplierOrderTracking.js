export const isSentToSupplier = (status) =>
    ['SEND_TO_SUPPLIER', 'SENT_TO_SUPPLIER'].includes(String(status || '').toUpperCase());

export const formatSupplierSentTracking = (value) => {
    if (!value) return '';

    const sentDate = new Date(String(value).replace(' ', 'T'));
    if (Number.isNaN(sentDate.getTime())) return '';

    const today = new Date();
    const sentDay = new Date(sentDate.getFullYear(), sentDate.getMonth(), sentDate.getDate());
    const currentDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const daysAgo = Math.max(0, Math.floor((currentDay - sentDay) / 86400000));
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(sentDate);
    const elapsed = daysAgo === 0
        ? 'Today'
        : `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;

    return `Sent ${formattedDate} · ${elapsed}`;
};
