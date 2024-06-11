import { createPublicClient, http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

const chain = process.env.NEXT_PUBLIC_ENVIRONMENT === "development" ? sepolia : mainnet;
const transport = process.env.NEXT_PUBLIC_ENVIRONMENT === "development" ? http("https://sepolia.drpc.org") : http()
 
export const publicClient = createPublicClient({
  chain: chain,
  transport: transport,
})
