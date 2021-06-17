# Token-AirDrop-Example
+-TUTORIAL OF THIS AIRDROP D.APP. AND WEBSITE:_ https://youtu.be/YXsMgSgE_Pw

+-You can connect your Metamask Wallet and claim free Tokens.

## +-To run the Demo Project:_

+-(1)-The first things you need to do are cloning this repository and installing its
dependencies:

```sh
npm install
```

+-(2)-Once installed, let's run Truffle's testing local network:

```sh
truffle develop
```

+-(3)-Then, on the same terminal, go to where it says "truffle(develop)> ..." and run this to Deploy your Smart Contracts(Don't Close This Terminal, you will need it Later):

```sh
migrate --reset
```

+-(4)-Finally, on another terminal, you go to the "airdrop" Folder with "cd airdrop/" and run this to run the Back-End and Front-End of the App:_

```sh
cd airdrop/
npm install
npm run dev
```
+-And then you will see the Website running in your WebBrowser LocalHost.

## +-To Test:_
+-(1)-Connect Ganache/Truffle with Metamask and create a Test Account:_ 
https://www.linkedin.com/pulse/using-ganache-ethereum-emulator-metamask-farhan-khan/

+-(2)-Login with the Metamask-Ganache Trial Account on the Page.

+-(3)-Add the Demo Token to the Metamask Wallet with the Address and Info you can find in the Logs of the Deployment with Truffle in the First Terminal you Opened.