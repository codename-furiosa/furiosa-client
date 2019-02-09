import React, { Component } from 'react';
import { Card, Button, Progress, Image, Reveal, Table, Container, Form } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';
import "../style.css";
import * as superagent from 'superagent';
import web3 from '../ethereum/web3';
import moment from 'moment';
import { isAuthenticated } from "../lib/auth";
import PropTypes from "prop-types";

class CampaignIndex extends Component {
    state = {
        web3:null,
        accounts:[],
        challenge:'',
        signature:''
    };

    static propTypes = {
        authenticated: PropTypes.bool
    };

    static async getInitialProps(ctx) {
        return {
            authenticated: isAuthenticated(ctx)
        };
    }

    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        this.setState({ web3, accounts });
    }



    render() {
        const { authenticated, url } = this.props;
        const { web3, challenge, signature } = this.state;
        if (!web3) return "Loading...";
        return (
          <div className="App">
            <button onClick={this.getChallenge}>Get Challenge</button>
            <button onClick={this.signChallenge} disabled={!challenge}>
              Sign Challenge
            </button>
            <button onClick={this.verifySignature} disabled={!signature}>
              Verify Signature
            </button>

            {challenge && (
              <div className="data">
                <h2>Challenge</h2>
                <pre>{JSON.stringify(challenge, null, 4)}</pre>
              </div>
            )}

            {signature && (
              <div className="data">
                <h2>Signature</h2>
                <pre>{signature}</pre>
              </div>
            )}

            {authenticated &&
                <h3>AUTHENTICATED!</h3>}
            {!authenticated &&
                <h3>PLEASE LOGIN!!</h3>}
          </div>
        );
      }
    }

export default CampaignIndex;
