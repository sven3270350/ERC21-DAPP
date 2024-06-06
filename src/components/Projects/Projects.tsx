
import React, { useState } from "react";
import { Transfer } from "./Transfer/Transfer";
import { Tabs } from "./Tabs";
import { BuyPage } from "./Buy/page";

export const Projects = () => {
  const [status, setStatus] = useState("Buy");
  return (
    <div className="p-4">
      <Tabs setStatus={setStatus} status={status} />
      {status === "Buy" && <BuyPage />}
      {status === "Transfer" && <Transfer />}
    </div>
  );
};
