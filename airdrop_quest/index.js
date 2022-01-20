const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    Account
} = require("@solana/web3.js");

const fs = require("fs");

// const newPair = new Keypair();
// const pubKey = new PublicKey(newPair.publicKey).toString();
// const secretKey = newPair.secretKey;

// console.log("key Pair", newPair);
// console.log("stringified", JSON.stringify(newPair));

// fs.writeFileSync('./keyPair.json', JSON.stringify(newPair, null, 2), "utf-8" );

//the keyPair is stored in "keypair.json" and used from thereon out.
var keyPair = JSON.parse(fs.readFileSync('./keyPair.json', "utf-8"));

keyPair._keypair.publicKey = Object.values(keyPair._keypair.publicKey);
keyPair._keypair.secretKey = Object.values(keyPair._keypair.secretKey);

const {secretKey, publicKey} = keyPair._keypair;
console.log("public key read from file", new PublicKey(publicKey).toString())

const getWalletBalance = async () => {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const myWallet = await Keypair.fromSecretKey( Uint8Array.from(secretKey));
        const walletBal = await connection.getBalance(new PublicKey(myWallet._keypair.publicKey));
        console.log(`Wallet balance for ${new PublicKey(publicKey).toString()} is ${walletBal/LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

const airDropSol = async () => {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const walletKeyPair = await Keypair.fromSecretKey(Uint8Array.from(secretKey));
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(walletKeyPair._keypair.publicKey),
            2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err)
    }
}
const driverFunction = async () => {
    await getWalletBalance();
    // await airDropSol();
    // await getWalletBalance();
};

driverFunction();
