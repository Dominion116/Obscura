// Verified ABI of the ERC7984 confidential wrapper implementation
// (e.g. cUSDCMock proxy 0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639 -> impl 0x390aa02fb7eba565bfcfc43f67db7e4d05c1d0ee)
// Source: Sourcify exact_match, Sepolia (chain 11155111)

export const wrapperAbi = [
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
    "name": "BlockedUser",
    "type": "error",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      }
    ]
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
    "name": "ERC7984InvalidReceiver",
    "type": "error",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "ERC7984InvalidReceiver",
    "type": "error",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "ERC7984InvalidSender",
    "type": "error",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "ERC7984TotalSupplyOverflow",
    "type": "error",
    "inputs": []
  },
  {
    "name": "ERC7984UnauthorizedCaller",
    "type": "error",
    "inputs": [
      {
        "name": "caller",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "ERC7984UnauthorizedSpender",
    "type": "error",
    "inputs": [
      {
        "name": "holder",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "ERC7984UnauthorizedUseOfEncryptedAmount",
    "type": "error",
    "inputs": [
      {
        "name": "amount",
        "type": "bytes32",
        "internalType": "euint64"
      },
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "ERC7984ZeroBalance",
    "type": "error",
    "inputs": [
      {
        "name": "holder",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "FailedCall",
    "type": "error",
    "inputs": []
  },
  {
    "name": "InvalidInitialization",
    "type": "error",
    "inputs": []
  },
  {
    "name": "InvalidKMSSignatures",
    "type": "error",
    "inputs": []
  },
  {
    "name": "InvalidUnderlyingDenyListResponse",
    "type": "error",
    "inputs": []
  },
  {
    "name": "InvalidUnwrapRequest",
    "type": "error",
    "inputs": [
      {
        "name": "unwrapRequestId",
        "type": "bytes32",
        "internalType": "bytes32"
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
    "name": "SafeCastOverflowedUintDowncast",
    "type": "error",
    "inputs": [
      {
        "name": "bits",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "name": "SafeERC20FailedOperation",
    "type": "error",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "SenderNotAllowedToUseHandle",
    "type": "error",
    "inputs": [
      {
        "name": "handle",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ]
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
    "name": "UnderlyingDenyListCallFailed",
    "type": "error",
    "inputs": []
  },
  {
    "name": "UnderlyingDenyListedAddress",
    "type": "error",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "UserAlreadyBlocked",
    "type": "error",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "UserAlreadyUnblocked",
    "type": "error",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "ZamaProtocolUnsupported",
    "type": "error",
    "inputs": []
  },
  {
    "name": "AmountDiscloseRequested",
    "type": "event",
    "inputs": [
      {
        "name": "encryptedAmount",
        "type": "bytes32",
        "indexed": true,
        "internalType": "euint64"
      },
      {
        "name": "requester",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "name": "AmountDisclosed",
    "type": "event",
    "inputs": [
      {
        "name": "encryptedAmount",
        "type": "bytes32",
        "indexed": true,
        "internalType": "euint64"
      },
      {
        "name": "amount",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "name": "ConfidentialTransfer",
    "type": "event",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "bytes32",
        "indexed": true,
        "internalType": "euint64"
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
    "name": "OperatorSet",
    "type": "event",
    "inputs": [
      {
        "name": "holder",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "operator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "until",
        "type": "uint48",
        "indexed": false,
        "internalType": "uint48"
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
    "name": "PublicDecryptionVerified",
    "type": "event",
    "inputs": [
      {
        "name": "handlesList",
        "type": "bytes32[]",
        "indexed": false,
        "internalType": "bytes32[]"
      },
      {
        "name": "abiEncodedCleartexts",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "name": "UnwrapFinalized",
    "type": "event",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "unwrapRequestId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "encryptedAmount",
        "type": "bytes32",
        "indexed": false,
        "internalType": "euint64"
      },
      {
        "name": "cleartextAmount",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "name": "UnwrapRequested",
    "type": "event",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "unwrapRequestId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "amount",
        "type": "bytes32",
        "indexed": false,
        "internalType": "euint64"
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
    "name": "UserBlocked",
    "type": "event",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "name": "UserUnblocked",
    "type": "event",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "name": "Wrap",
    "type": "event",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "roundedAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "encryptedWrappedAmount",
        "type": "bytes32",
        "indexed": false,
        "internalType": "euint64"
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
    "name": "blockUser",
    "type": "function",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "confidentialBalanceOf",
    "type": "function",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "euint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "confidentialProtocolId",
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
    "name": "confidentialTotalSupply",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "euint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "confidentialTransfer",
    "type": "function",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "encryptedAmount",
        "type": "bytes32",
        "internalType": "externalEuint64"
      },
      {
        "name": "inputProof",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "euint64"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "name": "confidentialTransfer",
    "type": "function",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "bytes32",
        "internalType": "euint64"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "euint64"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "name": "confidentialTransferAndCall",
    "type": "function",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "bytes32",
        "internalType": "euint64"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "transferred",
        "type": "bytes32",
        "internalType": "euint64"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "name": "confidentialTransferAndCall",
    "type": "function",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "encryptedAmount",
        "type": "bytes32",
        "internalType": "externalEuint64"
      },
      {
        "name": "inputProof",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "transferred",
        "type": "bytes32",
        "internalType": "euint64"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "name": "confidentialTransferFrom",
    "type": "function",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "encryptedAmount",
        "type": "bytes32",
        "internalType": "externalEuint64"
      },
      {
        "name": "inputProof",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "transferred",
        "type": "bytes32",
        "internalType": "euint64"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "name": "confidentialTransferFrom",
    "type": "function",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "bytes32",
        "internalType": "euint64"
      }
    ],
    "outputs": [
      {
        "name": "transferred",
        "type": "bytes32",
        "internalType": "euint64"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "name": "confidentialTransferFromAndCall",
    "type": "function",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "encryptedAmount",
        "type": "bytes32",
        "internalType": "externalEuint64"
      },
      {
        "name": "inputProof",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "transferred",
        "type": "bytes32",
        "internalType": "euint64"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "name": "confidentialTransferFromAndCall",
    "type": "function",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "bytes32",
        "internalType": "euint64"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "transferred",
        "type": "bytes32",
        "internalType": "euint64"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "name": "contractURI",
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
    "name": "decimals",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "discloseEncryptedAmount",
    "type": "function",
    "inputs": [
      {
        "name": "encryptedAmount",
        "type": "bytes32",
        "internalType": "euint64"
      },
      {
        "name": "cleartextAmount",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "decryptionProof",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "finalizeUnwrap",
    "type": "function",
    "inputs": [
      {
        "name": "unwrapRequestId",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "unwrapAmountCleartext",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "decryptionProof",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "getUnderlyingDenyListSelector",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "isSet",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "selector",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "inferredTotalSupply",
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
    "name": "initialize",
    "type": "function",
    "inputs": [
      {
        "name": "name_",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "symbol_",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "contractURI_",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "underlying_",
        "type": "address",
        "internalType": "contract IERC20"
      },
      {
        "name": "owner_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "isBlocked",
    "type": "function",
    "inputs": [
      {
        "name": "user",
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
    "name": "isOperator",
    "type": "function",
    "inputs": [
      {
        "name": "holder",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "spender",
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
    "name": "maxTotalSupply",
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
    "name": "name",
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
    "name": "onTransferReceived",
    "type": "function",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "nonpayable"
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
    "name": "rate",
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
    "name": "reinitializeV2",
    "type": "function",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "reinitializeV3",
    "type": "function",
    "inputs": [
      {
        "name": "blockedUsers",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "underlyingDenyListSelector",
        "type": "bytes4",
        "internalType": "bytes4"
      },
      {
        "name": "hasUnderlyingDenyListSelector_",
        "type": "bool",
        "internalType": "bool"
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
    "name": "requestDiscloseEncryptedAmount",
    "type": "function",
    "inputs": [
      {
        "name": "encryptedAmount",
        "type": "bytes32",
        "internalType": "euint64"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "setOperator",
    "type": "function",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "until",
        "type": "uint48",
        "internalType": "uint48"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "supportsInterface",
    "type": "function",
    "inputs": [
      {
        "name": "interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
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
    "name": "symbol",
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
    "name": "unblockUser",
    "type": "function",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "underlying",
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
    "name": "unwrap",
    "type": "function",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "encryptedAmount",
        "type": "bytes32",
        "internalType": "externalEuint64"
      },
      {
        "name": "inputProof",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "name": "unwrap",
    "type": "function",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "bytes32",
        "internalType": "euint64"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "name": "unwrapAmount",
    "type": "function",
    "inputs": [
      {
        "name": "unwrapRequestId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "euint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "unwrapRequester",
    "type": "function",
    "inputs": [
      {
        "name": "unwrapRequestId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
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
  },
  {
    "name": "wrap",
    "type": "function",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "euint64"
      }
    ],
    "stateMutability": "nonpayable"
  }
] as const;
