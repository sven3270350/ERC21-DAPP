import Image from "next/image";
import React from "react";
interface CreatePoolProps {
  onPrev?: () => void;
}
const CreatePool: React.FC<CreatePoolProps> = ({ onPrev }) => {
  return (
    <div className="p-6 flex flex-col items-center gap-6 border border-[#18181B] rounded-xl ">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold leading-8">Create Pool</h1>
        <p className="text-[#71717A] text-sm font-medium leading-5 ">
          Stop trading is active
        </p>
      </div>
      <div className="flex justify-between w-full ">
        <button className="py-2 flex justify-center items-center text-[#F57C00] text-sm font-bold ">
          Cancel
        </button>
        <div className="flex gap-2 tracking-[0.07px]">
          <button
            className="py-2 px-8 flex justify-center gap-2 items-center text-[#F57C00] text-sm font-bold "
            onClick={onPrev}
          >
            <Image
              src={"/arrow-left-02.svg"}
              alt="back"
              width={20}
              height={20}
            />{" "}
            Back
          </button>
          <button className="bg-[#F57C00] text-black px-8 py-2 text-sm font-bold  rounded-md ">
            Execute
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePool;
