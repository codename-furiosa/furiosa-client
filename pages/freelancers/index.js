import React, { Component } from 'react';
import { Card, Button, Image, Icon, Container } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Link } from '../../routes';
import "../../style.css";
import * as superagent from 'superagent';
import moment from 'moment';

class FreelancerIndex extends Component {
    static async getInitialProps() {
        const freelancerDetails = await superagent.get('http://localhost:8080/api/freelancers').then(res => res.body);

        return { freelancerDetails };
    }

    renderFreelancers() {
        const cards = this.props.freelancerDetails.map((freelancer, freelancerIndex) => {
            let desc = freelancer['summary'];
            let limit = 120;
            if(desc.length > limit) {
                desc = desc.substring(0,limit)+"..";
            }
            let img_url = freelancer['image_hash'] == 'default' ? '/static/felicia.jpg' : ( freelancer['image_hash'] == 'default2' ? '/static/matthew.png' : 'https://gateway.ipfs.io/ipfs/' + freelancer['image_hash'] );
            let rate = freelancer['rate'] == 0 ? '15% Equity' : '$' + freelancer['rate'] + '/hr';

            return (
                <Link prefetch key={freelancerIndex} href={`/freelancers/${freelancer.address}`} route={`/freelancers/${freelancer.address}`} >
                    <Card link fluid={true} raised={true}>
                        <div className="card-image-div"><Image circular={true} src={img_url} /></div>
                        <Card.Content>
                            <Card.Header>{freelancer['name']} <span className='date'>{freelancer['title']}</span></Card.Header>
                            <Card.Meta>
                                <span className='date'>{freelancer['location']}</span>
                            </Card.Meta>
                            <Card.Description>{desc}</Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            {/*<Progress size='small' indicating percent={(balance/(this.props.campaignDetails[campaignIndex]['target']))*100} progress autoSuccess precision={1} />*/}
                            <span className='rate'>{rate}</span>
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

    render() {
        return (
            <Layout>
                <div>
                    <div className='intro-section full-width'>
                        <Container>
                            <div className='cards-div'>
                                <h3>Putting People First</h3>
                                <p>Our employees are our most important customers, and in order to build comapnies with SOUL, we need to put our people first.</p>
                                <p>All freelancer profiles are vetted for authenticity to ensure that you get exactly what you paid for.</p>
                                <p>Real people with real profiles and work history.</p>
                                <p>They say ideas are cheap and that execution is key - rest assured that your contributions are well spent and only go towards the best people working to execute the idea.</p>
                            </div>
                        </Container>
                    </div>

                    <div className='intro-section divider-section'>
                        <h3>Freelancers</h3>
                    </div>

                    <div className='cards-div freelancers'>
                        <Card.Group centered stackable itemsPerRow='4'>
                            {this.renderFreelancers()}
                        </Card.Group>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default FreelancerIndex;
