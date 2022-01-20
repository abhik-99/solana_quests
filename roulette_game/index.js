//Please note that the current project in here contains only the essential codes as I plan to build a react app around it instead of a CLI based app.

import {
    Connection,
    clusterApiUrl,
    PublicKey,
    Keypair,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import * as fs from 'fs';
import {getReturnAmount, totalAmtToBePaid, randomNumber} from './helper';

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// console.log("connection", connection);

//the keyPairs are stored in "{from/to}Wallet.json" and used from thereon out.
var keyPair = JSON.parse(fs.readFileSync('./fromWallet.json', "utf-8"));
const fromWalletPublicKey = Object.values(keyPair._keypair.publicKey);
const fromWalletSecretKey = Uint8Array.from(Object.values(keyPair._keypair.secretKey));

console.log("from wallet Public Key", new PublicKey(fromWalletPublicKey).toString());

const fromWallet = Keypair.fromSecretKey(fromWalletSecretKey);

// const toWallet = new Keypair();
// fs.writeFileSync('./toWallet.json', JSON.stringify(toWallet, null, 2), "utf-8" );
keyPair = JSON.parse(fs.readFileSync('./toWallet.json', "utf-8"));
const toWalletPublicKey = Object.values(keyPair._keypair.publicKey);
const toWalletSecretKey = Uint8Array.from(Object.values(keyPair._keypair.secretKey));
const toWallet = Keypair.fromSecretKey(toWalletSecretKey);

console.log("to Wallet public key", new PublicKey(toWalletPublicKey).toString());

//returns transaction signature
const transferSol = async (fromWallet, toWallet, transferAmt) => {
    try {
        // transaction flow in Solana is create connection -> create a transaction instance -> send and confirm the transaction signature
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const transaction = new Transaction()
        .add(
            SystemProgram.transfer({
                fromPubkey: fromWallet._keypair.publicKey,
                toPubkey: toWallet._keypair.publicKey,
                lamports: transferAmt * LAMPORTS_PER_SOL
            })
        );

        const signature = sendAndConfirmTransaction(
            connection,
            transaction,
            [fromWallet]
        );

        return signature;

    } catch (error) {
        console.log(error)
    }
};

//copied as is from quest
const getWalletBalance = async (pubk)=>{
    try{
        const connection=new Connection(clusterApiUrl("devnet"),"confirmed");
        const balance=await connection.getBalance(new PublicKey(pubk));
        return balance/LAMPORTS_PER_SOL;
    }catch(err){
        console.log(err);
    }
}