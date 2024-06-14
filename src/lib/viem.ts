import { createPublicClient, http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

const chain = process.env.NEXT_PUBLIC_ENVIRONMENT == "development" ? sepolia : mainnet;
const transport = http(process.env.NEXT_PUBLIC_ALCHEMY_RPC);
 
export const publicClient = createPublicClient({
  chain: chain,
  transport: transport,
});