"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const ConnectWalletButton: React.FC = () => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, authenticationStatus, mounted, openChainModal, openAccountModal }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected = ready && account && chain;
        const isConnecting = authenticationStatus === "loading";

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
            className="w-full"
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    disabled={isConnecting}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                      isConnecting
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {isConnecting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Connecting...
                      </span>
                    ) : (
                      "Connect Wallet"
                    )}
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="w-full py-3 px-6 rounded-lg font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                  >
                    Wrong Network - Switch to Supported Chain
                  </button>
                );
              }

              return (
                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={openAccountModal}
                    className="w-full py-3 px-6 rounded-lg font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors duration-200 flex items-center justify-between"
                  >
                    <span>{account.displayName}</span>
                    <span className="text-xs bg-indigo-600 text-white py-1 px-2 rounded-full">
                      {account.displayBalance ? account.displayBalance : ""}
                    </span>
                  </button>

                  <button
                    onClick={openChainModal}
                    className="w-full py-2 px-4 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    {chain.iconUrl && (
                      <img alt={chain.name ?? "Chain icon"} src={chain.iconUrl} className="w-5 h-5 rounded-full" />
                    )}
                    {chain.name}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWalletButton;
