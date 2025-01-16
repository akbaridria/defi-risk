import type { ResponsePoolMetrics } from "@/types";

interface ActivityTrend {
	"24h": number;
	"7d": number;
	"30d": number;
	"90d": number;
}

interface PoolMetrics {
	tvl: number;
	daily_volume: number;
	total_volume: number;
	daily_transactions: number;
	total_transactions: number;
	liquidity_balance_ratio: number;
	activity_trend: ActivityTrend;
}

interface ComponentScores {
	tvl_score: number;
	volume_score: number;
	activity_score: number;
	price_stability_score: number;
	balance_score: number;
}

interface RiskAnalysis {
	risk_score: number;
	risk_category: string;
	component_scores: ComponentScores;
	warnings: string[];
	pool_metrics: PoolMetrics;
}

const normalize = (
	value: number | null | undefined,
	minVal: number,
	maxVal: number,
): number => {
	if (value === null || value === undefined || value === 0) {
		return 1;
	}
	return Math.min(1, Math.max(0, (value - minVal) / (maxVal - minVal)));
};

const calculateActivityScore = (poolData: ResponsePoolMetrics): number => {
	const activityWeights = {
		"24h": 0.4,
		"7d": 0.3,
		"30d": 0.2,
		"90d": 0.1,
	};

	const periodicScores = {
		"24h": poolData.transactions_24hrs || 0,
		"7d": (poolData.transactions_7d || 0) / 7,
		"30d": (poolData.transactions_30d || 0) / 30,
		"90d": (poolData.transactions_90d || 0) / 90,
	};

	const hasHistoricalActivity = (poolData.transactions_all ?? 0) > 0;
	const hasRecentActivity = Object.values(periodicScores).some(
		(score) => score > 0,
	);

	if (hasHistoricalActivity && !hasRecentActivity) {
		return 1;
	}

	return Object.entries(activityWeights).reduce((score, [period, weight]) => {
		const periodScore = normalize(
			periodicScores[period as keyof typeof periodicScores],
			0,
			50,
		);
		return score + periodScore * weight;
	}, 0);
};

const calculateVolumeScore = (poolData: ResponsePoolMetrics): number => {
	const volumeWeights = {
		"24h": 0.4,
		"7d": 0.3,
		"30d": 0.2,
		"90d": 0.1,
	};

	const periodicVolumes = {
		"24h": poolData.volume_24hrs || 0,
		"7d": (poolData.volume_7d || 0) / 7,
		"30d": (poolData.volume_30d || 0) / 30,
		"90d": (poolData.volume_90d || 0) / 90,
	};

	const hasHistoricalVolume = (poolData.volume_all ?? 0) > 0;
	const hasRecentVolume = Object.values(periodicVolumes).some((vol) => vol > 0);

	if (hasHistoricalVolume && !hasRecentVolume) {
		return 1;
	}

	return Object.entries(volumeWeights).reduce((score, [period, weight]) => {
		const periodScore = normalize(
			periodicVolumes[period as keyof typeof periodicVolumes],
			0,
			100000,
		);
		return score + periodScore * weight;
	}, 0);
};

const getRiskCategory = (score: number): string => {
	if (score < 20) return "Very Low Risk";
	if (score < 40) return "Low Risk";
	if (score < 60) return "Medium Risk";
	if (score < 80) return "High Risk";
	return "Very High Risk";
};

export const analyzePoolRisk = (
	poolData: ResponsePoolMetrics,
): RiskAnalysis => {
	const weights = {
		tvl: 0.25,
		volume: 0.2,
		transactions: 0.15,
		price: 0.15,
		balance: 0.15,
		activity: 0.1,
	};

	const tvl = Math.abs(poolData.total_tvl ?? 0);
	const tvlScore = normalize(tvl, 0, 1e6);
	const volumeScore = calculateVolumeScore(poolData);
	const activityScore = calculateActivityScore(poolData);

	const calculatePriceRatio = (token0Price?: number, token1Price?: number) => {
		if (!token0Price || !token1Price) return 0;

		const maxPrice = Math.max(token0Price, token1Price);

		if (maxPrice === 0) return 0;

		const minPrice = Math.min(token0Price, token1Price);
		return minPrice / maxPrice;
	};
	const priceRatio = calculatePriceRatio(
		poolData.token0_price,
		poolData.token1_price,
	);
	const priceScore = normalize(priceRatio, 0, 1);

	const totalShare =
		Math.abs(poolData.token0_share ?? 0) + Math.abs(poolData.token1_share ?? 0);
	const balanceRatio =
		Math.min(
			Math.abs(poolData.token0_share ?? 0),
			Math.abs(poolData.token1_share ?? 0),
		) /
		(totalShare / 2);
	const balanceScore = normalize(balanceRatio, 0, 1);

	const componentScores: ComponentScores = {
		tvl_score: tvlScore * 100,
		volume_score: volumeScore * 100,
		activity_score: activityScore * 100,
		price_stability_score: priceScore * 100,
		balance_score: balanceScore * 100,
	};

	const finalScore =
		(weights.tvl * tvlScore +
			weights.volume * volumeScore +
			weights.transactions * activityScore +
			weights.price * priceScore +
			weights.balance * balanceScore) *
		100;

	const warnings: string[] = [];
	if (tvl < 1e-6) warnings.push("Extremely low TVL");
	if (volumeScore > 0.8) warnings.push("No significant recent trading volume");
	if (activityScore > 0.8) warnings.push("No significant recent transactions");
	if (Math.abs(balanceRatio) < 0.1)
		warnings.push("Highly imbalanced liquidity");
	if ((poolData.transactions_all ?? 0) > 0 && !poolData.transactions_24hrs) {
		warnings.push(
			"Pool appears inactive - historical activity but no recent transactions",
		);
	}
	if ((poolData.volume_all ?? 0) > 0 && !poolData.volume_24hrs) {
		warnings.push(
			"Pool appears illiquid - historical volume but no recent trades",
		);
	}

	return {
		risk_score: Math.round(finalScore * 100) / 100,
		risk_category: getRiskCategory(finalScore),
		component_scores: {
			tvl_score: Math.round(componentScores.tvl_score * 100) / 100,
			volume_score: Math.round(componentScores.volume_score * 100) / 100,
			activity_score: Math.round(componentScores.activity_score * 100) / 100,
			price_stability_score:
				Math.round(componentScores.price_stability_score * 100) / 100,
			balance_score: Math.round(componentScores.balance_score * 100) / 100,
		},
		warnings,
		pool_metrics: {
			tvl,
			daily_volume: poolData.volume_24hrs || 0,
			total_volume: poolData.volume_all || 0,
			daily_transactions: poolData.transactions_24hrs || 0,
			total_transactions: poolData.transactions_all || 0,
			liquidity_balance_ratio: Math.round(balanceRatio * 10000) / 10000,
			activity_trend: {
				"24h": poolData.transactions_24hrs || 0,
				"7d": poolData.transactions_7d || 0,
				"30d": poolData.transactions_30d || 0,
				"90d": poolData.transactions_90d || 0,
			},
		},
	};
};
