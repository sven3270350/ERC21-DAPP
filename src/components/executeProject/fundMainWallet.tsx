import React from "react";
interface FundMainWalletProps {
  onNext?: () => void;
}
const FundMainWallet: React.FC<FundMainWalletProps> = ({ onNext }) => {
  return (
    <div className="p-6 flex flex-col items-center gap-6 border border-[#18181B] rounded-xl ">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold leading-8">Fund Main Wallet</h1>
        <p className="text-[#71717A] text-sm font-medium leading-5 ">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
        </p>
      </div>
      <div className="flex justify-between w-full ">
        <button className="py-2 flex justify-center items-center text-[#F57C00] text-sm font-bold ">
          Cancel
        </button>
        <button
          className="bg-[#F57C00] text-black px-8 py-2 text-sm font-bold tracking-[0.07px] rounded-md "
          onClick={onNext}
        >
          Fund
        </button>
      </div>
    </div>
  );
};

export default FundMainWallet;
