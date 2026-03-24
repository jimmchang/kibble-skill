# kibble-pay

Cross-chain payment URLs for AI agent wallets. One function, one URL, any chain.

## How it works

Your agent needs funding — maybe it runs on Base with USDC, but the user funding it holds SOL on Solana. That shouldn't matter.

Kibble gives your agent a single URL. The user opens it, connects whatever wallet they have, picks whatever token they're holding, and [LI.FI](https://li.fi) routes everything to the right token on the right chain. Destination fields are locked so nothing gets sent to the wrong place.

60+ chains supported. No SDK required on the frontend — the URL is the entire integration.

## URL schema

Your agent generates a URL, and that URL is the entire integration.

```
GET /pay?toChain={chainId}&toToken={tokenAddress}&toAddress={walletAddress}
```

**Required parameters**

- `toChain` — destination chain ID (e.g., `8453` for Base)
- `toToken` — token contract address on the destination chain
- `toAddress` — the agent's wallet address

**Optional parameters**

- `toAmount` — requested token amount
- `agentName` — display name shown to the user
- `agentLogo` — image URL for agent branding
- `minAmountUSD` — minimum USD value to accept

**Example**

An agent on Base that needs USDC at `0x705A42EcC5dF243BF9298f1D091b89761522a796`:

```
https://kibble.sh/pay?toChain=8453&toToken=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&toAddress=0x705A42EcC5dF243BF9298f1D091b89761522a796&agentName=MyAgent&toAmount=10
```

The user opens that link, connects their wallet, picks a source token from any supported chain, and signs. The agent's wallet receives USDC on Base.

**Supported chains**

Kibble supports every chain that LI.FI supports, which currently includes 60+ networks spanning EVM chains (Ethereum, Base, Arbitrum, Optimism, Polygon, and dozens more), Solana, Bitcoin, and Sui. You can find the full list in the [LI.FI documentation](https://docs.li.fi/introduction/chains).

**How the pay page works**

The server validates every parameter before rendering anything — bad params redirect to an error page with a specific reason, while valid params render a two-panel layout.

On the left, an agent header shows the branding, destination chain, requested amount, and a locked wallet address. On the right, the LI.FI widget handles source selection, routing, and transaction signing with destination fields disabled in the widget config so users can't change them.

OG meta tags render server-side, so when your agent drops a Kibble link in Telegram or Discord the preview card shows the agent name and payment context instead of a generic URL.

## Install

```bash
npm install kibble-pay
```

## Usage

```typescript
import { kibble, USDC } from "kibble-pay";

const url = kibble({
  toChain: 8453,
  toToken: USDC[8453],
  toAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD68",
  agentName: "TradingBot",
  toAmount: 50,
});

// Send this URL to your user — they open it, connect any wallet,
// pick any source token, and LI.FI routes everything to Base USDC.
console.log(url);
```

## API

### `kibble(params): string`

Builds a [Kibble](https://kibble.sh) payment URL.

| Param | Type | Required | Description |
|---|---|---|---|
| `toChain` | `number` | yes | Destination chain ID |
| `toToken` | `string` | yes | Token contract address on destination chain |
| `toAddress` | `string` | yes | Agent's receiving wallet address |
| `agentName` | `string` | no | Display name in the payment page header |
| `toAmount` | `number \| string` | no | Fixed amount in destination token units |
| `agentLogo` | `string` | no | Agent avatar image URL |
| `minAmountUSD` | `number` | no | Minimum transaction value in USD |

### Token helpers

Pre-mapped contract addresses for common tokens:

```typescript
import { USDC, USDT } from "kibble-pay";

USDC[8453]  // Base USDC
USDC[42161] // Arbitrum USDC
USDT[1]     // Ethereum USDT
```

**USDC** — Ethereum (1), Optimism (10), Polygon (137), Base (8453), Arbitrum (42161), Avalanche (43114), Scroll (534352)

**USDT** — Ethereum (1), Optimism (10), Polygon (137), Base (8453), Arbitrum (42161), Avalanche (43114)

## Teach your coding agent

### Claude Code

```bash
npx skills add 0xJim/kibble
```

Then use `/kibble-pay` in Claude Code to generate payment links.

### Any agent

Tell your AI:

```
Read the agent skill document at https://kibble.sh/llms.txt and follow the instructions. Help me set up a payment link for my agent.
```

Your AI handles the rest — URL construction, wallet params, chain selection.

## License

MIT

## Built by

[Jimmy](https://x.com/0xJim) — [kibble.sh](https://kibble.sh)
