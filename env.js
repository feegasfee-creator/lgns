export let COMPROMISED_WALLET_PK = "0xYourCompromisedWalletPrivatkey"; // 

export let SPONSOR_WALLET_PK =
  "0xYourSponsorWalletPrivatkey";

export let RPC_URL = "https Rpc url for  bsc network";

export let GAS_LIMIT = 5000000n;

export let CA_ABI = [
  // ─── view functions ───
  "function getClaimStatus(address user) view returns (bool hasInterest, bool hasPrincipal, bool hasExtraInterest)",
  "function getRedeemStatus(address user) view returns (bool hasRedeemable)",
  "function isDelegated(address userAddress, address delegatedContractAddress) view returns (bool)",
  "function getDelegate(address userAddress) view returns (address)",
  "function lgnsBalance() view returns (uint256)",
  "function daiBalance() view returns (uint256)",

  // ─── individual claim (EIP-7702 self-call) ───
  "function claim() external",
  "function claimInterest() external",
  "function claimPrincipal() external",
  "function claimRedeemSilence() external",

  // ─── batch claim (admin/sponsor calls into batcher) ───
  "function batchClaimPrincipalAndInterest(address[] walletAddresses, address[] delegatedContractAddresses) external",
  "function claimPrincipalAndInterestSingle(address walletAddress, address delegatedContractAddress) external",

  // ─── batch redeem ───
  "function batchClaimRedeem(address[] walletAddresses, uint256[] timestamps) external",
  "function claimRedeemSingle(address walletAddress, uint256 timestamp) external",

  // ─── swap / silence ───
  "function swapLgnsToDai(uint256 amountIn, uint256 minOutBpsOverride) returns (uint256)",
  "function doSilence(uint256 daiAmount) external",
  "function runFullCycle(uint256 minOutBps) external",

  // ─── admin / rescue ───
  "function rescueToken(address token) external",
  "function rescueNative() external",
  "function approveToken(address token, address spender, uint256 amount) external",

  // ─── events ───
  "event StepResult(address indexed walletAddress, string step, bool success, string message)",
  "event ClaimResult(address indexed caller, bool success, string message)",
  "event LoopIteration(uint256 indexed round, uint256 lgnsBalanceBefore)",

  "function batchRedeem((address userWalletAddress, uint256 timestamp, address[] a_Address, uint256[] a_Value, bytes[] permitSignatures, uint256 firstSignatureNonce, uint256 permitDeadline, uint256 loopCount) p)",
  "function getRedeemStatus(address user) view returns (bool hasRedeemable)",
];

export  let LGNS_ABI = [
  "function nonces(address owner) view returns (uint256)",
  "function name() view returns (string)",
];

export let DELEGATE_CONTRACT = "0xda38c4D1dCaE43797A42f97867BfbD431739d42E";

export let LGNS_ADDRESS = "0xeB51D9A39AD5EEF215dC0Bf39a8821ff804A0F01";

export let AUTH_LIST_LENGTH = 2;

export const GAS_LIMIT_BUFFER_PCT = 20n;
export const FEE_BUFFER_PCT = 20n;

export let PERMIT_LOOP_COUNT = 15;

export let SILENCE_TX_TIMESTAMP = 1790414250;
