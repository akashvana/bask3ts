import { Wallet } from "ethers";


function Mywallet() {

    async function requestAccount() {
        console.log('Requesting account...');

        if(window.ethereum) {
        console.log('detected');

        try {
            const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
            });
            // setWalletAddress(accounts[0]);
            console.log(accounts[0])
        } catch (error) {
            console.log('Error connecting...');
        }

        } else {
        alert('Meta Mask not detected');
        }
    }
    async function connectWallet() {
        if(typeof window.ethereum !== 'undefined') {
        await requestAccount();

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        }
    }

    return (
        <div className="App">
            <button
            
            onClick={requestAccount}
            
            >Request Account</button>
            {/* <h3>Wallet Address: {walletAddress}</h3> */}
        </div>
    );
}

export default Mywallet;