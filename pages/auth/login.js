import { Component } from "react";
import Layout from '../../components/Layout';
import { Container, Image, Button } from 'semantic-ui-react';
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
                    <div className='intro-section'>
                        <Container>
                            <h3>1-step login with Metamask</h3>
                            <p>By signing a generated piece of data with your Metamask account, we are able to cryptographically identify your account without having to mess with usernames and passwords.</p>
                            <p>Your account and identity is then linked to your Metamask wallet's public address.</p>
                            <p>Easy Peasy.</p>
                            {metamask && (
                                <form onSubmit={this.handleSubmit}>
                                    <Button className="ui button" type="submit">Login With Metamask</Button>
                                </form>
                            )}
                            {!metamask && (
                                <>
                                    <p>
                                        <Link href='https://metamask.io/'>
                                            <a target="_blank">First install Metamask</a>
                                        </Link>
                                    </p>
                                    <span>(then refresh this page)</span>
                                </>
                            )}
                        </Container>
                    </div>
                    <div className='intro-section divider-section'>
                        <h3>The Nitty Gritty</h3>
                    </div>
                    <div className='intro-section'>
                        <Image src='/static/metamask-login-flow.png' />
                        <span>Image courtesy of the <Link href='https://www.toptal.com/ethereum/one-click-login-flows-a-metamask-tutorial'><a>article</a></Link> by <Link href='https://www.toptal.com/resume/amaury-martiny'><a>Amaury Martiny</a></Link>. </span>
                        <span>Implemented with the help of <Link href='https://github.com/I-Gave/meta-auth'><a>MetaAuth</a></Link>.</span>
                    </div>
                </div>
            </Layout>
        );
    }
}
