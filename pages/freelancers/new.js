import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Button, Form, Input, Message, TextArea, Container, Segment } from 'semantic-ui-react'
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import ipfs from '../../ipfs/ipfs';
import "../../style.css";

class FreelancerNew extends Component {
    state = {
        ipfsHash: null,
        name: '',
        location: '',
        title: '',
        summary: '',
        rate: '',
        errorMessage: '',
        loading: false
    };

    captureFile = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const file = event.target.files[0];
        let reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => this.convertToBuffer(reader);
    };

    convertToBuffer = async(reader) => {
      //file is converted to a buffer for upload to IPFS
        const buffer = await Buffer.from(reader.result);
      //set this buffer -using es6 syntax
        this.setState({buffer});
    };

    onSubmit = async (e) => {
        e.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();

            //save document to IPFS,return its hash#, and set hash# to state
            //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add
            await ipfs.add(this.state.buffer, (err, ipfsHash) => {
                console.log(err,ipfsHash);
                //setState by setting ipfsHash to ipfsHash[0].hash
                this.setState({ ipfsHash:ipfsHash[0].hash });
            }); //await ipfs.add

            const transaction_details = await factory.methods.createFreelancer().send({
                from: accounts[0]
            });

            fetch('/api/freelancers', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "address": transaction_details.events.CreateFreelancer.returnValues['_address'],
                    "name": this.state.name,
                    "location": this.state.location,
                    "title": this.state.title,
                    "summary": this.state.summary,
                    "rate": this.state.rate,
                    "image_hash": this.state.ipfsHash,
                })
            }).then(function(response) {
                console.log("RESPONSE");
                console.log(response);
                //return response.json();
            });

            Router.pushRoute('/freelancers');

        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    };

    render() {
        return (
            <Layout>
                <Container>
                    <Segment className='borderless'>
                        <h3>Create Freelancer</h3>

                        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                            <Form.Field>
                                <label>Name</label>
                                <Input
                                  value={this.state.name}
                                  onChange={event => this.setState({ name: event.target.value })}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Location</label>
                                <Input
                                  value={this.state.location}
                                  onChange={event => this.setState({ location: event.target.value })}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Title</label>
                                <Input
                                  value={this.state.title}
                                  onChange={event => this.setState({ title: event.target.value })}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Summary</label>
                                <TextArea
                                  value={this.state.summary}
                                  onChange={event => this.setState({ summary: event.target.value })}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Hourly Rate</label>
                                <Input
                                  value={this.state.rate}
                                  onChange={event => this.setState({ rate: event.target.value })}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Image</label>
                                <input
                                    type = "file"
                                    onChange = {this.captureFile}
                                />
                            </Form.Field>
                            <Message error header="Oops!" content={this.state.errorMessage} />
                            <Button primary loading={this.state.loading}>
                                Create
                            </Button>
                        </Form>
                    </Segment>
                </Container>
            </Layout>
        );
    }
}

export default FreelancerNew;
