import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import { apiEndpoints } from '../api/endpoints';

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const response = await apiClient.get(apiEndpoints.booking.stats);
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
