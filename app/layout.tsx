import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactQueryProvider } from "@/components/react-query-provider";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "DeFi Risk Scanner | Liquidity Pool Risk Analysis Tool",
	description:
		"Advanced risk analysis tool for DeFi liquidity pools. Monitor pool health, analyze trading activity, detect potential risks, and assess token pair stability in real-time.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<ReactQueryProvider>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<body
						className={`${geistSans.variable} ${geistMono.variable} antialiased`}
					>
						<Header />
						{children}
					</body>
				</ThemeProvider>
			</ReactQueryProvider>
		</html>
	);
}
