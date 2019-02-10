import { Component } from "react";
import Layout from '../../components/Layout';
import { signOut, isAuthenticated } from "../../lib/auth";
import "../../style.css";
import { Dimmer, Loader } from 'semantic-ui-react';

export default class Logout extends Component {
    static getInitialProps(ctx) {

      return {
        authenticated: isAuthenticated(ctx)
      };
    }
  componentDidMount() {
    signOut();
    return {};
  }
  render() {
    return (
        <Layout authenticated={this.props.authenticated}>
            <Dimmer active>
                <Loader>Logging out...</Loader>
            </Dimmer>
        </Layout>
    );
  }
}
