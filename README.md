# DeFi Risk Analysis Dashboard

Real-time DeFi pool risk analysis tool powered by BitsCrunch API. Monitor and analyze DeFi pools across multiple chains with comprehensive risk metrics and scoring.

## Features

- Risk scoring for DeFi pools
- Multi-chain support
- Real-time data updates
- TVL and volume tracking
- Transaction analysis
- User-friendly interface
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm/yarn/pnpm
- BitsCrunch API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/akbaridria/defi-risk.git
cd defi-risk
```
2. Clone the repository:
```bash
npm install
```
3. Create `.env.local`:
```bash
BC_API_KEY=your_bitscrunch_api_key
```
4. Start development server:
```bash
npm run dev
```

### API Integration
This project uses BitsCrunch API endpoints:
- `/api/v2/defi/pool/metrics` - Pool metrics and risk data
- `/api/v2/defi/pool/metadata` - Pool metadata and information

### Tech Stack
- Next.js 14 (App Router)
- React Query
- Tailwind CSS
- shadcn/ui
- TypeScript
- Biome