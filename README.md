# Metacrafters ETH + Avax JavaScript Smart Contract Frontend Project

This is a submission for the Metacrafters ETH + Avax JavaScript Smart Contract Frontend module. This code has various additional functions added on top of the sample provided by Metacrafters.

## How to use

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/

## Functions

The Smart Contract of the original has been modified, and it now has a 2% fee added onto every deposit and withdrawal. The Smart contract follows the requirements of the module project because it has three functions; getBalance, deposit, and withdraw. It also displays all the values of the functions from the smart contract in the JavaScript front end.

The JavaScript frontend has more additional features. It also calculates the fee deducted from the transactions and displays that fee in the front end. The front end also allows the deposit or withdrawal of a given number of ETH, rather than the one by one transactions of the original front end. It also allows the user to purchase items using the deposited ETH, and it will reduce the corresponding amount of ETH for each item, and increment the held items.
