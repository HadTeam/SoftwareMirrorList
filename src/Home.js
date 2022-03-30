import React, {useEffect} from 'react';
import {EventEmitter} from "events";

import {Container, Divider, Grid, Header, Icon, Image, List, Message, Modal, Segment} from "semantic-ui-react";

import softwareData from './data/softwares.json';
import {Link} from "react-router-dom";

const eventEmitter = new EventEmitter();

function SoftwareList() {
    
    return (
        <Container>
            <Grid stackable columns={3}>
                {
                    softwareData.map((software, index) => {
                        return (
                            <Grid.Column
                                key={'softwareCard' + index}
                                onClick={() => {
                                    console.log("awa");
                                    eventEmitter.emit('openDownloadModal', {type: 'open', index: index})
                                }}
                            >
                                <a href='#'>
                                    <Segment raised>
                                        <Header>
                                            {software.icon.type === 'url' ?
                                                <Image href={software.icon.url}/> :
                                                <Icon name={software.icon.name}/>
                                            }
                                            <Header.Content>
                                                {software.name}
                                                <Header.Subheader>
                                                    {software.description}
                                                </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Segment>
                                </a>
                            </Grid.Column>
                        );
                    })
                }
            </Grid>
        </Container>
    );
}


function HomeModal() {
    let listener;
    const [state, dispatch] = React.useReducer((state, action) => {
        switch (action.type) {
            case 'open':
                return {...state, open: true, download: softwareData[action.index].download};
            case 'close':
            default:
                return {state, open: false, download: []};
        }
    }, {open: false, download: []});
    
    useEffect(() => {
        listener = eventEmitter.addListener("openDownloadModal", (data) => {
            dispatch(data);
            
            return function cleanup() {
                eventEmitter.removeListener(listener);
            }
        });
    }, []);
    
    return (
        <Modal
            open={state.open}
            onClose={() => dispatch('close')}
        >
            <Modal.Header>选择下载地址</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <List>
                        {
                            state.download.map((item, index) => {
                                return (
                                    <List.Item key={'downloadModalHeader' + index}>
                                        {item.name}
                                        <List.List>
                                            {
                                                item.list.map((item, index) => {
                                                    return (
                                                        <List.Item key={'downloadModalAddress' + index}>
                                                            <Link to={item.url}>{item.filename}</Link>
                                                        </List.Item>
                                                    );
                                                })
                                            }
                                        </List.List>
                                    </List.Item>
                                );
                            })
                        }
                    </List>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    );
}


export default function Home() {
    return (
        <div id='home'>
            <Header>
                <Icon name='settings'/>
                <Header.Content>
                    欢迎
                    <Header.Subheader>
                        这是一个搜集常用软件镜像下载地址的列表（仅针对中国大陆用户）
                    </Header.Subheader>
                </Header.Content>
            </Header>
            
            <Message icon warning>
                <Icon name='question'/>
                <Message.Content>
                    <Message.Header>
                        需要帮助
                    </Message.Header>
                    <List bulleted>
                        <List.Item key='submitQuestion'>提交问题</List.Item>
                        <List.Item key='checkFAQ'>查阅 FAQ</List.Item>
                    </List>
                </Message.Content>
            </Message>
            
            <Divider hidden/>
            
            <SoftwareList/>
            
            <HomeModal/>
        </div>
    );
}
