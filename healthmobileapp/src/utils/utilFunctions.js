export const formatDateTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("vi-VN");
};
