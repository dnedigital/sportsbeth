import React, { Component } from 'react';
import Nav from './Nav';
import SimpleStorageContract from '../truffle/build/contracts/SimpleStorage.json'
import { getNflBetsApi } from '../utils/bets-api';
import getWeb3 from '../utils/getWeb3'
import { default as contract } from 'truffle-contract'


class Bets extends Component {

  constructor(props) {
    super(props)

    this.state = {
      bets: [],
      storageValue: 0,
      web3: null,
      web3_account: null,
      web3_balance: 0.0,
      simpleStorage: null
    };
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3.then(results => {
      this.setState({ web3: results.web3  })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    }).catch(() => {  
      console.log('Error finding web3.')  
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    console.log("instantiateContract()");

    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)
    //dirty hack for web3@1.0.0 support for localhost testrpc, see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
    if (typeof simpleStorage.currentProvider.sendAsync !== "function") {
      simpleStorage.currentProvider.sendAsync = function () {
        return simpleStorage.currentProvider.send.apply(
          simpleStorage.currentProvider, arguments
        );
      };
    }

    //Set simpleStorage state var so we can use it elsewhere
    this.setState({simpleStorage: simpleStorage});

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance


    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      console.log("web3.eth.getAccounts()  = " + accounts[0]);
      this.setState ({
        web3_account: accounts[0]
      })

      // Get user balance via web3
      this.getWeb3Balance()

      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        //console.log("simpleStorage.deployed() = true");

        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(5, { from: accounts[0] })
      }).then((result) => {

        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call({ from: accounts[0] })
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
    })
  }

  getWeb3Balance() {
    var web3 = this.state.web3
    var address = this.state.web3_account
    return web3.eth.getBalance(address, (error, result) => {
      if (!error) {
        var balance = web3.utils.fromWei(result, "ether")
        console.log(balance)

        this.setState({ web3_balance: balance })
      } else {
        console.error(error);
      }
    })
  }

  componentDidMount() {
    this.getNflBets();
  }

  getNflBets() {
    getNflBetsApi().then((bets) => {
      this.setState({ bets });
    });
  }

  placeBetOnClick(id, odd_1, odd_2) {
    console.log("Place Bet - onClick");
    console.log("bet.id = " + id + " / odd_1 = " + odd_1 + " / odd_2 " + odd_2);
    //web3 make tx and pass these params

    var simpleStorageInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      console.log("web3.eth.getAccounts()  = " + accounts[0]);
      this.state.simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        //console.log("simpleStorage.deployed() = true");

        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(odd_1, { from: accounts[0] })
      }).then((result) => {

        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call({ from: accounts[0] })
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
    })
  }

  render() {

    const { bets } = this.state;

    return (
      <div>
        <Nav web3_balance= { this.state.web3_balance } web3_account = { this.state.web3_account } />
        <h3 className="text-center">Available Betting Lines</h3>
        <hr />

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>
              <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
              <p>The stored value is: {this.state.storageValue}</p>
            </div>
          </div>
        </main>

        {bets.map((bet, index) => (
          <div className="col-sm-6" key={index}>
            <div className="panel panel-primary">
              <div className="panel-heading">
                <h3 className="panel-title"> <span className="btn">#{bet.id}</span></h3>
              </div>
              <div className="panel-body">
                <p> {bet.game_description} </p>
                <button onClick={this.placeBetOnClick.bind(this, bet.id, bet.odd_1, bet.odd_2)}> Place Bet </button>
              </div>
            </div>
          </div>
        ))}

      </div>
    );
  }
}

export default Bets;