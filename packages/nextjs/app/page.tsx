"use client";

import ConnectWalletButton from "~~/components/ConnectWalletButton";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="flex flex-col gap-6 items-center justify-center p-8 bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <h1 className="font-bold text-4xl text-indigo-600">TicketProof</h1>
        <p className="text-gray-600 text-center text-lg">
          Welcome to a secure, tamper-proof ticket system powered by blockchain
        </p>
        <div className="w-full mt-4">
          <ConnectWalletButton />
        </div>
      </div>
    </div>
  );
}
