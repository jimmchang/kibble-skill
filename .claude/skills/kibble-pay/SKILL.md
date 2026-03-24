---
name: kibble-pay
description: Integrate Kibble cross-chain payment links into an AI agent. Use this skill when an agent needs to request funding from a user across any chain/token. Generates payment URLs, code snippets, and framework-specific integrations.
---

# Kibble Payment Integration

Kibble is a cross-chain deposit abstraction layer for AI agent wallets. An agent generates a URL with its wallet constraints locked. A user opens it, connects any wallet, picks any source token, and LI.FI handles all routing to deliver the exact token on the exact chain the agent needs.

## URL Schema

```
https://kibble.sh/pay?toChain={chainId}&toToken={tokenAddress}&toAddress={walletAddress}
                      &toAmount={amount}        # optional — fixed requested amount
                      &agentName={name}         # optional — display name shown in header
                      &agentLogo={imageUrl}     # optional — agent avatar URL
                      &minAmountUSD={number}    # optional — minimum in USD equiv
```

### Required Parameters

| Param | Type | Example | Description |
|---|---|---|---|
| `toChain` | `number` | `10` | Destination chain ID |
| `toToken` | `string` | `0x0b2C639c...` | Destination token contract address |
| `toAddress` | `string` | `0x742d35Cc...` | Agent's receiving wallet address |

### Optional Parameters

| Param | Type | Example | Description |
|---|---|---|---|
| `toAmount` | `string` | `50` | Fixed amount in destination token units |
| `agentName` | `string` | `TradingBot` | Display name shown in the page header |
| `agentLogo` | `string` | `https://...` | Agent avatar image URL |
| `minAmountUSD` | `number` | `10` | Minimum transaction value in USD |

### Common Chain IDs

| Chain | ID | Chain | ID |
|---|---|---|---|
| Ethereum | 1 | Base | 8453 |
| Arbitrum | 42161 | Optimism | 10 |
| Polygon | 137 | BSC | 56 |
| Avalanche | 43114 | Sonic | 146 |
| Hyperliquid | 1337 | Berachain | 80094 |
| Scroll | 534352 | zkSync | 324 |
| Linea | 59144 | Mantle | 5000 |
| Gnosis | 100 | Celo | 42220 |
| Solana | 1151111081099710 | | |

