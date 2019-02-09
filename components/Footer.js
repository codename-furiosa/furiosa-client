import React, { Component } from 'react';
import { Segment, Container, Grid, List, Header, Icon } from 'semantic-ui-react';
import { Link } from '../routes';
import $ from 'jquery';

class Footer extends Component {
    componentDidMount() {
        var Messenger = function(el) {
            'use strict';
            var m = this;

            m.init = function() {
                m.codeletters = "&#*+%?£@§$";
                m.message = 0;
                m.current_length = 0;
                m.fadeBuffer = false;
                m.messages = [
                    '© furiosa.io',
                    'Furiosa © 2019',
                    '© 2019 FURIOSA'
                ];

                setTimeout(m.animateIn, 100);
            };

            m.generateRandomString = function(length){
                var random_text = '';
                while(random_text.length < length){
                    random_text += m.codeletters.charAt(Math.floor(Math.random()*m.codeletters.length));
                }

                return random_text;
            };

            m.animateIn = function(){
                if(m.current_length < m.messages[m.message].length){
                    m.current_length = m.current_length + 2;
                    if(m.current_length > m.messages[m.message].length) {
                        m.current_length = m.messages[m.message].length;
                    }

                    var message = m.generateRandomString(m.current_length);
                    $(el).html(message);

                    setTimeout(m.animateIn, 20);
                } else {
                    setTimeout(m.animateFadeBuffer, 20);
                }
            };

            m.animateFadeBuffer = function(){
                if(m.fadeBuffer === false){
                    m.fadeBuffer = [];
                    for(var i = 0; i < m.messages[m.message].length; i++){
                        m.fadeBuffer.push({c: (Math.floor(Math.random()*12))+1, l: m.messages[m.message].charAt(i)});
                    }
                }

                var do_cycles = false;
                var message = '';

                for(var i = 0; i < m.fadeBuffer.length; i++){
                    var fader = m.fadeBuffer[i];
                    if(fader.c > 0){
                        do_cycles = true;
                        fader.c--;
                        message += m.codeletters.charAt(Math.floor(Math.random()*m.codeletters.length));
                    } else {
                        message += fader.l;
                    }
                }

                $(el).html(message);

                if(do_cycles === true){
                    setTimeout(m.animateFadeBuffer, 60);
                } else {
                    setTimeout(m.cycleText, 2000);
                }
            };

            m.cycleText = function(){
                m.message = m.message + 1;
                if(m.message >= m.messages.length){
                    m.message = 0;
                }

                m.current_length = 0;
                m.fadeBuffer = false;
                //$(el).html('_');

                setTimeout(m.animateIn, 200);
            };

            m.init();
        }

        //console.clear();
        var messenger = new Messenger($('#messenger2'));
    }

    render() {
        return (
            <div>
                <Segment className="footer" inverted vertical style={{ padding: '5em 0em' }}>
                    <Container>
                        <Grid divided inverted stackable>
                            <Grid.Row>
                                <Grid.Column width={3}>
                                    <Header inverted as='h4' content='About' />
                                    <List link inverted>
                                        <List.Item as='a'>What Is Furiosa</List.Item>
                                        <List.Item as='a'>FAQ</List.Item>
                                        <List.Item as='a'>Contact Us</List.Item>
                                        <List.Item as='a'>Sitemap</List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Header inverted as='h4' content='Contribute' />
                                    <List link inverted>
                                        <List.Item as='a'>Campaign</List.Item>
                                        <List.Item as='a'>Donate</List.Item>
                                        <List.Item as='a'>Freelance</List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column width={7}>
                                    <Header as='h4' inverted>
                                        Furiosa
                                    </Header>
                                    <p id="message-from-us">
                                        We'd like to give a massive shout out to everyone for the amazing support we've received. Absolutely none of this would have been possible without you <Icon name='heart' />
                                    </p>
                                    <p id="messenger2">© 2019 FURIOSA</p>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </Segment>
            </div>
        );
    }

}

export default Footer;
