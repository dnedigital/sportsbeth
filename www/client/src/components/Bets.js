import React, { Component } from 'react';
import Nav from './Nav';
import SimpleStorageContract from '../truffle/build/contracts/SimpleStorage.json'
import { getNflBetsApi } from '../utils/bets-api';
import getWeb3 from '../utils/getWeb3'


class Bets extends Component {

  constructor(props) {
    super(props)

    this.state = {
      bets: [],
      storageValue: 0,
      web3: null
    };
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      })

      console.log("huwhat");

      // Instantiate contract once web3 provided.
      //this.instantiateContract()
    })
      .catch(() => {
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

    /*var AdoptionArtifact = data;
    App.contracts.Adoption = TruffleContract(AdoptionArtifact);

    // Set the provider for our contract

    // Use our contract to retrieve and mark the adopted pets
    return App.markAdopted();
    App.contracts.Adoption.setProvider(App.web3Provider);
    return App.bindEvents();*/

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(5, { from: accounts[0] })
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
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
  }

  render() {

    const { bets } = this.state;

    return (
      <div>
        <Nav />
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