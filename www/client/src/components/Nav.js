import React, { Component } from 'react';
import { Link } from 'react-router';
import '../App.css';

class Nav extends Component {

  constructor(props) {
    super(props)

    this.state = {
      web3_account: null,
      web3_balance: null
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ web3_balance: newProps.web3_balance });
  }

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="navbar-header">
          <Link className="navbar-brand" to="/">SportsBeth</Link>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <Link to="/">Availble Betting Lines</Link>
          </li>
          <li>
            <Link to="/open">Open Bets</Link>
          </li>
        </ul>

        <ul className="nav navbar-nav navbar-right">
          <li className="balance"><a href="https://etherscan.io/">ETH Balance : {this.state.web3_balance}</a></li>
        </ul>
      </nav>
    );
  }
}

export default Nav;