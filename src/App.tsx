
import './App.css';
import MintToken from './MintToken';
import MintNft from './MintNft';
import SendSol from './SendSol';
import WalletConnect from './WalletConnect';

function App() {
	return (
		<div className="App">
		<header className="App-header">
			<WalletConnect/>
			
			<div className="App-center">
				<div style={{margin:"150px"}}>
				<MintToken  />
				</div>
		  		<div style={{margin:"150px"}}>
				  <MintNft />
				</div>
				<div style={{margin:"150px"}}>
				  <SendSol />
				</div>
			</div>
		</header>
		</div>
	);
}

export default App;
