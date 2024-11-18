import {useState, useEffect, use} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [amount, setAmount] = useState(undefined);
  const [transactionFee, setTransactionFee] = useState(0); 

  // State for held items
  const [heldItem1, setHeldItem1] = useState(0);
  const [heldItem2, setHeldItem2] = useState(0);
  const [heldItem3, setHeldItem3] = useState(0);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // Once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);

    atmContract.on("Deposit", (amount, fee) => {
      console.log("Deposit event detected: ", { amount: amount.toString(), fee: fee.toString() });
      setTransactionFee(fee.toString()); // Convert BigNumber to a string
    });
    
    atmContract.on("Withdraw", (amount, fee) => {
      console.log("Withdraw event detected: ", { amount: amount.toString(), fee: fee.toString() });
      setTransactionFee(fee.toString()); // Convert BigNumber to a string
    });
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(amount);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(amount);
      await tx.wait();
      getBalance();
    }
  };

  // Buy item functions
  const buyItem1 = async () => {
    const price = 5; // 5 ETH
    if (balance >= price) {
      // Deduct balance
      let tx = await atm.withdraw(price); // Adjust logic if interacting with contract
      await tx.wait();
      setHeldItem1(heldItem1 + 1); // Increment item count
      getBalance(); // Refresh balance
    } else {
      alert("Insufficient funds to buy Item 1!");
    }
  };

  const buyItem2 = async () => {
    const price = 10; // 10 ETH
    if (balance >= price) {
      let tx = await atm.withdraw(price);
      await tx.wait();
      setHeldItem2(heldItem2 + 1);
      getBalance();
    } else {
      alert("Insufficient funds to buy Item 2!");
    }
  };

  const buyItem3 = async () => {
    const price = 20; // 20 ETH
    if (balance >= price) {
      let tx = await atm.withdraw(price);
      await tx.wait();
      setHeldItem3(heldItem3 + 1);
      getBalance();
    } else {
      alert("Insufficient funds to buy Item 3!");
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this ATM.</p>;
    }

    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your MetaMask wallet
        </button>
      );
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>

        <div>
          <label htmlFor="amount">Enter amount (ETH): </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
          />
        </div>

        <button onClick={deposit}>Deposit</button>
        <button onClick={withdraw}>Withdraw</button>

        <div>
          <p>Fee for transaction: {transactionFee} ETH</p>
        </div>

        <div>
          <p>
            1. Buy Item 1 <button onClick={buyItem1}>5 ETH</button>
          </p>
          <p>
            2. Buy Item 2 <button onClick={buyItem2}>10 ETH</button>
          </p>
          <p>
            3. Buy Item 3 <button onClick={buyItem3}>20 ETH</button>
          </p>
        </div>

        <div>
          <p>Held Item 1: {heldItem1}</p>
          <p>Held Item 2: {heldItem2}</p>
          <p>Held Item 3: {heldItem3}</p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
