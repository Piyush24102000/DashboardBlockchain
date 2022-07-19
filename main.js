const serverUrl = "https://jp0ydagmrkfd.usemoralis.com:2053/server";
const appId = "r9U29SkDeDlGocQDQvzKrU7aLvHHZuyOUqpWcXn2";
Moralis.start({ serverUrl, appId });

login = async () => { //To start up metamask
    await Moralis.authenticate().then(async function (user) {
        console.log(user.get('ethAddress'))
        //To store in database
        user.set("name", document.getElementById("user-name").value);
        user.set("email", document.getElementById("email-address").value);
        await user.save();
        //To route page to new location
        window.location.href = "../dashboard/dashboard.html";
    })
}
logout = async () => {
    await Moralis.User.logOut();
    window.location.href = "../signin/signin.html";
}

getTransactions = async () => {
    const options = {
        chain: "rinkeby",
        address: "0xd4d7a69AfF0960ed5f1F313Ba97D397315671990",
    };
    const transactions = await Moralis.Web3API.account.getTransactions(options);
    console.log(transactions);
    ///////////Table for display///////////
    if (transactions.total > 0) {
        let table = `<table class="table">
                <thead>
                    <tr>
                        <th scope="col">Transaction</th>
                        <th scope="col">Block Number</th>
                        <th scope="col">Age</th>
                        <th scope="col">Type</th>
                        <th scope="col">Fee</th>
                        <th scope="col">value</th>
                    </tr>
                </thead>
                <tbody id="tabletransactions"></tbody>
            </table>
            `
        document.querySelector("#tableOfTransactions").innerHTML = table;

        transactions.result.forEach(t => {
            let content = ` <tr>
                            <td><a href="https://rinkeby.etherscan.io/tx/${t.hash}" target="_blank" rel="noopener norferrer">${t.hash}</a></td>
                            <td><a href="https://rinkeby.etherscan.io/block/${t.block_number}" target="_blank" rel="noopener norferrer">${t.block_number}</a></td>
                            <td>${t.block_timestamp}</td>
                            <td>${t.from_address == Moralis.User.current().get('ethAddress') ? "Outgoing" : "Incoming"}</td>
                            <td>${((t.gas * t.gas_price) / 1e18).toFixed(5)} ETH</td>
                            <td>${(t.value / 1e18.toFixed(5))} ETH</td>
                            </tr> 
                        `
            tabletransactions.innerHTML += content; //use innerhtml to feed the data
        })
    }
}

getBalances = async () => {
    const options = {
        chain: "rinkeby",
        address: "0xd4d7a69AfF0960ed5f1F313Ba97D397315671990",
    };
    const rinki = await Moralis.Web3API.account.getNativeBalance(options);

    const options1 = {
        chain: "ropsten",
        address: "0xd4d7a69AfF0960ed5f1F313Ba97D397315671990",
    };
    const ropsten = await Moralis.Web3API.account.getNativeBalance(options1);

    const options2 = {
        chain: "kovan",
        address: "0xd4d7a69AfF0960ed5f1F313Ba97D397315671990",
    };
    const kovan = await Moralis.Web3API.account.getNativeBalance(options2);

    let table1 = `<table class="table">
                <thead>
                    <tr>
                        <th scope="col">Token</th>
                        <th scope="col">Balance</th>
                        
                    </tr>
                </thead>
                <tbody id="tablebalance"></tbody>
            </table>
            `
    document.querySelector("#userBalances").innerHTML = table1;

    let content1 = `<tr>
                        <td>Rinkeby</td>
                        <td>${(rinki.balance / 1e18).toFixed(5) + "ETH"}</td>
                    </tr>
                    <tr>
                        <td>Ropsten</td>
                        <td>${(ropsten.balance / 1e18).toFixed(5) + "ETH"}</td>
                    </tr>
                    <tr>
                        <td>Kovan</td>
                        <td>${(kovan.balance / 1e18).toFixed(5) + "ETH"}</td>
                    </tr>
    `
    tablebalance.innerHTML += content1; //Use this with reference to table
}

getNFTs = async () => {
    const nfts = await Moralis.Web3API.account.getNFTs({ chain: 'rinkeby' });
    console.log(nfts)
    
    if (nfts.result.length > 0) {
        nfts.result.forEach(n => {
            let metadata = (JSON.parse(n.metadata));
            console.log(JSON.parse(n.metadata));
            
            let nftcards = `
            <div class="card" style="width: 20rem;">
            <img src="${metadata.image}" class="card-img-top" height = 250>
            <div class="card-body">
            <h3 class="card-title">${metadata.name}</h3>
            <p class="card-text">${metadata.description}</p>
            </div>
            </div>
            `
            document.querySelector("#tableofNFTs").innerHTML = nftcards;
        })
    }
}
//To fire event when clicked on submit
if (document.querySelector("#btn-login") != null) {
    document.querySelector("#btn-login").onclick = login;
}
if (document.querySelector("#signout") != null) {
    document.querySelector("#signout").onclick = logout;
}
if (document.querySelector("#get-transaction-link") != null) {
    document.querySelector("#get-transaction-link").onclick = getTransactions;
}
if (document.querySelector("#get-Balances-link") != null) {
    document.querySelector("#get-Balances-link").onclick = getBalances;
}
if (document.querySelector("#get-NFTs-link") != null) {
    document.querySelector("#get-NFTs-link").onclick = getNFTs;
}