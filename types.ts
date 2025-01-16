export interface ApiResponse<T> {
	data: T;
	pagination: Pagination;
	message?: string;
}

export interface ResponsePoolMetadata {
	blockchain?: string;
	chain_id?: string;
	deployed_date?: string;
	deployer?: string;
	pair_address?: string;
	pool?: string;
	protocol?: string;
	token0?: string;
	token0_decimal?: number;
	token0_name?: string;
	token0_symbol?: string;
	token1?: string;
	token1_decimal?: number;
	token1_name?: string;
	token1_symbol?: string;
}

export interface ResponsePoolMetrics {
	blockchain?: string;
	pair_address?: string;
	protocol?: string;
	token0?: string;
	token0_price?: number;
	token0_reserve?: number;
	token0_share?: number;
	token0_tvl?: number;
	token1?: string;
	token1_price?: number;
	token1_reserve?: number;
	token1_share?: number;
	token1_tvl?: number;
	total_tvl?: number;
	transactions_24hrs?: number;
	transactions_24hrs_change?: number;
	transactions_30d?: number;
	transactions_30d_change?: number;
	transactions_7d?: number;
	transactions_7d_change?: number;
	transactions_90d?: number;
	transactions_90d_change?: number;
	transactions_all?: number;
	volume_24hrs?: number;
	volume_24hrs_change?: number | null;
	volume_30d?: number;
	volume_30d_change?: number | null;
	volume_7d?: number;
	volume_7d_change?: number | null;
	volume_90d?: number;
	volume_90d_change?: number | null;
	volume_all?: number;
}

export interface Pagination {
	has_next: boolean;
	limit: number;
	offset: number;
	total_items: number;
}

interface TokenTable {
	name: string;
	symbol: string;
}

export type PoolData = {
	network: string;
	pair_address: string;
	protocol: string;
	pool_name: string;
	token_0: TokenTable;
	token_1: TokenTable;
	token_0_share: number | null;
	token_1_share: number | null;
	token_0_tvl: number | null;
	token_1_tvl: number | null;
	token_0_price: number | null;
	token_1_price: number | null;
	token_0_reserve: number | null;
	token_1_reserve: number | null;
	token_0_address: string;
	token_1_address: string;
	total_tvl: number | null;
	risk_score: number | null;
	risk_category: string | null;
	warnings: string[];
};

export type MetricsParams = {
	page?: number;
	limit?: number;
	blockchain?: string;
	pair_address?: string;
};

export type MetadataParams = {
	page?: number;
	limit?: number;
	blockchain?: string;
	pair_address?: string;
};
