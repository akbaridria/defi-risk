"use client";

import ChainSelector from "@/components/chain-selector";
import DataTable from "@/components/data-table";
import { Input } from "@/components/ui/input";
import ViewSelector from "@/components/view-selector";
import { useMetadata, useMetrics } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { analyzePoolRisk } from "@/lib/risk-analyzer";
import type { PoolData } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_EXCLUDED_COLUMNS } from "./constant";
import PaginationWithEllipsis from "@/components/pagination";

export default function Home() {
	const [excludeColumns, setExcludeColumns] = useState<string[]>(
		DEFAULT_EXCLUDED_COLUMNS,
	);
	const [pairAddress, setPairAddress] = useState<string>("");
	const debouncedSearch = useDebounce(pairAddress, 500);
	const [network, setNetwork] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState(0);

	useEffect(() => {
		if (network || debouncedSearch) setCurrentPage(0);
	}, [network, debouncedSearch]);

	const { data, isLoading } = useMetrics({
		page: currentPage,
		limit: 10,
		pair_address: debouncedSearch,
		blockchain: network.join(","),
	});
	const { data: metaData, isLoading: isLoadingMeta } = useMetadata({
		page: 0,
		limit: 10,
		pair_address: data?.data?.map((item) => item.pair_address).join(","),
	});

	const toggleColumn = (columnName: string) => {
		setExcludeColumns((prev) => {
			if (prev.includes(columnName)) {
				return prev.filter((col) => col !== columnName);
			}
			return [...prev, columnName];
		});
	};

	const listData: PoolData[] = useMemo(() => {
		if (!data?.data || !metaData?.data) return [];

		return data.data.map((metrics) => {
			const metadata = metaData?.data.find(
				(meta) =>
					meta?.pair_address?.toLowerCase() ===
					metrics?.pair_address?.toLowerCase(),
			);

			const analyzeRisk = analyzePoolRisk(metrics);
            console.log(analyzeRisk);
			return {
				network: metrics?.blockchain || "-",
				pair_address: metrics?.pair_address || "-",
				protocol: metrics?.protocol || "-",
				pool_name: `${metadata?.token0_symbol}-${metadata?.token1_symbol}`,
				token_0: {
					name: metadata?.token0_name || "-",
					symbol: metadata?.token0_symbol || "-",
				},
				token_1: {
					name: metadata?.token1_name || "-",
					symbol: metadata?.token1_symbol || "-",
				},
				token_0_share: metrics?.token0_share ?? 0,
				token_1_share: metrics?.token1_share ?? 0,
				token_0_tvl: metrics?.token0_tvl ?? 0,
				token_1_tvl: metrics?.token1_tvl ?? 0,
				token_0_price: metrics?.token0_price ?? 0,
				token_1_price: metrics?.token1_price ?? 0,
				token_0_reserve: metrics?.token0_reserve ?? 0,
				token_1_reserve: metrics?.token1_reserve ?? 0,
				token_0_address: metrics?.token0 || "-",
				token_1_address: metrics?.token1 || "-",
				total_tvl: metrics?.total_tvl ?? 0,
				risk_score: analyzeRisk.risk_score,
				risk_category: analyzeRisk.risk_category,
				warnings: analyzeRisk.warnings,
			};
		});
	}, [metaData?.data, data?.data]);

	const pagination = data?.pagination ?? {
		has_next: false,
		limit: 10,
		offset: 0,
		total_items: 0,
	};

	const totalPages = Math.ceil(pagination.total_items / pagination.limit);

	return (
		<div className="container mx-auto py-8">
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex gap-2 items-center w-full">
						<Input
							placeholder="Search by pair address"
							className="h-8 w-full max-w-[450px]"
							value={pairAddress}
							onChange={(e) => setPairAddress(e.target.value)}
						/>
						<ChainSelector networks={network} setNetwork={setNetwork} />
					</div>
					<ViewSelector
						excludeColumns={excludeColumns}
						toggleColumn={toggleColumn}
					/>
				</div>
				<DataTable
					key={JSON.stringify(listData)}
					poolData={listData}
					excludeColumns={excludeColumns}
					isLoading={isLoading || isLoadingMeta}
				/>
				<div className="flex items-center justify-end">
					<div>
						<PaginationWithEllipsis
							currentPage={currentPage}
							onPageChange={(p) => setCurrentPage(p)}
							totalPages={totalPages}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
