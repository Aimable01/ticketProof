"use client";

import { useAccount } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";

export default function Home() {
  const { address: connectedAddress } = useAccount();

  return (
    <div>
      <Address address={connectedAddress} />
      <Balance address={connectedAddress} />
    </div>
  );
}
