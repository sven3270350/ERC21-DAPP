import { Button } from "@/components/ui/button";
import React from "react"
import useBulkAction from "@/hooks/useBulkAction";

const tokenAddress = "0xBd2E04Be415ec7517Cb8D110255923D2652Cbb79" as `0x${string}`;
const wallets = ["0x58Dc0daA59D9FcddA2E710602C01085504d14Dd6", "0x33c2629e03987F90D69Cf7FE49039418fb7f44EF"];
const amount = [60, 60]

const MultiToken: React.FC = () => {
  const { sendBulkToken, isLoading } = useBulkAction();

  const handleClick = async () => {
    const result = await sendBulkToken({tokenAddress,wallets,amount});
    console.log("~~~~~result~~~~~~", result)
  }

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      Send
    </Button>
  );
};

export default MultiToken;
