"use client";

import CopyAddress from "@/components/copy-address";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import HyperText from "@/components/ui/hyper-text";
import { useMetadata, useMetrics } from "@/hooks/useApi";
import { analyzePoolRisk } from "@/lib/risk-analyzer";
import { formatCurrency } from "@/lib/utils";
import type { ResponsePoolMetrics } from "@/types";
import { Progress } from "@/components/ui/progress";
import {
	Bolt,
	BookOpenText,
	ChartPie,
	FileWarning,
	Inbox,
	Info,
	TriangleAlert,
	WavesLadder,
} from "lucide-react";
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
	if (score >= 0) return "hsl(var(--chart-1))";
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
					<div className="font-semibold">Pool Metadata</div>
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
					<div className="font-semibold">Pool Stats</div>
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

const RiskAnalysisDoc = () => {
	const riskCategories = [
		{ range: "80-100", level: "Very High Risk", color: "bg-red-500" },
		{ range: "60-79", level: "High Risk", color: "bg-orange-500" },
		{ range: "40-59", level: "Medium Risk", color: "bg-yellow-500" },
		{ range: "20-39", level: "Low Risk", color: "bg-green-500" },
		{ range: "0-19", level: "Very Low Risk", color: "bg-emerald-500" },
	];

	const componentWeights = [
		{ name: "TVL (Total Value Locked)", weight: 25 },
		{ name: "Volume", weight: 20 },
		{ name: "Transactions", weight: 15 },
		{ name: "Price Stability", weight: 15 },
		{ name: "Balance", weight: 15 },
		{ name: "Activity", weight: 10 },
	];

	const timeWeights = [
		{ period: "Last 24 hours", weight: 40 },
		{ period: "7 days", weight: 30 },
		{ period: "30 days", weight: 20 },
		{ period: "90 days", weight: 10 },
	];

	return (
		<div className="space-y-6 max-w-4xl">
			<Card>
				<CardHeader className="border-b p-5">
					<CardTitle className="flex items-center gap-2">
						<BookOpenText size={16} />
						<div>Risk Analysis Documentation</div>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div>
						<h3 className="text-lg font-semibold mb-3">Risk Categories</h3>
						<div className="space-y-2">
							{riskCategories.map(({ range, level, color }) => (
								<div key={level} className="flex items-center gap-2">
									<div className={`w-4 h-4 rounded ${color}`} />
									<span className="font-medium">{level}:</span>
									<span>Score {range}</span>
								</div>
							))}
						</div>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-3">Component Weights</h3>
						<div className="space-y-3">
							{componentWeights.map(({ name, weight }) => (
								<div key={name} className="space-y-1">
									<div className="flex justify-between">
										<span>{name}</span>
										<span className="font-medium">{weight}%</span>
									</div>
									<Progress value={weight} className="h-2" />
								</div>
							))}
						</div>
					</div>

					<Alert>
						<Info className="h-4 w-4" />
						<AlertTitle>Time-based Analysis</AlertTitle>
						<AlertDescription>
							<div className="mt-2 space-y-1">
								{timeWeights.map(({ period, weight }) => (
									<div key={period} className="flex justify-between">
										<span>{period}</span>
										<span className="font-medium">{weight}%</span>
									</div>
								))}
							</div>
						</AlertDescription>
					</Alert>

					<div className="space-y-3">
						<h3 className="text-lg font-semibold">Warning Indicators</h3>
						<ul className="list-disc pl-6 space-y-2">
							<li>Extremely low TVL (less than 1e-6)</li>
							<li>No significant recent trading volume (score {">"} 0.8)</li>
							<li>No significant recent transactions (score {">"} 0.8)</li>
							<li>Highly imbalanced liquidity (ratio less than 0.1)</li>
							<li>Historical activity but no recent transactions</li>
							<li>Historical volume but no recent trades</li>
						</ul>
					</div>

					<div className="space-y-3">
						<h3 className="text-lg font-semibold">Metrics Calculated</h3>
						<ul className="list-disc pl-6 space-y-2">
							<li>Overall risk score (0-100)</li>
							<li>Risk category classification</li>
							<li>Individual component scores</li>
							<li>Pool metrics including TVL, volumes, transactions</li>
							<li>Liquidity balance ratio</li>
							<li>Activity trends across multiple time periods</li>
						</ul>
					</div>
				</CardContent>
			</Card>
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

	if ((error || !metrics) && !isLoading) {
		return (
			<div className="h-80 flex items-center justify-center">
				<div className="flex flex-col items-center justify-center">
					<div className="w-20 h-20 bg-secondary flex items-center justify-center rounded-full">
						<Inbox className="w-10 h-10" />
					</div>
					<div className="space-y-2 text-center">
						<h2 className="text-2xl font-bold tracking-tight">
							No data to display
						</h2>
						<p className="text-gray-500 dark:text-gray-400">
							It looks like there's no data available yet.
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="h-80 flex items-center justify-center">
				<HyperText>Loading data, please wait...</HyperText>
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
							<div className="font-semibold">Risk Score</div>
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
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="border rounded-lg h-fit">
						<div>
							<div className="flex items-center gap-2 border-b p-4">
								<FileWarning size={16} />
								<div className="font-semibold">Warnings</div>
							</div>
							<div className="p-4">
								<ul>
									{analyzeRisk?.warnings.map((warning, index) => (
										<li key={index} className="flex items-center gap-2">
											<TriangleAlert size={16} />
											<div>{warning}</div>
										</li>
									))}
									{analyzeRisk?.warnings.length === 0 && (
										<li className="text-muted-foreground">
											No warnings found.
										</li>
									)}
								</ul>
							</div>
						</div>
					</div>
					<RiskAnalysisDoc />
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
