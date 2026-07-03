// Verified ABI of the ConfidentialTokenWrappersRegistry implementation
// (proxy 0x2f0750Bbb0A246059d80e94c454586a7F27a128e -> impl 0x50c271e25ee953dd21e916311db81e228c9bdb59)
// Source: Sourcify exact_match, Sepolia (chain 11155111)

export const registryAbi = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "AddressEmptyCode",
    "type": "error",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "ConfidentialTokenAlreadyAssociatedWithToken",
    "type": "error",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "existingConfidentialTokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "ConfidentialTokenDoesNotSupportERC165",
    "type": "error",
    "inputs": [
      {
        "name": "confidentialTokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "ConfidentialTokenZeroAddress",
    "type": "error",
    "inputs": []
  },
  {
    "name": "ERC1967InvalidImplementation",
    "type": "error",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "ERC1967NonPayable",
    "type": "error",
    "inputs": []
  },
  {
    "name": "FailedCall",
    "type": "error",
    "inputs": []
  },
  {
    "name": "FromIndexGreaterOrEqualToIndex",
    "type": "error",
    "inputs": [
      {
        "name": "fromIndex",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "toIndex",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "name": "InvalidInitialization",
    "type": "error",
    "inputs": []
  },
  {
    "name": "NoTokenAssociatedWithConfidentialToken",
    "type": "error",
    "inputs": [
      {
        "name": "confidentialTokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "NotERC7984",
    "type": "error",
    "inputs": [
      {
        "name": "confidentialTokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "NotInitializing",
    "type": "error",
    "inputs": []
  },
  {
    "name": "OwnableInvalidOwner",
    "type": "error",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "OwnableUnauthorizedAccount",
    "type": "error",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "RevokedConfidentialToken",
    "type": "error",
    "inputs": [
      {
        "name": "confidentialTokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "TokenAlreadyAssociatedWithConfidentialToken",
    "type": "error",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "existingConfidentialTokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "TokenNotRegistered",
    "type": "error",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "TokenZeroAddress",
    "type": "error",
    "inputs": []
  },
  {
    "name": "UUPSUnauthorizedCallContext",
    "type": "error",
    "inputs": []
  },
  {
    "name": "UUPSUnsupportedProxiableUUID",
    "type": "error",
    "inputs": [
      {
        "name": "slot",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "name": "ConfidentialTokenRegistered",
    "type": "event",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "confidentialTokenAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "name": "ConfidentialTokenRevoked",
    "type": "event",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "confidentialTokenAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "name": "Initialized",
    "type": "event",
    "inputs": [
      {
        "name": "version",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "name": "OwnershipTransferStarted",
    "type": "event",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "name": "OwnershipTransferred",
    "type": "event",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "name": "Upgraded",
    "type": "event",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "name": "UPGRADE_INTERFACE_VERSION",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "acceptOwnership",
    "type": "function",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "getConfidentialTokenAddress",
    "type": "function",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "getTokenAddress",
    "type": "function",
    "inputs": [
      {
        "name": "confidentialTokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "getTokenConfidentialTokenPair",
    "type": "function",
    "inputs": [
      {
        "name": "index",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "components": [
          {
            "name": "tokenAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "confidentialTokenAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "isValid",
            "type": "bool",
            "internalType": "bool"
          }
        ],
        "internalType": "struct ConfidentialTokenWrappersRegistry.TokenWrapperPair"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "getTokenConfidentialTokenPairs",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "components": [
          {
            "name": "tokenAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "confidentialTokenAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "isValid",
            "type": "bool",
            "internalType": "bool"
          }
        ],
        "internalType": "struct ConfidentialTokenWrappersRegistry.TokenWrapperPair[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "getTokenConfidentialTokenPairsLength",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "getTokenConfidentialTokenPairsSlice",
    "type": "function",
    "inputs": [
      {
        "name": "fromIndex",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "toIndex",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "components": [
          {
            "name": "tokenAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "confidentialTokenAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "isValid",
            "type": "bool",
            "internalType": "bool"
          }
        ],
        "internalType": "struct ConfidentialTokenWrappersRegistry.TokenWrapperPair[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "getTokenIndex",
    "type": "function",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "initialize",
    "type": "function",
    "inputs": [
      {
        "name": "initialOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "isConfidentialTokenValid",
    "type": "function",
    "inputs": [
      {
        "name": "confidentialTokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "owner",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "pendingOwner",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "proxiableUUID",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "registerConfidentialToken",
    "type": "function",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "confidentialTokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "renounceOwnership",
    "type": "function",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "revokeConfidentialToken",
    "type": "function",
    "inputs": [
      {
        "name": "confidentialTokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "transferOwnership",
    "type": "function",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "upgradeToAndCall",
    "type": "function",
    "inputs": [
      {
        "name": "newImplementation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  }
] as const;
