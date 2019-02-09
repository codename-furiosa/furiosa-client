import React, { Component } from 'react';
import { Card, Button, Progress, Image, Reveal, Table, Container, Form } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';
import "../style.css";
import web3 from '../ethereum/web3';
import moment from 'moment';
import { isAuthenticated, getJwt } from "../lib/auth";
import PropTypes from "prop-types";
import * as superagent from 'superagent';

class CampaignIndex extends Component {
    state = {
        user: ''
    }
    static async getInitialProps(props) {
        const campaignDetails = await superagent.get('http://localhost:8080/api/campaigns').then(res => res.body);

        return {
            campaignDetails,
            authenticated: isAuthenticated(props)
        };
    }

    async componentDidMount() {
        if(isAuthenticated(this.props)) {
            const accounts = await web3.eth.getAccounts();
            const userDetails = await superagent
                .get('http://localhost:8080/user/' + accounts[0])
                .set('Authorization', 'Bearer ' + getJwt(this.props))
                .then(res => res.body);
            this.setState({user: userDetails.name});
        }
    }

    renderCampaigns() {
        const cards = this.props.campaignDetails.map((campaign, campaignIndex) => {
            //let balance = web3.utils.fromWei(this.props.campaignSummaries[campaignIndex][2], 'ether');
            let date = new Date( parseInt( campaign['_id'].toString().substring(0,8), 16 ) * 1000 );
            let desc = campaign['description'];
            let limit = 120;
            if(desc.length > limit) {
                desc = desc.substring(0,limit)+"..";
            }

            return (
                <Link key={campaignIndex} prefetch route={`/campaigns/${campaign.address}`} href={`/campaigns/${campaign.address}`}>
                    <Card link raised={true}>
                        <div className="card-image-div"><Image src={'https://gateway.ipfs.io/ipfs/' + campaign['image_hash']} /></div>
                        <Card.Content>
                            <Card.Header>{campaign['name']}</Card.Header>
                            <Card.Meta>
                                <span className='date'>{moment(date).format('ll')}</span>
                            </Card.Meta>
                            <Card.Description>{desc}</Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            {/*<Progress size='small' indicating percent={(balance/(this.props.campaignDetails[campaignIndex]['target']))*100} progress autoSuccess precision={1} />*/}
                            <Progress label={'$'+Math.floor(Math.random() * 100) + 20} size='small' percent={Math.floor(Math.random() * 100) + 1} progress precision={1} />
                        </Card.Content>
                    </Card>
                </Link>
            );
        });

        return (
            <>
                {cards}
            </>
        );
    }

    renderIntro1() {
        return (
            <Card raised={true}>
                <div className="card-image-div"><Image src='https://gateway.ipfs.io/ipfs/QmfNaa8aLwj2dmMs7rdq1JCwFXPWKW9GkKXL2voqTC2smi' /></div>
                <Card.Content>
                    <Card.Header>Codename:Furiosa</Card.Header>
                    <Card.Meta>
                        <span className='date'>12 Nov 2018</span>
                    </Card.Meta>
                    <Card.Description>Furiosa is an Ethereum-based crowdfunding service and freelancer marketplace where every dollar is tracked.</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    {/*<Progress size='small' indicating percent={(balance/(this.props.campaignDetails[campaignIndex]['target']))*100} progress autoSuccess precision={1} />*/}
                    <Progress label={'$'+Math.floor(Math.random() * 100) + 20} size='small' percent={Math.floor(Math.random() * 100) + 1} progress precision={1} />
                </Card.Content>
            </Card>
        );
    }
    renderIntro2() {
        return (
            <Table stackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Recipient</Table.HeaderCell>
                        <Table.HeaderCell>Approval Count</Table.HeaderCell>
                        <Table.HeaderCell>Approve</Table.HeaderCell>
                        <Table.HeaderCell>Finalize</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row disabled={false} positive={true}>
                        <Table.Cell>0</Table.Cell>
                        <Table.Cell>Build prototype</Table.Cell>
                        <Table.Cell>$5000</Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell>0/2</Table.Cell>
                        <Table.Cell>
                            <Button color="green" basic>
                                Approve
                            </Button>
                        </Table.Cell>
                        <Table.Cell>
                            <Button color="teal" basic>
                                Finalize
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        );
    }
    renderIntro3() {
        return (
            <Card raised={true}>
                <div className="card-image-div"><Image circular={true} src='https://gateway.ipfs.io/ipfs/QmXMNyKpokYdRVbjzop2aSMtHaVhP2zUq14R16w9HRgjqU' /></div>
                <Card.Content>
                    <Card.Header>Colin Lim <span className='date'>Founder</span></Card.Header>
                    <Card.Meta>
                        <span className='date'>Melbourne, Australia</span>
                    </Card.Meta>
                    <Card.Description>Hi! I'm Colin, founder and developer of Codename:Furiosa. Please help fund my project and prove its concept by hiring me to continue developing it if you like the idea.</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    {/*<Progress size='small' indicating percent={(balance/(this.props.campaignDetails[campaignIndex]['target']))*100} progress autoSuccess precision={1} />*/}
                    <span className='rate'>$5/hr</span>
                </Card.Content>
            </Card>
        );
    }

    render() {
        const { authenticated } = this.props;
        return (
            <Layout authenticated={authenticated} user={this.state.user}>
                <div>
                    <div className='intro-section'>
                        <Container>
                            <div className='cards-div rw-wrapper'>
                                <h3 className='rw-sentence'>
                                    Crowdfunding Done Right
                                </h3>
                                <p>Have you ever donated to a Kickstarter project only to have its creators just run away with the money?</p>
                                <p>Well, here at Furiosa, we help crowdfund innovative ideas by ensuring that your contributions only go to reputable freelancers completing jobs to execute them.</p>
                                <p>When you donate to a campaign, you get voting rights to every spend request being made. Only when a request is approved, do funds get dispersed to the freelancer linked to it.</p>
                            </div>
                        </Container>
                    </div>

                    <div className='intro-section divider-section'>
                        <h3>How It Works</h3>
                    </div>

                    <div className='intro-section'>
                        <Container>
                            <div className='cards-div campaigns'>
                                <p>Create Campaigns To Receive Funding Contributions</p>
                                <Card.Group centered stackable itemsPerRow='1'>
                                    {this.renderIntro1()}
                                </Card.Group>
                            </div>
                            <div className='cards-div'>
                                <p>Submit Spend Requests For Contributors To Vote On</p>
                                {this.renderIntro2()}
                            </div>
                            <div className='cards-div freelancers'>
                                <p>Funds Are Released To A Reputable Freelancer To Complete The Job</p>
                                <Card.Group centered stackable itemsPerRow='1'>
                                    {this.renderIntro3()}
                                </Card.Group>
                            </div>
                        </Container>
                    </div>

                    <div className='intro-section divider-section'>
                        <h3>Campaigns</h3>
                    </div>

                    <div className='cards-div campaigns'>
                        {/*<h4>Latest</h4>*/}
                        <Card.Group centered stackable itemsPerRow='4'>
                            {this.renderCampaigns()}
                        </Card.Group>
                    </div>
                    <div className='intro-section divider-section'>
                        <h3>Get Updates</h3>
                        <Form>
                            <Form.Input width={8} action='Subscribe' placeholder='Email...' />
                        </Form>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;
