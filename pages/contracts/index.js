import React, { Component } from 'react';
import factory from '../../ethereum/factory';
import { Card, Button, Image, Icon, Container } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Link } from '../../routes';
import "../../style.css";
import * as superagent from 'superagent';
import moment from 'moment';

class ContractIndex extends Component {

    render() {
        return (
            <Layout>
                <div>
                    <div className='intro-section full-width'>
                        <Container>
                            <div className='cards-div'>
                                <h3>Work with Purpose</h3>
                                <p>Your time is too valuable to be spent completing digital coffee runs for people too lazy to do it themselves.</p>
                                <p>All of our contracts form an important piece of a bigger picture.</p>
                                <p>When you complete a contract, you are providing a valuable service to help execute the next step of a well-planned campaign lead by a driven leader.</p>
                            </div>
                        </Container>
                    </div>

                    <div className='intro-section divider-section'>
                        <h3>Contracts</h3>
                    </div>

                    <div className='cards-div freelancers'>
                        <Card.Group stackable itemsPerRow='4'>

                        </Card.Group>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default ContractIndex;
