import { abi} from "@/constants/tokenABI.json";
import { useAccount } from "wagmi";
import { Address, readContract} from "@wagmi/core";
import { GrTest } from "react-icons/gr";
import {uniswapRouterabi, uniswapV2RouterAddress, wethAddress, uniswapV2PairABI} from '@/constants/routerABI.json'
import { formatUnits, parseUnits } from "viem";

import axios from "axios";
import { Interface, ethers } from "ethers";
import { Wallet } from "@/types/wallet";


interface SimulateTxProps {
    projectData: {
        beneficiaryDetails: {
            wallets: Wallet[];
        };
        deployedTokenAddress: {
            contractAddress: `0x${string}`;
            pairAddress: `0x${string}`;
        }
    };
}

const invoices: any[] = [
    {
        Number: "3",
        Address: "0x694a967A60b61Cb23dAA46571A137e4Fb0656076",
        EthBalance: "0.00036",
        TokenBalance: "0.00036",
        TokensToBuy: '100'
    },
    {
        Number: "1",
        Address: "0x20FEE153B13d8f0A83bd9B9C2B627f830Ff957FB",
        EthBalance: "0.00036",
        TokenBalance: "0.00036",
        TokensToBuy: '100'
        
    },
    {
        Number: "2",
        Address: "0xf4C4795c309a8e4a1AD548D82a875193980E82ff",
        EthBalance: "0.00036",
        TokenBalance: "0.00036",
        TokensToBuy: '100'
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
    const enableTradingTransaction = getEnableTradingTx();
    transactionSequence.push(enableTradingTransaction);
    const buyTx = getBuyTx()
    transactionSequence.push(...buyTx);

    console.log(transactionSequence);

    // await simulate(transactionSequence)

  };

  const fetchQuotes = async() => {

    const result = await readContract({
      abi: uniswapV2PairABI,
      address: '0xCA60cA0699161Db7A0420F8D1e05E19d16DF4257',
      functionName: 'getReserves'
    })

    const reservesArray: any = result;

    console.log(reservesArray[0].toString());
    
    let reserveEth = parseFloat(reservesArray[0]);
    let reserveToken = parseFloat(reservesArray[1]);

    for(let i=0; i<invoices.length; i++){

        let ethRequired = getEthAmountForPoo(reserveEth, reserveToken, invoices[i].TokensToBuy);
        reserveEth += ethRequired;
        reserveToken -= invoices[i].TokensToBuy;

        const formattedValue = formatUnits(ethRequired, 18);

        invoices[i].requiredETH = formattedValue;
    }

    function getEthAmountForPoo(reserveEth: number, reservePoo: number, amountPoo:number): number {
      let newReservePoo = reservePoo - amountPoo;
      let newReserveEth = (reserveEth * reservePoo) / newReservePoo;
      let ethRequired = newReserveEth - reserveEth;
      return ethRequired;
  }

  }

  

  const getEthTransferTxSequence = async() => {

    const ethTransferTransactions = []




    for(let i=0; i<invoices.length; i++){
        const ethValue = parseFloat(invoices[i].requiredETH) + parseFloat(formatUnits(BigInt('907946'), 9));
        const tx = {
            from: address,
            to: invoices[i].Address,
            value: (parseUnits(ethValue.toString(), 18).toString())
        }
         ethTransferTransactions.push(tx); 
      }

    return ethTransferTransactions
  }

  const getEnableTradingTx = () => {
    try {

        const tokenAddress = projectData.deployedTokenAddress;

        const tokenInterface = new Interface(abi);

        const tx = {
            from: address,
            to: "0x97bf5e146581ac7c633f0dfd0f382ff0213e742b",
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

        const uniswapRouterInterface = new Interface(uniswapRouterabi);
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
        const buyTranscations = []
        for(let i=0; i<invoices.length; i++){
       
        const tx = {
            from: invoices[i].Address,
            to: uniswapV2RouterAddress,
            input: uniswapRouterInterface.encodeFunctionData('swapExactETHForTokens', [parseUnits('1',18),[wethAddress,"0xcc30EE414bDcDD02eFc1eEa7DCC1Ea14040018B0"],invoices[i].Address,deadline]),
            value: (parseUnits(invoices[i].requiredETH, 18).toString())
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
        className="bg-[#27272A] cursor-pointer px-4 py-2 text-[12px] flex gap-2 items-center justify-center rounded-md text-[#000000] text-sm font-bold leading-6 tracking-[0.032px]"
        disabled={false}
    >
        <GrTest className='text-black h-[18px] w-[18px]' />
        <p>Simulate</p>
    </button>
   
    </div>
  );
};
