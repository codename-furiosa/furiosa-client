import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from './Header';
import Footer from '../components/Footer';
import Head from 'next/head';

export default (props) => {

    return (
        <Container fluid={true}>
            <Head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
                <link href="https://fonts.googleapis.com/css?family=Cutive+Mono|Limelight|Poiret+One" rel="stylesheet" />
            </Head>
            <Header authenticated={props.authenticated} user={props.user} />
            {props.children}
            <Footer />
        </Container>
    );
};
