import { Component } from "react";
import { Container, Button, Form, Input } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Link, Router } from "../../routes";
import { signUp, redirectIfNotAuthenticated, isAuthenticated, getJwt } from "../../lib/auth";
import "../../style.css";
import web3 from '../../ethereum/web3';
import PropTypes from "prop-types";
import * as superagent from 'superagent';

export default class Register extends Component {
    state = {
        user: '',
        public_address: ''
    }

    static getInitialProps(ctx) {
        redirectIfNotAuthenticated(ctx);

        return { authenticated: isAuthenticated(ctx) };
    }

    async componentDidMount() {
        if(isAuthenticated(this.props)) {
            const accounts = await web3.eth.getAccounts();
            const userDetails = await superagent
                .get('http://localhost:8080/user/' + accounts[0])
                .set('Authorization', 'Bearer ' + getJwt(this.props))
                .then(res => res.body);
            this.setState({user: userDetails.name, public_address: userDetails.address });
        }
    }

    render() {
        const { user, public_address } = this.state;
        const { authenticated } = this.props;
        return (
            <Layout authenticated={authenticated} user={this.state.user}>
                <div className='intro-section'>
                    <Container>
                        <h3>Update Your Details</h3>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <label>Name</label>
                                <Input
                                    value={this.state.user}
                                    onChange={event => this.setState({ user: event.target.value })}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Public Address</label>
                                <Input
                                    disabled
                                    value={this.state.public_address}
                                />
                            </Form.Field>
                            <Button className="ui button" type="submit">Update</Button>
                        </Form>
                    </Container>
                </div>
            </Layout>
        );
    }

    handleSubmit = async e => {
        e.preventDefault();

        try {
            await superagent.put('http://localhost:8080/user/' + this.state.public_address)
                .set('Authorization', 'Bearer ' + getJwt(this.props))
                .send({
                    'name': this.state.user,
                    'address': this.state.public_address
                })
                .then(res => {
                    Router.pushRoute(`/`);
                });
        } catch (err) {
            console.log(err);
        }
    };
}
