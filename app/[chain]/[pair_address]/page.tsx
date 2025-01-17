"use client";

import CopyAddress from "@/components/copy-address";
import { Badge } from "@/components/ui/badge";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useMetadata, useMetrics } from "@/hooks/useApi";
import { analyzePoolRisk } from "@/lib/risk-analyzer";
import { formatCurrency } from "@/lib/utils";
import type { ResponsePoolMetrics } from "@/types";
import { Bolt, ChartPie, WavesLadder } from "lucide-react";
import type React from "react";
import { useMemo } from "react";
import {
	Label,
	PolarGrid,
	PolarRadiusAxis,
	RadialBar,
	RadialBarChart,
} from "recharts";

interface PageProps {
	params: {
		chain: string;
		pair_address: string;
	};
}

const getScoreColor = (score: number) => {
	if (score >= 80) return "hsl(var(--chart-5))";
	if (score >= 60) return "hsl(var(--chart-4))";
	if (score >= 40) return "hsl(var(--chart-3))";
	if (score >= 20) return "hsl(var(--chart-2))";
	return "hsl(var(--chart-5))";
};

interface IPropsPoolMetadata {
	chain: string;
	pair_address: string;
}

const PoolMetadata: React.FC<IPropsPoolMetadata> = ({
	chain,
	pair_address,
}) => {
	const { data: metaData } = useMetadata({
		blockchain: chain,
		pair_address: pair_address,
		limit: 1,
		page: 0,
	});

	const metadata = useMemo(() => metaData?.data?.[0], [metaData]);
	const poolName = useMemo(
		() =>
			`${metadata?.token0_symbol ?? ""} - ${metadata?.token1_symbol ?? ""} `,
		[metadata],
	);
	return (
		<div className="border rounded-lg">
			<div className="border-b p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
				<div className="flex items-center gap-2">
					<WavesLadder size={16} />
					<div>Pool Metadata</div>
				</div>
			</div>
			<div className="p-4">
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<div className="text-muted-foreground">Network</div>
						<div className="uppercase">{chain}</div>
					</div>
					<div className="flex items-center justify-between">
						<div className="text-muted-foreground">Pool Name</div>
						<div>{poolName}</div>
					</div>
					<div className="flex items-center justify-between">
						<div className="text-muted-foreground">Pair Address</div>
						<div>
							<CopyAddress text={metadata?.pair_address ?? ""} />
						</div>
					</div>
					<div className="flex items-center justify-between">
						<div className="text-muted-foreground">Token0 Address</div>
						<div>
							<CopyAddress text={metadata?.token0 ?? ""} />
						</div>
					</div>
					<div className="flex items-center justify-between">
						<div className="text-muted-foreground">Token1 Address</div>
						<div>
							<CopyAddress text={metadata?.token1 ?? ""} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const PoolStats: React.FC<{ data: ResponsePoolMetrics | undefined }> = ({
	data,
}) => {
	return (
		<div className="border rounded-lg">
			<div className="border-b p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
				<div className="flex items-center gap-2">
					<ChartPie size={16} />
					<div>Pool Stats</div>
				</div>
			</div>
			<div className="p-4">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<div className="text-muted-foreground">TVL</div>
						<div className="text-xl font-semibold">
							{formatCurrency(data?.total_tvl ?? 0)}
						</div>
					</div>
					<div>
						<div className="text-muted-foreground">Volume All</div>
						<div className="text-xl font-semibold">
							{formatCurrency(data?.volume_all ?? 0)}
						</div>
					</div>
					<div>
						<div className="text-muted-foreground">Volume 24h</div>
						<div className="text-xl font-semibold">
							{formatCurrency(data?.volume_24hrs ?? 0)}
						</div>
					</div>
					<div>
						<div className="text-muted-foreground">Transaction 24h</div>
						<div className="text-xl font-semibold">
							{formatCurrency(data?.transactions_24hrs ?? 0, false)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function PairPage({ params }: PageProps) {
	const { chain, pair_address } = params;

	const { data, isLoading, error } = useMetrics({
		blockchain: chain,
		pair_address: pair_address,
		limit: 1,
		page: 0,
	});

	const metrics = useMemo(() => data?.data?.[0], [data]);

	const analyzeRisk = useMemo(
		() => (metrics ? analyzePoolRisk(metrics) : null),
		[metrics],
	);

	if (error) {
		return (
			<div className="container mx-auto py-8">
				<div className="text-red-500">
					Error: Unable to fetch data. Please try again later.
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="container mx-auto py-8">
				<div className="text-gray-500">Loading data, please wait...</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<div className="space-y-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<PoolMetadata chain={chain} pair_address={pair_address} />
					<PoolStats data={metrics} />
				</div>
				<div className="border rounded-lg">
					<div className="border-b p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
						<div className="flex items-center gap-2 mb-2 sm:mb-0">
							<Bolt size={16} />
							<div>Risk Score</div>
						</div>
						<Badge variant="outline">
							A higher score indicates a higher level of risk associated with
							the pool
						</Badge>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
						<RadialChart
							score={analyzeRisk?.risk_score ?? 0}
							label="Risk Score"
							title="Overall Risk Score"
							description="Risk score for the selected pool."
						/>
						<RadialChart
							score={analyzeRisk?.component_scores?.activity_score ?? 0}
							label="Activity Score"
							title="Activity Score"
							description="Activity score for the selected pool."
						/>
						<RadialChart
							score={analyzeRisk?.component_scores?.balance_score ?? 0}
							label="Balance Score"
							title="Balance Score"
							description="Balance score for the selected pool."
						/>
						<RadialChart
							score={analyzeRisk?.component_scores?.price_stability_score ?? 0}
							label="Price Stability Score"
							title="Price Stability Score"
							description="Price score for the selected pool."
						/>
						<RadialChart
							score={analyzeRisk?.component_scores?.tvl_score ?? 0}
							label="TVL Score"
							title="TVL Score"
							description="TVL score for the selected pool."
						/>
						<RadialChart
							score={analyzeRisk?.component_scores?.volume_score ?? 0}
							label="Volume Score"
							title="Volume Score"
							description="Volume score for the selected pool."
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

interface IRadialChartProps {
	score: number;
	label: string;
	title: string;
	description: string;
}

const RadialChart: React.FC<IRadialChartProps> = ({
	score,
	label,
	title,
	description,
}) => {
	const chartData = [
		{
			browser: "score",
			risk_score: score,
			fill: "var(--color-score)",
		},
	];

	const chartConfig = {
		risk_score: {
			label: "Risk Score",
		},
		score: {
			label: "Risk Score",
			color: getScoreColor(score),
		},
	} satisfies ChartConfig;
	return (
		<div className="text-center">
			<div>
				<div className="text-lg font-semibold">{title}</div>
				<div className="text-muted-foreground text-sm">{description}</div>
			</div>
			<ChartContainer
				config={chartConfig}
				className="mx-auto aspect-square max-h-[250px]"
			>
				<RadialBarChart
					data={chartData}
					startAngle={0}
					endAngle={score * 3.6}
					innerRadius={80}
					outerRadius={110}
				>
					<PolarGrid
						gridType="circle"
						radialLines={false}
						stroke="none"
						className="first:fill-muted last:fill-background"
						polarRadius={[86, 74]}
					/>
					<RadialBar dataKey="risk_score" background cornerRadius={10} />
					<PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
						<Label
							content={({ viewBox }) => {
								if (viewBox && "cx" in viewBox && "cy" in viewBox) {
									return (
										<text
											x={viewBox.cx}
											y={viewBox.cy}
											textAnchor="middle"
											dominantBaseline="middle"
										>
											<tspan
												x={viewBox.cx}
												y={viewBox.cy}
												className="fill-foreground text-4xl font-bold"
											>
												{chartData[0].risk_score.toLocaleString()}
											</tspan>
											<tspan
												x={viewBox.cx}
												y={(viewBox.cy || 0) + 24}
												className="fill-muted-foreground"
											>
												{label}
											</tspan>
										</text>
									);
								}
							}}
						/>
					</PolarRadiusAxis>
				</RadialBarChart>
			</ChartContainer>
		</div>
	);
};