60+ chains supported — see [full list](https://docs.li.fi/introduction/chains).

## Code Patterns

### Python (universal)

```python
from urllib.parse import urlencode

KIBBLE_BASE = "https://kibble.sh/pay"

def request_funding(
    chain_id: int,
    token_address: str,
    wallet_address: str,
    agent_name: str,
    amount: float | None = None,
    agent_logo: str | None = None,
) -> str:
    params = {
        "toChain": chain_id,
        "toToken": token_address,
        "toAddress": wallet_address,
        "agentName": agent_name,
    }
    if amount is not None:
        params["toAmount"] = str(amount)
    if agent_logo:
        params["agentLogo"] = agent_logo
    return f"Fund me here: {KIBBLE_BASE}?{urlencode(params)}"

# Example: Request 50 USDC on Base
url = request_funding(
    chain_id=8453,
    token_address="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    wallet_address="0x742d35Cc6634C0532925a3b844Bc9e7595f2bD68",
    agent_name="TradingBot",
    amount=50,
)
```

### TypeScript (universal)

```typescript
const KIBBLE_BASE = "https://kibble.sh/pay";

interface KibbleParams {
  toChain: number;
  toToken: string;
  toAddress: string;
  agentName?: string;
  toAmount?: number;
  agentLogo?: string;
  minAmountUSD?: number;
}

function requestFunding(params: KibbleParams): string {
  const query = new URLSearchParams();
  query.set("toChain", String(params.toChain));
  query.set("toToken", params.toToken);
  query.set("toAddress", params.toAddress);
  if (params.agentName) query.set("agentName", params.agentName);
  if (params.toAmount !== undefined) query.set("toAmount", String(params.toAmount));
  if (params.agentLogo) query.set("agentLogo", params.agentLogo);
  if (params.minAmountUSD !== undefined) query.set("minAmountUSD", String(params.minAmountUSD));
  return `${KIBBLE_BASE}?${query.toString()}`;
}

// Example
const url = requestFunding({
  toChain: 8453,
  toToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  toAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD68",
  agentName: "TradingBot",
  toAmount: 50,
});
```

## Framework Integrations

### AgentKit (Coinbase)

```typescript
import { AgentKit } from "@coinbase/agentkit";

const requestFundingAction = {
  name: "request_funding",
  description: "Generate a Kibble payment link so a user can fund this agent's wallet",
  schema: z.object({
    amount: z.number().optional().describe("Amount in destination token units"),
  }),
  invoke: async (args) => {
    const url = requestFunding({
      toChain: parseInt(process.env.AGENT_CHAIN_ID!),
      toToken: process.env.AGENT_TOKEN_ADDRESS!,
      toAddress: agentkit.getWalletAddress(),
      agentName: "MyAgent",
      toAmount: args.amount,
    });
    return `To fund me, visit: ${url}`;
  },
};
```

### Eliza (elizaOS)

```typescript
// In your Eliza plugin
export const kibbleFundingAction: Action = {
  name: "REQUEST_FUNDING",
  description: "Request cross-chain funding from the user via Kibble",
  handler: async (runtime, message, state, options, callback) => {
    const url = requestFunding({
      toChain: Number(runtime.getSetting("AGENT_CHAIN_ID")),
      toToken: runtime.getSetting("AGENT_TOKEN_ADDRESS"),
      toAddress: runtime.getSetting("AGENT_WALLET_ADDRESS"),
      agentName: runtime.character.name,
    });
    callback?.({ text: `I need funding to continue. Please visit: ${url}` });
    return true;
  },
};
```

### CrewAI

```python
from crewai import Tool

def create_kibble_tool(chain_id: int, token_address: str, wallet_address: str, agent_name: str):
    def request_funding(amount: str = None) -> str:
        params = {
            "toChain": chain_id,
            "toToken": token_address,
            "toAddress": wallet_address,
            "agentName": agent_name,
        }
        if amount:
            params["toAmount"] = amount
        return f"Please fund my wallet: {KIBBLE_BASE}?{urlencode(params)}"

    return Tool(
        name="request_funding",
        description="Generate a payment link for the user to fund this agent",
        func=request_funding,
    )
```

### Claude Code

```bash
npx skills add 0xJim/kibble
```

Then use `/kibble-pay` in Claude Code to generate payment links.

### Codex

```
Fetch and follow instructions from https://raw.githubusercontent.com/0xJim/kibble/main/.claude/skills/kibble-pay/SKILL.md
```

### OpenCode

```
Fetch and follow instructions from https://raw.githubusercontent.com/0xJim/kibble/main/.claude/skills/kibble-pay/SKILL.md
```

Or add the URL schema to your `AGENTS.md` so OpenCode knows how to construct payment links.

### OpenClaw

Add Kibble as a tool in your OpenClaw agent config:

```yaml
tools:
  - name: request_funding
    description: Generate a Kibble payment link for cross-chain agent funding
    parameters:
      amount:
        type: number
        description: Amount in destination token units (optional)
    execute: |
      echo "Fund me here: https://kibble.sh/pay?toChain=${AGENT_CHAIN_ID}&toToken=${AGENT_TOKEN_ADDRESS}&toAddress=${AGENT_WALLET_ADDRESS}&toAmount=${amount}&agentName=${AGENT_NAME}"
```

### Any agent

Tell your AI to read the skill and follow the instructions:

```
Read the agent skill document at https://kibble.sh/llms.txt and follow the instructions. Help me set up a payment link for my agent.
```

## Example URLs

```bash
# Simple: "Send me USDC on Base"
/pay?toChain=8453&toToken=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&toAddress=0x742d35...

# Fixed amount: "Send me exactly 50 USDC on Optimism"
/pay?toChain=10&toToken=0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85&toAddress=0x742d35...&toAmount=50&agentName=TradingBot

# With minimum: "Send me at least $10 worth"
/pay?toChain=42161&toToken=0xaf88d065e77c8cC2239327C5EDb3A432268e5831&toAddress=0x742d35...&minAmountUSD=10&agentName=YieldAgent
```

## Common Token Addresses

| Token | Chain | Address |
|---|---|---|
| USDC | Base (8453) | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| USDC | Optimism (10) | `0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85` |
| USDC | Arbitrum (42161) | `0xaf88d065e77c8cC2239327C5EDb3A432268e5831` |
| USDC | Ethereum (1) | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |
| USDC | Polygon (137) | `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174` |

## Notes

- The URL schema is the entire integration — no SDK required
- All destination fields are locked and non-editable in the UI (trust signal for users)
- Widget handles wallet connection, route selection, bridging, and status tracking
- Monitor deposit completions via `onRouteExecutionCompleted` widget event if embedded
