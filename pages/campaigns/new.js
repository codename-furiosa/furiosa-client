import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Button, Form, Input, Message, TextArea, Container, Segment } from 'semantic-ui-react'
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import ipfs from '../../ipfs/ipfs';
import "../../style.css";

class CampaignNew extends Component {
    state = {
        ipfsHash:null,
        buffer:'',
        ethAddress:'',
        blockNumber:'',
        transactionHash:'',
        gasUsed:'',
        txReceipt: '',
        name: '',
        description: '',
        minimumContribution: '',
        target: '',
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

    getTransactionReceipt = async () => {
        try {
            this.setState({blockNumber:"waiting.."});
            this.setState({gasUsed:"waiting..."});
            //get Transaction Receipt in console on click
            //See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt

            await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt)=>{
                console.log(err,txReceipt);
                this.setState({txReceipt});
            }); //await for getTransactionReceipt
            await this.setState({blockNumber: this.state.txReceipt.blockNumber});
            await this.setState({gasUsed: this.state.txReceipt.gasUsed});
        } //try
        catch(error){
            console.log(error);
        } //catch
    }

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

            const transaction_details = await factory.methods.createCampaign(this.state.minimumContribution).send({
                from: accounts[0]
            });

            // Send IPFS hash to etheruem contract
            //return the transaction hash from the ethereum contract
            //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
            /*await factory.methods.sendHash(this.state.ipfsHash).send({
                from: accounts[0]
            }, (error, transactionHash) => {
                console.log(transactionHash);
                this.setState({transactionHash});
            });*/

            fetch('/api', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "address": transaction_details.events.CreateCampaign.returnValues['_address'],
                    "name": this.state.name,
                    "description": this.state.description,
                    "target": this.state.target,
                    "image_hash": this.state.ipfsHash,
                    "transaction_details": {
                        "blockHash": transaction_details.blockHash,
                        "blockNumber": transaction_details.blockNumber,
                        "contractAddress": transaction_details.contractAddress,
                        "cumulativeGasUsed": transaction_details.cumulativeGasUsed,
                        "from": transaction_details.from,
                        "gasUsed": transaction_details.gasUsed,
                        "logsBloom": transaction_details.logsBloom,
                        "status": transaction_details.status,
                        "to": transaction_details.to,
                        "transactionHash": transaction_details.transactionHash,
                        "transactionIndex": transaction_details.transactionIndex
                    }
                })
            }).then(function(response) {
                console.log("RESPONSE");
                console.log(response);
                //return response.json();
            });

            Router.pushRoute('/');
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
                        <h3>Create Campaign</h3>

                        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                            <Form.Field>
                                <label>Campaign Name</label>
                                <Input
                                  value={this.state.name}
                                  onChange={event => this.setState({ name: event.target.value })}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Description</label>
                                <TextArea
                                  value={this.state.description}
                                  onChange={event => this.setState({ description: event.target.value })}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Minimum Contribution</label>
                                <Input
                                    value={this.state.minimumContribution}
                                    onChange={event => this.setState({ minimumContribution: event.target.value })}
                                    label="wei"
                                    labelPosition="right" />
                            </Form.Field>
                            <Form.Field>
                                <label>Campaign Target</label>
                                <Input
                                    value={this.state.target}
                                    onChange={event => this.setState({ target: event.target.value })}
                                    label="eth"
                                    labelPosition="right" />
                            </Form.Field>

                            <Form.Field>
                                <label>Cover Image</label>
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

export default CampaignNew;
