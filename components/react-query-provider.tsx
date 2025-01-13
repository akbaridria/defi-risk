"use client";

import { queryClient } from "@/lib/utils";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

export const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};
