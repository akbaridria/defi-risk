import type { Pagination, PoolData } from "@/types";

export const LIST_NETWORKS = [
	{
		value: "ethereum",
		label: "Ethereum",
	},
	{
		value: "polygon",
		label: "Polygon",
	},
	{
		value: "avalanche",
		label: "Avalanche",
	},
	{
		value: "linea",
		label: "Linea",
	},
];

export const COLUMN_HEADER = [
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
	"Token 0 Address",
	"Token 1 Address",
	"Total TVL",
	"Risk Score",
];

export const DEFAULT_EXCLUDED_COLUMNS = [
	"Token 0 Share",
	"Token 1 Share",
	"Token 0 TVL",
	"Token 1 TVL",
	"Token 0 Price",
	"Token 1 Price",
	"Token 0 Reserve",
	"Token 1 Reserve",
    "Pair Address",
    "Protocol",
];
