import { 
    clusterApiUrl, 
    Connection, 
    PublicKey, 
    Keypair, 
    LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import { 
    createMint, 
    getOrCreateAssociatedTokenAccount, 
    mintTo, 
    transfer, 
    Account, 
    getMint, 
    getAccount
} from '@solana/spl-token';

// Special setup to add a Buffer class, because it's missing
window.Buffer = window.Buffer || require("buffer").Buffer;

function MintToken() {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    // Generate a new wallet keypair and airdrop SOL
    const fromWallet = Keypair.generate();
    // Public Key to your Phantom Wallet
    const toWallet = new PublicKey("BiSrbYSwGJUe4FnPeLTUCkKJ6Nw89DoZbDbXk4VUStnu");
	let fromTokenAccount: Account; 
	let mint: PublicKey;

    async function createToken() {
        const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
        await connection.confirmTransaction(fromAirdropSignature);
    
        // Create new token mint
        mint = await createMint(
            connection, 
            fromWallet, 
            fromWallet.publicKey, 
            null, 
            9 // 9 here means we have a decmial of 9 0's
        );
        console.log(`Create token: ${mint.toBase58()}`);
    
        // Get the token account of the fromWallet address, and if it does not exist, create it
        fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mint,
            fromWallet.publicKey
        );
        console.log(`Create Token Account: ${fromTokenAccount.address.toBase58()}`);
    }

    async function mintToken() {      
        // Mint 1 new token to the "fromTokenAccount" account we just created
        const signature = await mintTo(
            connection,
            fromWallet,
            mint,
            fromTokenAccount.address,
            fromWallet.publicKey,
            10000000000 // 10 billion
        );
        console.log(`Mint signature: ${signature}`);
    }

    async function checkBalance() {
        // get the supply of tokens we have minted into existance
        const mintInfo = await getMint(connection, mint);
		console.log(mintInfo.supply);
		
		// get the amount of tokens left in the account
        const tokenAccountInfo = await getAccount(connection, fromTokenAccount.address);
		console.log(tokenAccountInfo.amount);
    }

    async function sendToken() {
        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet);
        console.log(`toTokenAccount ${toTokenAccount.address}`);
        console.log(`fromTokenAccount ${fromTokenAccount.address}`);

        const signature = await transfer(
            connection,
            fromWallet,
            fromTokenAccount.address,
            toTokenAccount.address,
            fromWallet.publicKey,
            1000000000 // 1 billion
        );
        console.log(`finished transfer with ${signature}`);
    }
    
    return (
        <div>
            <h1> Token Creation</h1>
            <div style={{display:'flex' , flexDirection: "column" }}>
                <button onClick={createToken} style={{margin:'5px' , height:'30px' , backgroundColor:'black' , color:'white'}}>Create token</button>
                <button onClick={mintToken} style={{margin:'5px' , height:'30px' , backgroundColor:'black' , color:'white'}}>Mint token</button>
                <button onClick={checkBalance}style={{margin:'5px' , height:'30px' , backgroundColor:'black' , color:'white'}}>Check balance</button>
                <button onClick={sendToken}style={{margin:'5px' , height:'30px' , backgroundColor:'black' , color:'white'}}>Send token</button>
            </div>
        </div>
    );
}

export default MintToken;
