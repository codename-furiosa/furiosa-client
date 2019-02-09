import React, { Component } from 'react';
import { Table, Button, Message } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import {Router} from "../routes";
import * as superagent from 'superagent';

class AcceptRow extends Component {
    state = {
        loading: false,
        errorMessage: ''
    };

    onAccept = async () => {
        this.setState({ loading: true, errorMessage: '' });
        try {
            await superagent.post('/api/contracts/' + this.props.contract_details._id)
                .send({ 'status': 'accepted' })
                .then(res => {
                    console.log(res.body);
                });
        } catch (err) {
            this.setState({ errorMessage: err.message });
            console.log(this.state.errorMessage);
        }

        this.setState({ loading: false });
        Router.replaceRoute(`/freelancers/${this.props.address}`);
    }

    onCommence = async () => {

    }

    render () {
        const { contract_details } = this.props;

        return (
            <Table.Row disabled={false}>
                <Table.Cell>{contract_details.campaign}</Table.Cell>
                <Table.Cell>{contract_details.description}</Table.Cell>
                <Table.Cell>{contract_details.amount}</Table.Cell>
                <Table.Cell>
                    {(contract_details.status != 'approved') ? null : (
                        <Button loading={this.state.loading} color="green" basic onClick={this.onAccept}>
                            Accept
                        </Button>
                    )}
                </Table.Cell>
                <Table.Cell>Reject</Table.Cell>
            </Table.Row>
        );
    }
}

export default AcceptRow;
