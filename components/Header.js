import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';
import $ from 'jquery';

class Header extends Component {

    async componentDidMount() {

        let Messenger = function(el) {
            'use strict';
            var m = this;

            m.init = function() {
                m.codeletters = "&#*+%?£@§$";
                m.message = 0;
                m.current_length = 0;
                m.fadeBuffer = false;
                m.messages = [
                    'furiosa.io',
                    'Codename:Furiosa',
                    'Cool.'
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
                    setTimeout(m.animateFadeBuffer, 80);
                } else {
                    setTimeout(m.cycleText, 3000);
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
        let messenger = new Messenger($('#messenger'));
    }

    render() {
        return (
            <Menu className='main-menu' pointing secondary>
                <Menu.Menu>
                    <Menu.Item>
                        <Link prefetch href="/" route="/">
                            <a className="item">Campaigns</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link prefetch href={`/contracts`} route={`/contracts`}>
                            <a className="item">Contracts</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link prefetch href={`/freelancers`} route={`/freelancers`}>
                            <a className="item">Freelancers</a>
                        </Link>
                    </Menu.Item>
                    {!this.props.authenticated &&
                        <Menu.Item>
                            <Link prefetch href={`/auth/login`} route={`/auth/login`}>
                                <a className="item">Login</a>
                            </Link>
                        </Menu.Item>}
                    {this.props.authenticated &&
                        <Menu.Item>
                            <Link prefetch href={`/auth/logout`} route={`/auth/logout`}>
                                <a className="item">Logout ({this.props.user})</a>
                            </Link>
                        </Menu.Item>}
                </Menu.Menu>
                <Menu.Header>
                    <h3 id='messenger'>_</h3>
                </Menu.Header>
            </Menu>
        );
    }

}

export default Header;
