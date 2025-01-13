import { Badge } from "./ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { MOCK_DATA } from "@/app/constant";

const ColumnHeader = [
	"Network",
	"Pair Address",
	"Protocol",
	"Pool Name",
	"Token 0",
	"Token 1",
	"Token 0 Share",
	"Token 1 Share",
	"Token 0 TVL",
	"Token 1 TVL",
	"Token 0 Price",
	"Token 1 Price",
	"Token 0 Reserve",
	"Token 1 Reserve",
	"Total TVL",
	"Score",
];

const excludeColumns = [
	"Pair Address",
	"Token 0 Share",
	"Token 1 Share",
	"Token 0 TVL",
	"Token 1 TVL",
	"Token 0 Price",
	"Token 1 Price",
	"Token 0 Reserve",
	"Token 1 Reserve",
];

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
	if (score >= 90) return "bg-green-500";
	if (score >= 75) return "bg-yellow-500";
	if (score >= 50) return "bg-orange-500";
	return "bg-red-500";
};

const DataTable = () => {
	return (
		<div className="border rounded-lg">
			<Table className="rounded-lg">
				<TableHeader>
					<TableRow>
						{ColumnHeader.filter(
							(header) => !excludeColumns.includes(header),
						).map((header) => (
							<TableHead key={header} className="whitespace-nowrap py-4">
								{header}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{MOCK_DATA.data.map((data, index) => (
						<TableRow key={data.pair_address}>
							{!excludeColumns.includes("Network") && (
								<TableCell className="whitespace-nowrap py-8 uppercase">
									{data.network}
								</TableCell>
							)}
							{!excludeColumns.includes("Pair Address") && (
								<TableCell className="whitespace-nowrap">
									{formatAddress(data.pair_address)}
								</TableCell>
							)}
							{!excludeColumns.includes("Protocol") && (
								<TableCell className="whitespace-nowrap">
									{data.protocol}
								</TableCell>
							)}
							{!excludeColumns.includes("Pool Name") && (
								<TableCell className="whitespace-nowrap">
									{data.pool_name}
								</TableCell>
							)}
							{!excludeColumns.includes("Token 0") && (
								<TableCell className="whitespace-nowrap">
									{data.token_0.name}
									<Badge variant="secondary" className="ml-2">
										{data.token_0.symbol}
									</Badge>
								</TableCell>
							)}
							{!excludeColumns.includes("Token 1") && (
								<TableCell className="whitespace-nowrap">
									{data.token_1.name}
									<Badge variant="secondary" className="ml-2">
										{data.token_1.symbol}
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
									{formatCurrency(data.token_0_reserve, true)}
								</TableCell>
							)}
							{!excludeColumns.includes("Token 1 Reserve") && (
								<TableCell className="whitespace-nowrap">
									{formatCurrency(data.token_1_reserve, true)}
								</TableCell>
							)}
							{!excludeColumns.includes("Total TVL") && (
								<TableCell className="whitespace-nowrap">
									{formatCurrency(data.total_tvl, true)}
								</TableCell>
							)}
							{!excludeColumns.includes("Score") && (
								<TableCell className="whitespace-nowrap">
									<div
										className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${getScoreBackgroundColor(data.score ?? 0)}`}
									>
										{data.score}
									</div>
								</TableCell>
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default DataTable;
