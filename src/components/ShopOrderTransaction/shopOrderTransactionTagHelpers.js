export const getTransactionCategoryTags = (transaction) => {
    if (!transaction) return [];

    const rawTags = transaction.category_tags ?? transaction.tags ?? transaction.category_tag ?? transaction.categoryTags ?? [];
    let tags = rawTags;

    if (typeof rawTags === "string") {
        const trimmedTags = rawTags.trim();
        if (!trimmedTags) return [];

        try {
            tags = JSON.parse(trimmedTags);
        } catch (error) {
            tags = trimmedTags.split(",");
        }
    }

    if (!Array.isArray(tags)) {
        tags = [tags];
    }

    return [...new Set(tags
        .map((tag) => typeof tag === "object" && tag !== null
            ? tag.tag ?? tag.name ?? tag.category_tag ?? ""
            : tag)
        .map((tag) => String(tag ?? "").trim())
        .filter((tag) => tag && tag.toLowerCase() !== "null"))];
};
