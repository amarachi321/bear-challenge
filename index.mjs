import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import { ask, yesno } from '@reach-sh/stdlib/ask.mjs';

const stdlib = loadStdlib();
const startingBalance = stdlib.parseCurrency(100);


const name1 = "House"
const min_follows = parseInt(500000)
const name2 = await ask(`You are the First influencer, what's your name: `)
const name3 = await ask(`You are the Second influencer, what's your name:`)

const name2_followers = await ask(`${name2} enter the amount of followers you have on instagram`)
const name3_followers = await ask(`${name3} enter the amount of followers you have on instagram`)

console.log(`Welcome ${name2} and ${name3}\nwe plan on whitelisting one of you to get our nft based on the amount of followers you have `)

const acc1 = await stdlib.newTestAccount(startingBalance);
const acc2 = await stdlib.newTestAccount(startingBalance);
const acc3 = await stdlib.newTestAccount(startingBalance);

const mynft = await stdlib.launchToken(acc1, "mynft", "Mnft", { supply: 1 });
const ctc1 = acc1.contract(backend);
const ctc2 = acc2.contract(backend, ctc1.getInfo())
const ctc3 = acc3.contract(backend, ctc1.getInfo())

const getnftbalance = async (acc, name) => {
    const amtofNFT = await stdlib.balanceOf(acc, mynft.id);
    console.log(`${name} has ${amtofNFT} tokens`)
}

await getnftbalance(acc1, name1)
await getnftbalance(acc2, name2)
await getnftbalance(acc3, name3)
await acc2.tokenAccept(mynft.id)
await acc3.tokenAccept(mynft.id)
console.log(`Both influencers accepted tokens`)
await Promise.all([
    ctc1.p.House({
        min_followers: min_follows,
        whitlisted_address: async (add) => {
            console.log(`Address whitelisted : ${add} `)
        },
        nft: mynft.id

    }),
    ctc2.p.Person1({
        follower_amt: parseInt(name2_followers),
    }),
    ctc3.p.Person2({
        follower_amt: parseInt(name3_followers),
    }),

]);

await getnftbalance(acc1, name1)
await getnftbalance(acc2, name2)
await getnftbalance(acc3, name3)
console.log(`Nft information:\n name: ${mynft.name}\nid: ${mynft.id}`)
