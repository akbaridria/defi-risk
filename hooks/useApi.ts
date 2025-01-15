import type {
	ApiResponse,
	MetadataParams,
	MetricsParams,
	ResponsePoolMetadata,
	ResponsePoolMetrics,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/utils";

export const useMetrics = ({
	page = 1,
	limit = 10,
	blockchain = "",
	pair_address = "",
}: MetricsParams = {}) => {
	return useQuery<ApiResponse<ResponsePoolMetrics[]>>({
		queryKey: ["metrics", { page, limit, blockchain, pair_address }],
		queryFn: async () => {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				...(blockchain && { blockchain }),
				...(pair_address && { pair_address }),
			});
			return api.get(`/api/pool-metrics?${params.toString()}`);
		},
	});
};

export const useMetadata = ({
	page = 1,
	limit = 10,
	blockchain = "",
	pair_address = "",
}: MetadataParams = {}) => {
	return useQuery<ApiResponse<ResponsePoolMetadata[]>>({
		queryKey: ["metadata", { page, limit, blockchain, pair_address }],
		queryFn: async () => {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				...(blockchain && { blockchain }),
				...(pair_address && { pair_address }),
			});
			return api.get(`/api/pool-metadata?${params.toString()}`);
		},
		enabled: !!pair_address,
	});
};
