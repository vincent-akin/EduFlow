import type { PaginationQuery } from '../../types/index.js';

export const getPaginationOptions = (
    query: PaginationQuery
): {
    page: number;
    limit: number;
    skip: number;
    sort: Record<string, 1 | -1>;
} => {
    const page = Math.max(
        1,
        Number(query.page) || 1
    );

    const limit = Math.min(
        100,
        Math.max(1, Number(query.limit) || 10)
    );

    const skip = (page - 1) * limit;

    const sortField = query.sort ?? 'createdAt';
    const sortOrder: 1 | -1 = query.order === 'asc' ? 1 : -1;

    return {
        page,
        limit,
        skip,
        sort: {
            [sortField]: sortOrder,
        },
    };
};