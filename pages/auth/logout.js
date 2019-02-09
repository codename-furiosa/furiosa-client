import { Component } from "react";
import Layout from '../../components/Layout';
import { signOut, isAuthenticated } from "../../lib/auth";
import "../../style.css";

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
        </Layout>
    );
  }
}
