import { abi} from "@/constants/tokenABI.json";
import { useAccount } from "wagmi";
import { Address, readContract} from "@wagmi/core";
import { GrTest } from "react-icons/gr";
import {uniswapRouterABI, uniswapV2RouterAddress, wethAddress, uniswapV2PairABI} from '@/constants/routerABI.json'
import { formatUnits, parseUnits } from "viem";

import axios from "axios";
import { Interface, ethers } from "ethers";
import { Wallet } from "@/types/wallet";


interface SimulateTxProps {
    projectData: {
        beneficiaryDetails: {
            wallets: Wallet[];
        };
        deployedTokenAddress: `0x${string}`;
        poolAddress: `0x${string}`;
    };
}

const invoices: any[] = [
    {
        Number: "3",
        Address: "0x694a967A60b61Cb23dAA46571A137e4Fb0656076",
        EthBalance: "0.00036",
        TokenBalance: "0.00036",
        TokensToBuy: '10'
    },
    {
        Number: "1",
        Address: "0x20FEE153B13d8f0A83bd9B9C2B627f830Ff957FB",
        EthBalance: "0.00036",
        TokenBalance: "0.00036",
        TokensToBuy: '50'
        
    },
    {
        Number: "2",
        Address: "0xf4C4795c309a8e4a1AD548D82a875193980E82ff",
        EthBalance: "0.00036",
        TokenBalance: "0.00036",
        TokensToBuy: '10'
    },

];

export const SimulateTx = ({
    projectData
}: SimulateTxProps) => {
  const {address} = useAccount();  



  const handleSimulation = async () => {
    await fetchQuotes()
    const transactionSequence = [];
    const ethTransferTransactions = await getEthTransferTxSequence();
    transactionSequence.push(...ethTransferTransactions);
    const setTradingManagerTransaction = await getTradingManagerTx();
    transactionSequence.push(setTradingManagerTransaction);
    const enableTradingTransaction = getEnableTradingTx();
    transactionSequence.push(enableTradingTransaction);
    const buyTx = getBuyTx()
    transactionSequence.push(...buyTx);

    console.log(invoices);
    console.log(transactionSequence);

    await simulate(transactionSequence)

  };

  const fetchQuotes = async() => {
    const pairAddress = projectData.poolAddress;
    const result = await readContract({
      abi: uniswapV2PairABI,
      address: pairAddress,
      functionName: 'getReserves'
    })

    const reservesArray: any = result;

    let reserveEth = parseFloat(reservesArray[0]);
    let reserveToken = parseFloat(reservesArray[1]);

    for(let i=0; i<invoices.length; i++){
        const amountToken = parseUnits(invoices[i].TokensToBuy, 18).toString()
        const ethRequired = await getEthAmountForToken(reserveEth, reserveToken, amountToken);
        reserveEth += ethRequired!;
        reserveToken -= parseFloat(amountToken);
        const formattedValue = formatUnits(BigInt(ethRequired!), 18);

        invoices[i].requiredETH = formattedValue;
    }

  }

  const getEthAmountForToken = async(reserveEth: number, reserveToken: number, amountOut:string) => {
    try {
      const result = await readContract({
        abi:uniswapRouterABI,
        address: uniswapV2RouterAddress as Address,
        functionName: 'getAmountIn',
        args: [amountOut, reserveEth.toString(), reserveToken.toString()]
    
      })
      const amounts: any = result;

      return parseFloat(amounts);
    } catch (error) {
      console.log(error)
    }
  }

  const getEthTransferTxSequence = () => {

    const ethTransferTransactions = []
    for(let i=0; i<invoices.length; i++){
        const ethValue = parseFloat(invoices[i].requiredETH) + parseFloat(formatUnits(BigInt('907946'), 9));
        console.log(ethValue);
        const tx = {
            from: address,
            to: invoices[i].Address,
            value: (parseUnits(ethValue.toString(), 18).toString())
        }
         ethTransferTransactions.push(tx); 
      }

    return ethTransferTransactions
  }

  const getTradingManagerTx = async() => {
    try {

        const tokenAddress = projectData.deployedTokenAddress;

        const tokenInterface = new Interface(abi);

        const result = await readContract({
          abi,
          address: tokenAddress,
          functionName: 'TRADING_MANAGER_ROLE'
        })

        const tx = {
            from: address,
            to: tokenAddress,
            input: tokenInterface.encodeFunctionData('grantRole', [result, address])
        }

        return tx

    } catch (error) {
      console.log(error);
    } 
  }

  const getEnableTradingTx = () => {
    try {

        const tokenAddress = projectData.deployedTokenAddress;

        const tokenInterface = new Interface(abi);

        const tx = {
            from: address,
            to: tokenAddress,
            input: tokenInterface.encodeFunctionData('setEnableTrading', [true])
        }

        return tx

    } catch (error) {
      console.log(error);
    } 
  }

  const getBuyTx = () => {
    try {

        const tokenAddress = projectData.deployedTokenAddress;
        const uniswapRouterInterface = new Interface(uniswapRouterABI);
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
        const buyTranscations = []
        for(let i=0; i<invoices.length; i++){
          const amountETHMax: string = invoices[i].requiredETH
        const tx = {
            from: invoices[i].Address,
            to: uniswapV2RouterAddress,
            input: uniswapRouterInterface.encodeFunctionData('swapETHForExactTokens', [parseUnits(invoices[i].TokensToBuy,18),[wethAddress,tokenAddress],invoices[i].Address,deadline]),
            value: (parseUnits(amountETHMax, 18).toString())
        }
        buyTranscations.push(tx);
        }
  
        return buyTranscations;
    } catch (error) {
      console.log(error);
    } 
  }

  const simulate = async(transactionSequence: any[])=> {
      const simulationResponse = await axios.post(
        `https://api.tenderly.co/api/v1/account/kai010/project/erc21bot/simulate-bundle`,
        {
            simulations: transactionSequence.map((transaction) => ({
              network_id: '11155111', // network to simulate on
              save: true,
              save_if_fails: true,
              simulation_type: 'full',
              ...transaction,
            })),
          },
          {
            headers: {
              'X-Access-Key': 'EjuQ-40NZHjcBPrmM5TR-2YxjqKbb8QV',
            },
          },
      )

      console.log(simulationResponse.data);

    };

  return (
    <div>
        <button
        onClick={handleSimulation}
        className="bg-[#27272A] hover:bg-[#F57C00] cursor-pointer px-4 py-2 text-[12px] flex gap-2 items-center justify-center rounded-md text-[#000000] text-sm font-bold leading-6 tracking-[0.032px]"
        disabled={false}
    >
        <GrTest className='text-black h-[18px] w-[18px]' />
        <p>Simulate</p>
    </button>
   
    </div>
  );
};
