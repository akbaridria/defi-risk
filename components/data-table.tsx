import { COLUMN_HEADER } from "@/app/constant";
import type { PoolData } from "@/types";
import { Check, Copy, InfoIcon } from "lucide-react";
import { useState } from "react";
import ActionTable from "./action-table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

const formatAddress = (address: string) =>
	`${address.slice(0, 6)}...${address.slice(-4)}`;
const formatCurrency = (value: number | null, includeSymbol = true) =>
	value
		? value
				.toLocaleString("en-US", {
					style: "currency",
					currency: "USD",
					currencyDisplay: includeSymbol ? "symbol" : "code",
				})
				.replace(includeSymbol ? "" : "USD", "")
		: 0;
const getScoreBackgroundColor = (score: number) => {
	if (score >= 80) return "bg-red-200 text-red-900 border-2 border-red-600";
	if (score >= 60)
		return "bg-orange-200 text-orange-900 border-2 border-orange-600";
	if (score >= 40)
		return "bg-yellow-200 text-yellow-900 border-2 border-yellow-600";
	if (score >= 20)
		return "bg-green-200 text-green-900 border-2 border-green-600";
	return "bg-red-200 text-red-900 border-2 border-red-600";
};

const CopyText: React.FC<{ text: string }> = ({ text }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	return (
		<div className="flex items-center gap-1">
			<div>{formatAddress(text)}</div>
			<Button
				size="icon"
				onClick={handleCopy}
				variant="ghost"
				className="w-6 h-6"
			>
				{copied ? <Check size={8} /> : <Copy size={8} />}
			</Button>
		</div>
	);
};

const DataTable: React.FC<{
	poolData: PoolData[];
	excludeColumns: string[];
	isLoading: boolean;
}> = ({ poolData, excludeColumns, isLoading }) => {
	if (isLoading) {
		return (
			<div className="border rounded-lg">
				<Table className="rounded-lg">
					<TableHeader>
						<TableRow>
							{COLUMN_HEADER.filter(
								(header) => !excludeColumns.includes(header),
							).map((header) => (
								<TableHead key={header} className="whitespace-nowrap py-4">
									<Skeleton className="h-6 w-20" />
								</TableHead>
							))}
							<TableHead className="whitespace-nowrap py-4">
								<Skeleton className="h-6 w-20" />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{[...Array(10)].map((_, i) => (
							<TableRow key={i}>
								{COLUMN_HEADER.filter(
									(header) => !excludeColumns.includes(header),
								).map((header) => (
									<TableCell key={header} className="whitespace-nowrap py-8">
										<Skeleton className="h-6 w-20" />
									</TableCell>
								))}
								<TableCell className="whitespace-nowrap py-8">
									<Skeleton className="h-6 w-20" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}
	return (
		<div className="border rounded-lg">
			<Table className="rounded-lg">
				<TableHeader>
					<TableRow>
						{COLUMN_HEADER.filter(
							(header) => !excludeColumns.includes(header),
						).map((header) => (
							<TableHead key={header} className="whitespace-nowrap py-4">
								{header}
							</TableHead>
						))}
						<TableHead className="whitespace-nowrap py-4" />
					</TableRow>
				</TableHeader>
				<TableBody>
					{poolData.map((data) => (
						<TableRow key={data.pair_address}>
							{!excludeColumns.includes("Network") && (
								<TableCell className="whitespace-nowrap py-8 uppercase">
									{data.network}
								</TableCell>
							)}
							{!excludeColumns.includes("Pair Address") && (
								<TableCell className="whitespace-nowrap">
									<CopyText text={data.pair_address} />
								</TableCell>
							)}
							{!excludeColumns.includes("Protocol") && (
								<TableCell className="whitespace-nowrap">
									{data.protocol || "-"}
								</TableCell>
							)}
							{!excludeColumns.includes("Pool Name") && (
								<TableCell className="whitespace-nowrap">
									{data.pool_name}
								</TableCell>
							)}
							{!excludeColumns.includes("Token 0") && (
								<TableCell className="whitespace-nowrap">
									{data?.token_0?.name}
									<Badge variant="outline" className="ml-2">
										{data?.token_0?.symbol}
									</Badge>
								</TableCell>
							)}
							{!excludeColumns.includes("Token 1") && (
								<TableCell className="whitespace-nowrap">
									{data?.token_1?.name}
									<Badge variant="outline" className="ml-2">
										{data?.token_1?.symbol}
									</Badge>
								</TableCell>
							)}
							{!excludeColumns.includes("Token 0 Share") && (
								<TableCell className="whitespace-nowrap">
									{data.token_0_share}
								</TableCell>
							)}
							{!excludeColumns.includes("Token 1 Share") && (
								<TableCell className="whitespace-nowrap">
									{data.token_1_share}
								</TableCell>
							)}
							{!excludeColumns.includes("Token 0 TVL") && (
								<TableCell className="whitespace-nowrap">
									{formatCurrency(data.token_0_tvl, true)}
								</TableCell>
							)}
							{!excludeColumns.includes("Token 1 TVL") && (
								<TableCell className="whitespace-nowrap">
									{formatCurrency(data.token_1_tvl, true)}
								</TableCell>
							)}
							{!excludeColumns.includes("Token 0 Price") && (
								<TableCell className="whitespace-nowrap">
									{formatCurrency(data.token_0_price, true)}
								</TableCell>
							)}
							{!excludeColumns.includes("Token 1 Price") && (
								<TableCell className="whitespace-nowrap">
									{formatCurrency(data.token_1_price, true)}
								</TableCell>
							)}
							{!excludeColumns.includes("Token 0 Reserve") && (
								<TableCell className="whitespace-nowrap">
									{formatCurrency(data.token_0_reserve, false)}
								</TableCell>
							)}
							{!excludeColumns.includes("Token 1 Reserve") && (
								<TableCell className="whitespace-nowrap">
									{formatCurrency(data.token_1_reserve, false)}
								</TableCell>
							)}
							{!excludeColumns.includes("Token 0 Address") && (
								<TableCell className="whitespace-nowrap">
									<CopyText text={data?.token_0_address} />
								</TableCell>
							)}
							{!excludeColumns.includes("Token 1 Address") && (
								<TableCell className="whitespace-nowrap">
									<CopyText text={data?.token_1_address} />
								</TableCell>
							)}
							{!excludeColumns.includes("Total TVL") && (
								<TableCell className="whitespace-nowrap">
									{formatCurrency(data.total_tvl, true)}
								</TableCell>
							)}
							{!excludeColumns.includes("Score") && (
								<TableCell className="whitespace-nowrap">
									<TooltipProvider delayDuration={200}>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="grid items-center gap-2">
													<div
														className={`w-8 h-8 text-sm py-0.5 px-1 flex gap-1 items-center justify-center rounded-full font-bold ${getScoreBackgroundColor(data.risk_score ?? 0)}`}
													>
														{Math.floor(data.risk_score || 0)}
													</div>
													<div className="flex items-center gap-1">
														{data.risk_category} <InfoIcon size={14} />
													</div>
												</div>
											</TooltipTrigger>
											<TooltipContent side="left">
												<ul>
													{data.warnings?.map((warning) => {
														return (
															<li key={warning} className="text-sm">
																{warning}
															</li>
														);
													})}
												</ul>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</TableCell>
							)}
							<TableCell>
								<ActionTable
									chain={data.network}
									pairAddress={data.pair_address}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default DataTable;
