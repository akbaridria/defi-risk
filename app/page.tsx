"use client";

import ChainSelector from "@/components/chain-selector";
import DataTable from "@/components/data-table";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import ViewSelector from "@/components/view-selector";
import { useMetadata, useMetrics } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { analyzePoolRisk } from "@/lib/risk-analyzer";
import type { PoolData } from "@/types";
import { useMemo, useState } from "react";
import { DEFAULT_EXCLUDED_COLUMNS } from "./constant";

export default function Home() {
	const [excludeColumns, setExcludeColumns] = useState<string[]>(
		DEFAULT_EXCLUDED_COLUMNS,
	);
	const [pairAddress, setPairAddress] = useState<string>("");
	const debouncedSearch = useDebounce(pairAddress, 500);
	const [network, setNetwork] = useState<string[]>([]);

	const { data, isLoading } = useMetrics({
		page: 0,
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
				(meta) => meta?.pair_address?.toLowerCase() === metrics?.pair_address?.toLowerCase(),
			);

			const analyzeRisk = analyzePoolRisk(metrics);
			return {
				network: metadata?.blockchain || "-",
				pair_address: metadata?.pair_address || "-",
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
				total_tvl: metrics?.total_tvl ?? 0,
				risk_score: analyzeRisk.risk_score,
				risk_category: analyzeRisk.risk_category,
				warnings: analyzeRisk.warnings,
			};
		});
	}, [metaData?.data, data?.data]);

    console.log(listData, 'ini lista data');

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
					poolData={listData}
					excludeColumns={excludeColumns}
					isLoading={isLoading || isLoadingMeta}
				/>
				<div className="flex items-center justify-end">
					<div>
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious href="#" />
								</PaginationItem>
								<PaginationItem>
									<PaginationLink href="#">1</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
								<PaginationItem>
									<PaginationNext href="#" />
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				</div>
			</div>
		</div>
	);
}
