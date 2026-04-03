const KIBBLE_BASE = "https://kibble.sh/pay";

export interface KibbleParams {
  /** Destination chain ID (e.g., 8453 for Base) */
  toChain: number;
  /** Token contract address on the destination chain */
  toToken: string;
  /** Agent's receiving wallet address */
  toAddress: string;
  /** Display name shown in the payment page header */
  agentName?: string;
  /** Fixed amount in destination token units */
  toAmount?: number | string;
  /** Agent avatar image URL */
  agentLogo?: string;
  /** Minimum transaction value in USD */
  minAmountUSD?: number;
  /** Pre-select source chain ID (must be paired with fromToken) */
  fromChain?: number;
  /** Pre-select source token address (must be paired with fromChain) */
  fromToken?: string;
  /** Amount to send in source token units (requires fromChain + fromToken) */
  fromAmount?: number | string;
}

/**
 * Build a Kibble payment URL that lets anyone fund an agent wallet cross-chain.
 *
 * @example
 * ```ts
 * import { kibble } from "kibble-pay";
 *
 * const url = kibble({
 *   toChain: 8453,
 *   toToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
 *   toAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD68",
 *   agentName: "TradingBot",
 *   toAmount: 50,
 * });
 * // => "https://kibble.sh/pay?toChain=8453&toToken=0x833589f...&..."
 * ```
 */
export function kibble(params: KibbleParams): string {
  const url = new URL(KIBBLE_BASE);
  url.searchParams.set("toChain", String(params.toChain));
  url.searchParams.set("toToken", params.toToken);
  url.searchParams.set("toAddress", params.toAddress);
  if (params.agentName) url.searchParams.set("agentName", params.agentName);
  if (params.toAmount !== undefined) url.searchParams.set("toAmount", String(params.toAmount));
  if (params.agentLogo) url.searchParams.set("agentLogo", params.agentLogo);
  if (params.minAmountUSD !== undefined) url.searchParams.set("minAmountUSD", String(params.minAmountUSD));
  if (params.fromChain !== undefined && params.fromToken) {
    url.searchParams.set("fromChain", String(params.fromChain));
    url.searchParams.set("fromToken", params.fromToken);
    if (params.fromAmount !== undefined) url.searchParams.set("fromAmount", String(params.fromAmount));
  }
  return url.toString();
}

/** Common USDC token addresses by chain ID */
export const USDC: Record<number, string> = {
  1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  10: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  137: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  43114: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  534352: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
};

/** Common USDT token addresses by chain ID */
export const USDT: Record<number, string> = {
  1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  10: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
  137: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  8453: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
  42161: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
  43114: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
};

export default kibble;
