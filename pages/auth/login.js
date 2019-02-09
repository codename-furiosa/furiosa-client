import { Component } from "react";
import Layout from '../../components/Layout';
import { Container } from 'semantic-ui-react';
import { Link } from "../../routes";
//import App from "../../components/App";
//import Header from "../../components/Header";
//import Success from "../../components/Success";
//import Error from "../../components/Error";
import { getCookie, removeCookie } from "../../lib/session";
import { isAuthenticated, getChallenge, verifySignature, redirectIfAuthenticated } from "../../lib/auth";
import web3 from '../../ethereum/web3';
import PropTypes from "prop-types";
import "../../style.css";

export default class Login extends Component {
    state = {
        error: null,
        web3:null,
        accounts:[],
        challenge:'',
        signature:'',
        metamask: false
    };

    static propTypes = {
        authenticated: PropTypes.bool,
        metamask: PropTypes.bool
    };

    static getInitialProps(ctx) {
        if (redirectIfAuthenticated(ctx)) {
            return {};
        }

    const success = getCookie("success", ctx.req);
        if (success) {
            removeCookie("success");
        }
        return {
            success,
            authenticated: isAuthenticated(ctx)
        };
    }

    async componentDidMount() {
        if(web3.currentProvider.isMetaMask) {
            this.setState({ metamask: true });
        } else {
            this.setState({ metamask: false });
        }
        const accounts = await web3.eth.getAccounts();
        this.setState({ web3, accounts });
    }

    handleSubmit = async e => {
        e.preventDefault();

        const challenge = await getChallenge(this.state.accounts[0]);
        this.setState({ challenge: challenge });

        await this.signChallenge();
    };

    signChallenge = async () => {
        const { web3, challenge, accounts } = this.state;
        await web3.currentProvider.send({
            method: "eth_signTypedData",
            params: [challenge, accounts[0]],
            from: accounts[0]
        },
        (error, res) => {
            if (error) return console.error(error);
            this.setState({ signature: res.result }, async () => {
                let err = await verifySignature({challenge: this.state.challenge, signature: this.state.signature, account: this.state.accounts[0]});

                if (err) {
                    this.setState({
                        error: err
                    });
                    console.log(err);
                    return false;
                }
            });
        });
    };

    render() {
        const { authenticated, url, success } = this.props;
        const { web3, challenge, signature, error, metamask } = this.state;

        return (
            <Layout authenticated={authenticated}>
                <div>
                    <Container>
                        {metamask && (
                            <>
                                <form onSubmit={this.handleSubmit}>
                                    <h1>Login</h1>
                                    <button type="submit">Submit</button>
                                </form>

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
                            </>
                        )}

                        {!metamask && (
                            <>
                                <Link href='https://metamask.io/'>
                                    <a className="item">Please install metamask</a>
                                </Link>
                            </>
                        )}
                    </Container>
                </div>
            </Layout>
        );
    }
}
