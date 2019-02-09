import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Card, Grid, Button, Form, Table, Tab, Image, Progress, Container, Segment } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';
import factory from '../../ethereum/factory';
import * as superagent from 'superagent';
import "../../style.css";
import ContractRow from '../../components/ContractRow';
import ContributionRow from '../../components/ContributionRow';
import moment from 'moment';
import Board from 'react-trello'

class CampaignShow extends Component {
    state = {
      buffer:'',
      ethAddress:'',
      blockNumber:'',
      transactionHash:'',
      gasUsed:'',
      txReceipt: ''
    };

    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);

        const summary = await campaign.methods.getSummary().call();

        const contracts = await Promise.all(
            Array(parseInt(summary[2])).fill().map((element, index) => {
                return campaign.methods.requests(index).call();
            })
        );

        const campaign_details = await superagent.get('http://localhost:8080/api/campaigns/' + props.query.address).then(res => res.body);
        const contributions = await superagent.get('http://localhost:8080/api/contributions').query({ 'campaign': props.query.address }).then(res => res.body);
        const contracts_details = await superagent.get('http://localhost:8080/api/contracts').query({ 'campaign': props.query.address }).then(res => res.body);
        const github_details = await superagent.get('http://localhost:8080/api/installations/' + campaign_details.installation_id).then(res => res.body);

        return {
            github_details: github_details,
            contributions: contributions,
            contracts: contracts,
            contracts_details: contracts_details,
            campaign_details: campaign_details,
            address: props.query.address,
            campaignName: campaign_details.name,
            minimumContribution: summary[0],
            balance: summary[1],
            contractsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };

    }

    renderTabs() {
        const panes = [
            { menuItem: 'Info', render: () => <Tab.Pane className='pane' attached={false}>{this.renderInfo()}</Tab.Pane> },
            { menuItem: 'Roadmap', render: () => <Tab.Pane className='pane' attached={false}>{this.renderRoadmap()}</Tab.Pane> },
            { menuItem: this.props.contracts.length + ' Contracts', render: () => <Tab.Pane className='pane' attached={false}>{this.renderContracts()}</Tab.Pane> },
            { menuItem: this.props.contributions.length + ' Contributions', render: () => <Tab.Pane className='pane' attached={false}>{this.renderContributions()}</Tab.Pane> },
        ]

        return (
            <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
        );
    }

    renderContracts() {
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <>
                <Link route={`/campaigns/${this.props.address}/contracts/new`}>
                    <a>
                        <Button primary floated="left" style={{ marginBottom: 10 }}>Add Contract</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Freelancer</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Commence</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>{this.renderRows()}</Body>
                </Table>
                <div>Found {this.props.contractsCount} contracts.</div>
            </>
        );
    }

    renderContributions() {
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>Transaction ID</HeaderCell>
                            <HeaderCell>Contributor</HeaderCell>
                            <HeaderCell>Date</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                        </Row>
                    </Header>
                    <Body>{this.renderContributionsRows()}</Body>
                </Table>
            </>
        );
    }

    renderContributionsRows() {
        return this.props.contributions.map((contribution, index) => {
            return <ContributionRow
                key={index}
                id={index}
                contribution={contribution}
            />;
        });
    }

    renderRows() {
        return this.props.contracts.map((contract, index) => {
            return <ContractRow
                key={index}
                id={index}
                contract={contract}
                contract_details={this.props.contracts_details[index]}
                address={this.props.address}
                approversCount={this.props.approversCount}
            />;
        });
    }

    renderRoadmap() {
        const data = {
            lanes: [
                {
                    id: 'campaigns',
                    title: 'Campaigns',
                    label: '2/2',
                    cards: [
                        {id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins'},
                        {id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}, cardStyle: {'border-color': '#21ba45'}}
                    ]
                },
                {
                    id: 'contracts',
                    title: 'Contracts',
                    label: '0/0',
                    cards: []
                },
                {
                    id: 'freelancers',
                    title: 'Freelancers',
                    label: '0/0',
                    cards: []
                },
                {
                    id: 'general',
                    title: 'General',
                    label: '0/0',
                    cards: []
                },
                {
                    id: 'complete',
                    title: 'Complete',
                    label: '0/0',
                    cards: []
                }
            ]
        }

        return (
            <Segment>
                <Board draggable data={data} />
            </Segment>
        );
    }

    renderInfo() {console.log(this.props.github_details);

        const {
            campaign_details,
            balance,
            manager,
            minimumContribution,
            contractsCount,
            approversCount
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and can create contracts to withdraw money',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much wei to become an approver',
                fluid: true,
                raised: true
            },
            {
                header: contractsCount,
                meta: 'Number of Contracts',
                description: 'A contract tries to withdraw money from the contract. Contracts must be approved by approvers.'
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: 'Number of people who have already donated to this campaign.'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The balance is how much money this campaign has left to spend.'
            }
        ];

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={12}>
                        <Segment className='borderless'>
                            <Image src={'https://gateway.ipfs.io/ipfs/' + campaign_details.image_hash} />
                        </Segment>
                        <Segment>
                            {campaign_details.description}
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Card.Group itemsPerRow={1} items={items} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    logContribution(contribution) {
        fetch('/api/contributions', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "campaign": this.props.address,
                "contributor": contribution.contributor,
                "transaction": contribution.transaction_hash,
                "amount": contribution.amount
            })
        }).then(function(response) {
            console.log(response);
            //return response.json();
        });
    }

    render() {
        let date = new Date( parseInt( this.props.campaign_details['_id'].toString().substring(0,8), 16 ) * 1000 );
        return (
            <Layout>
                <Container className='campaign-show'>
                    <Segment className='borderless'>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={7}>
                                    <h3>{this.props.campaignName}</h3>
                                    <span className='date'>{moment(date).format('ll')}</span>
                                    {/*<Progress size='small' indicating percent={(web3.utils.fromWei(this.props.balance, 'ether')/(this.props.campaign_details['target']))*100} progress autoSuccess precision={1} />*/}
                                    <Progress label={'$'+Math.floor(Math.random() * 100) + 20} size='small' color="green" percent={Math.floor(Math.random() * 100) + 1} progress precision={1} />
                                </Grid.Column>
                                <Grid.Column width={3}>
                                </Grid.Column>
                                <Grid.Column width={6}>
                                    <ContributeForm logContribution={this.logContribution.bind(this)} address={this.props.address} />
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

export default CampaignShow;
