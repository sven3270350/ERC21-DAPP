import { createPublicClient, http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

const chain = process.env.NEXT_ENVIRONMENT === "development" ? sepolia : mainnet;
 
export const publicClient = createPublicClient({
  chain: chain,
  transport: http()
})
