import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Freelancer from '../../ethereum/freelancer';
import { Card, Grid, Button, Container, Segment, Tab, Image, Icon, Label, Table } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';
import "../../style.css";
import AcceptRow from '../../components/AcceptRow';
import * as superagent from 'superagent';
import Campaign from '../../ethereum/campaign';

class FreelancerShow extends Component {
    static async getInitialProps(props) {
        const freelancer = Freelancer(props.query.address);

        const summary = await freelancer.methods.getSummary().call();
        const freelancer_details = await superagent.get('http://localhost:8080/api/freelancers/' + props.query.address).then(res => res.body);
        const contracts_details = await superagent.get('http://localhost:8080/api/contracts').query({ 'freelancer': props.query.address }).then(res => res.body);

        return {
            contracts_details: contracts_details,
            address: props.query.address,
            balance: summary[1],
            manager: summary[2],
            freelancer_details: freelancer_details,
            address: props.query.address
        };

    }

    renderTabs() {
        const panes = [
            { menuItem: 'Summary', render: () => <Tab.Pane className='pane' attached={false}>{this.renderSummary()}</Tab.Pane> },
            { menuItem: 'Work History & Feedback', render: () => <Tab.Pane className='pane' attached={false}>{this.renderHistory()}</Tab.Pane> },
            { menuItem: 'Portfolio', render: () => <Tab.Pane className='pane' attached={false}>{this.renderPortfolio()}</Tab.Pane> },
            { menuItem: 'Pending Contracts', render: () => <Tab.Pane className='pane' attached={false}>{this.renderContracts()}</Tab.Pane> },
        ]

        return (
            <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
        );
    }

    renderCards() {
        const {
            freelancer_details,
            balance,
            manager,
        } = this.props;

        const items = [
            {
                key: 0,
                header: freelancer_details.rate,
                meta: 'Hourly Rate (USD)'
            },
            {
                key: 1,
                header: freelancer_details.rate,
                meta: 'Total Earned (USD)'
            },
            {
                key: 2,
                header: freelancer_details.rate,
                meta: 'Jobs Completed'
            },
            {
                key: 3,
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and can create contracts to withdraw money',
                style: { overflowWrap: 'break-word' }
            },
            {
                key: 4,
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Freelancer Balance (ether)',
                description: 'The balance is how much money this freelancer has left to spend.'
            }
        ];

        return <Card.Group items={items} />
    }

    renderSummary() {
        return (
            <Grid stackable={true}>
                <Grid.Row>
                    <Grid.Column width={10}>
                        <Segment className='borderless'>
                            {this.props.freelancer_details.summary}
                        </Segment>
                        <Segment className='borderless'>
                            <h4>Skills</h4>
                            <Label.Group>
                                <Label as='a'>Javascript</Label>
                                <Label as='a'>PHP</Label>
                                <Label as='a'>HTML</Label>
                                <Label as='a'>CSS</Label>
                                <Label as='a'>Responsive Web Design</Label>
                                <Label as='a'>Shopify</Label>
                                <Label as='a'>WooCommerce</Label>
                                <Label as='a'>E-commerce</Label>
                                <Label as='a'>React</Label>
                                <Label as='a'>Next.js</Label>
                                <Label as='a'>Express.js</Label>
                                <Label as='a'>Magento</Label>
                                <Label as='a'>Magento 2</Label>
                                <Label as='a'>BigCommerce</Label>
                            </Label.Group>
                        </Segment>
                        <Segment className='borderless'>
                            <h4>Certifications</h4>
                        </Segment>
                        <Segment className='borderless'>
                            <h4>Education</h4>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={2}>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        {this.renderCards()}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
    renderHistory() {}
    renderPortfolio() {}

    renderContracts() {
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>Campaign</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Accept</HeaderCell>
                            <HeaderCell>Reject</HeaderCell>
                        </Row>
                    </Header>
                    <Body>{this.renderRows()}</Body>
                </Table>
                <div>Found {this.props.contracts_details.length} contracts.</div>
            </>
        );
    }

    renderRows() {
        return this.props.contracts_details.map((contract_details, index) => {
            return <AcceptRow key={index}
                contract_details={contract_details}
                address={this.props.address}
            />;
        });
    }

    render() {
        return (
            <Layout>
                <Container className='freelancer-show'>
                    <Segment className='borderless'>
                        <Grid stackable={true}>
                            <Grid.Row>
                                <Grid.Column width={2}>
                                    <Image circular={true} src={'https://gateway.ipfs.io/ipfs/' + this.props.freelancer_details.image_hash} />
                                    {/*<Progress size='small' indicating percent={(web3.utils.fromWei(this.props.balance, 'ether')/(this.props.campaign_details['target']))*100} progress autoSuccess precision={1} />*/}
                                </Grid.Column>
                                <Grid.Column className='freelancer-quick-stats' width={6}>
                                    <h3>{this.props.freelancer_details.name}</h3>
                                    <Icon name='linkedin' />
                                    <Icon name='facebook' />
                                    <Icon name='google' />
                                    <span className='date'>{this.props.freelancer_details.title}</span>
                                    <p className='date'>{this.props.freelancer_details.location}</p>
                                    <p>4.86 <Icon name='star' /></p>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                    {this.renderTabs()}
                </Container>
            </Layout>
        );
    }
}

export default FreelancerShow;
