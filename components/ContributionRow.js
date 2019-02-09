import React, { Component } from 'react';
import { Table, Button, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {Router} from "../routes";
import moment from 'moment';

class ContributionRow extends Component {
    state = {
        loading: false,
        errorMessage: ''
    };

    render () {
        const { _id, transaction, contributor, amount } = this.props.contribution;
        let date = new Date( parseInt( this.props.contribution._id.toString().substring(0,8), 16 ) * 1000 );

        return (
            <Table.Row>
                <Table.Cell>{transaction}</Table.Cell>
                <Table.Cell>{contributor}</Table.Cell>
                <Table.Cell>{moment(date).format('ll')}</Table.Cell>
                <Table.Cell>{amount}</Table.Cell>
            </Table.Row>
        );
    }
}

export default ContributionRow;
