import { QueryClient } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			retry: 1,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			refetchOnWindowFocus: false,
			refetchOnMount: false,
		},
	},
});

export async function customFetch<T>(
	url: string,
	options: RequestInit = {},
): Promise<T> {
	const defaultHeaders = {
		"Content-Type": "application/json",
	};

	try {
		const response = await fetch(`${url}`, {
			...options,
			headers: {
				...defaultHeaders,
				...options.headers,
			},
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				error.message || `HTTP error! status: ${response.status}`,
			);
		}

		return response.json();
	} catch (error) {
		console.error("API Error:", error);
		throw error;
	}
}

export const api = {
	get: <T>(url: string, options?: RequestInit) =>
		customFetch<T>(url, { method: "GET", ...options }),

	post: <T>(url: string, data?: unknown, options?: RequestInit) =>
		customFetch<T>(url, {
			method: "POST",
			body: JSON.stringify(data),
			...options,
		}),

	put: <T>(url: string, data?: unknown, options?: RequestInit) =>
		customFetch<T>(url, {
			method: "PUT",
			body: JSON.stringify(data),
			...options,
		}),

	delete: <T>(url: string, options?: RequestInit) =>
		customFetch<T>(url, { method: "DELETE", ...options }),
};

export const formatCurrency = (value: number | null, includeSymbol = true) =>
	value
		? value
				.toLocaleString("en-US", {
					style: "currency",
					currency: "USD",
					currencyDisplay: includeSymbol ? "symbol" : "code",
				})
				.replace(includeSymbol ? "" : "USD", "")
		: 0;
