import React, { Component } from 'react';
import { Table, Button, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {Router} from "../routes";
import * as superagent from 'superagent';

class ContractRow extends Component {
    state = {
        loading: false,
        errorMessage: ''
    };

    onApprove = async () => {
        const campaign = Campaign(this.props.address);

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            campaign.once('SendContract', async (error, event) => {
                await superagent.post('http://localhost:8080/api/contracts/' + this.props.contract_details._id)
                .send({ 'status': 'approved' })
                .then(res => {
                    console.log(res.body);
                });
            });
            await campaign.methods.approveContract(this.props.id)
                .send({from: accounts[0]});
        } catch (err) {
            this.setState({ errorMessage: err.message });
            console.log(this.state.errorMessage);
        }

        this.setState({ loading: false });
        Router.replaceRoute(`/campaigns/${this.props.address}`);
    };

    onFinalize = async () => {
        const campaign = Campaign(this.props.address);

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeContract(this.props.id)
                .send({from: accounts[0]});

            Router.replaceRoute(`/campaigns/${this.props.address}/contracts`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
            console.log(this.state.errorMessage);
        }

        this.setState({ loading: false });
    };

    onCommence = async () => {
        const campaign = Campaign(this.props.address);

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.commenceContract(this.props.id)
                .send({from: accounts[0]});
        } catch (err) {
            this.setState({ errorMessage: err.message });
            console.log(this.state.errorMessage);
        }

        this.setState({ loading: false });
        Router.replaceRoute(`/campaigns/${this.props.address}`);
    }

    render () {
        const { id, contract, contract_details, approversCount } = this.props;
        const readyToFinalize = contract.approvalCount > approversCount / 2;

        return (
            <Table.Row disabled={(contract.status == 2)}>
                <Table.Cell>{id}</Table.Cell>
                <Table.Cell>{contract_details.description}</Table.Cell>
                <Table.Cell>{web3.utils.fromWei(contract.value)}</Table.Cell>
                <Table.Cell>{contract.freelancer}</Table.Cell>
                <Table.Cell>{contract.approvalCount}/{approversCount}</Table.Cell>
                <Table.Cell>
                    {(contract.status != 0 || contract_details.status != 'open') ? null : (
                        <Button loading={this.state.loading} color="green" basic onClick={this.onApprove}>
                            Approve
                        </Button>
                    )}
                </Table.Cell>
                <Table.Cell>
                    {(contract.status != 0 || contract_details.status != 'accepted') ? null : (
                        <Button loading={this.state.loading} color="green" basic onClick={this.onCommence}>
                            Commence
                        </Button>
                    )}
                </Table.Cell>
                <Table.Cell>
                    {(contract.status != 1) ? null : (
                    <Button loading={this.state.loading} color="teal" basic onClick={this.onFinalize}>
                        Finalize
                    </Button>
                    )}
                </Table.Cell>
            </Table.Row>
        );
    }
}

export default ContractRow;
