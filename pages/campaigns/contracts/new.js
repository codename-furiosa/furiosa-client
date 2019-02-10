import React, { Component } from 'react';
import { Form, Button, Message, Input, Dropdown, Container, Segment } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';
import factory from "../../../ethereum/factory";
import * as superagent from 'superagent';
import "../../../style.css";
import getConfig from 'next/config';
const {publicRuntimeConfig} = getConfig();

class RequestNew extends Component {
    state = {
        amount: '',
        description: '',
        loading: false,
        errorMessage: '',
        freelancer: '',
    };

    static async getInitialProps(props) {
        const { address } = props.query;
        const freelancers = await factory.methods.getFreelancers().call();
        const freelancerDetails = await superagent.get(publicRuntimeConfig.API_URI + '/api/freelancers').then(res => res.body);

        return { address, freelancers, freelancerDetails };
    }

    renderFreelancers() {
        const items = this.props.freelancers.map((address, index) => {
            return {
                key: index,
                text: this.props.freelancerDetails[index]['name'],
                value: address
            }
        });

        return <Dropdown
            placeholder='Select Freelancer'
            fluid
            selection
            options={items}
            onChange={(event, data) => this.setState({ freelancer: data.value })}
        />
    }

    logRequest(request) {
        fetch('/api/requests', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "campaign": request.campaign,
                "description": request.description,
                "freelancer": request.freelancer,
                "amount": request.amount
            })
        }).then(function(response) {
            console.log(response);
            //return response.json();
        });
    }

    sync_github = async () => {
        try {
            await superagent.post(publicRuntimeConfig.BOT_URI + '/furiosa/milestone')
                .send({ 'repo': 'furiosa' })
                .then(res => {
                    console.log(res);
                });
        } catch (err) {
            console.log(err);
        }

    }

    onSubmit = async (e) => {
        e.preventDefault();
        this.setState({ loading: true, errorMessage: '' });
        this.sync_github();

        /*const campaign = Campaign(this.props.address);

        const { description, amount, freelancer } = this.state;

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(
                web3.utils.toWei(amount, 'ether'),
                freelancer
            ).send({ from: accounts[0]});

            this.logRequest({ campaign: this.props.address, description: this.state.description, amount: this.state.amount, freelancer: this.state.freelancer });

            Router.pushRoute(`/campaigns/${this.props.address}`);

        } catch (err) {
            this.setState({ errorMessage: err.message });
        }*/

        this.setState({ loading: false });
    };

    render() {
        return (
            <Layout>
                <Container>
                    <Segment className='borderless'>
                        <Link route={`/campaigns/${this.props.address}`}>
                            <a>Back</a>
                        </Link>
                        <h3>Create a Request</h3>
                        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                            <Form.Field>
                                <label>Description</label>
                                <Input
                                    value={this.state.description}
                                    onChange={event => this.setState({ description: event.target.value })}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Value in Ether</label>
                                <Input
                                    value={this.state.amount}
                                    onChange={event => this.setState({ amount: event.target.value })}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Freelancer</label>
                                {this.renderFreelancers()}
                            </Form.Field>

                            <Message error header="Oops!" content={this.state.errorMessage} />
                            <Button primary loading={this.state.loading}>Create</Button>
                        </Form>
                    </Segment>
                </Container>
            </Layout>
        );
    }
}

export default RequestNew;
