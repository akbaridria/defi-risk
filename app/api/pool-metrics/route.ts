import type { NextRequest } from "next/server";
import "../../../env-config";

const API_KEY = process.env.BC_API_KEY;

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const page = Number.parseInt(searchParams.get("page") || "1");
		const limit = Number.parseInt(searchParams.get("limit") || "30");
		const blockchain = searchParams.get("blockchain") || "";
		const pair_address = decodeURIComponent(
			searchParams.get("pair_address") || "",
		);

		const params = new URLSearchParams({
			offset: page.toString(),
			limit: limit.toString(),
		});

		if (blockchain) params.append("blockchain", blockchain);
		if (pair_address) params.append("pair_address", pair_address);

		const response = await fetch(
			`https://api.unleashnfts.com/api/v2/defi/pool/metrics?${params.toString()}`,
			{
				headers: {
					accept: "application/json",
					"x-api-key": API_KEY || "",
				},
			},
		);

		if (!response.ok) {
			throw new Error(`API responded with status: ${response.status}`);
		}

		const data = await response.json();

		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				error:
					error instanceof Error ? error.message : "Failed to fetch metrics",
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
}
