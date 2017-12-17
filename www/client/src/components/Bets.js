import React, { Component } from 'react';
import { Link } from 'react-router';
import Nav from './Nav';
import { getNflBetsApi } from '../utils/bets-api';


class Bets extends Component {

  constructor() {
    super()
    this.state = { bets: [] };
  }

  componentDidMount() {
    this.getNflBets();
  }

  getNflBets() {
    getNflBetsApi().then((bets) => {
      this.setState({ bets });
    });
  }

  render() {

    const { bets }  = this.state;

    return (
      <div>
        <Nav />
        <h3 className="text-center">Available Betting Lines</h3>
        <hr/>

        { bets.map((bets, index) => (
              <div className="col-sm-6" key={index}>
                <div className="panel panel-primary">
                  <div className="panel-heading">
                    <h3 className="panel-title"> <span className="btn">#{ bets.id }</span></h3>
                  </div>
                  <div className="panel-body">
                    <p> { bets.game_description } </p>
                  </div>
                </div>
              </div>
          ))}

        <div className="col-sm-12">
            <div className="jumbotron text-center">
              <h2>View Open Bets</h2>
              <Link className="btn btn-lg btn-success" to='/open'> Open Bets </Link>
            </div>
        </div>
      </div>
    );
  }
}

export default Bets;