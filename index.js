import React from 'react';
import AppViews from './views/AppViews';
import DeployerViews from './views/DeployerViews';
import AttacherViews from './views/AttacherViews';
import {renderDOM, renderView} from './views/render';
import './index.tailwindcss';
import { ALGO_MakeWalletConnect as MakeWalletConnect } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import { loadStdlib } from '@reach-sh/stdlib';
const reach = loadStdlib(process.env);


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {view: 'ConnectAccount', ...defaults};
  }
}

class Bidder extends React.Component {
  random() { return reach.hasRandom.random(); }
  async getNFT() { // Fun([], UInt)
    const NFT = await new Promise(setNFT => {
      this.setState({view: 'GetNFT'});
    });
    this.setState({view: 'requestNFT'});
    return getNFT[NFT];
  }
  showOutcome(i) { this.setState({view: 'Done', outcome: intToOutcome[i]}); }
  sellNFT(NFT) { this.state.resolveNFTP(NFT); }
}

class Deployer extends Bidder {
  constructor(props) {
    super(props);
    this.state = {view: 'sellNFT'};
  }
  setrequest(request) { this.setState({view: 'Deploy', request}); }
  async deploy() {
    const ctc = this.props.acc.contract(backend);
    this.setState({view: 'Deploying', ctc});
    this.request = reach.parseCurrency(this.state.request); // UInt
    this.deadline = {ETH: 10, ALGO: 100, CFX: 1000}[reach.connector]; // UInt
    backend.Creator(ctc, this);
    const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
    this.setState({view: 'WaitingForAttacher', ctcInfoStr});
  }
  render() { return renderView(this, DeployerViews); }
}
class Attacher extends Bidder {
  constructor(props) {
    super(props);
    this.state = {view: 'Attach'};
  }
  attach(ctcInfoStr) {
    const ctc = this.props.acc.contract(backend, JSON.parse(ctcInfoStr));
    this.setState({view: 'Attaching'});
    backend.Bidder(ctc, this);
  }
  
  render() { return renderView(this, AttacherViews); }
}

renderDOM(<App />);