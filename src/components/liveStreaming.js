import React from 'react';
import './liveStreaming.css';
import socketio from "socket.io-client";

let socket = null;

class LiveStreaming extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            side: 'side1',
            liveStreamId: '',
            error: false,
            errorMsg: '',
            url: 'https://appr.tc'
        }
    }

    componentDidMount() {
        socket = socketio.connect("http://localhost:7000")
        socket.connect()
        //Listen for data on the "outgoing data" namespace and supply a callback for what to do when we get one. In this case, we set a state variable
        socket.on("connection", data => {
            console.log("Data:", data)
        });
        socket.on("connection", (socket) => {
            console.log("Socket ID: " + socket.id)
            socket.emit("auth", socket.id)
        });
    }

    handleLiveStream = (e) => {
        if (this.state.liveStreamId === "") {
            e.target.checked = false
            this.setState({ error: true, errorMsg: "Live stream id can't be empty" })
            setTimeout(
                () => this.setState({ error: false, errorMsg: "" }),
                4000
            );
        }
        else{
            e.target.checked ? socket.emit('liveStream', "{'action': 'start', 'side': '" + this.state.side + "', streamId: '" + this.state.liveStreamId + "' }") : socket.emit('liveStream', "{'action': 'stop', 'side': '" + this.state.side + "', streamId: '" + this.state.liveStreamId + "' }")
            this.setState({url: "https://appr.tc/r/" + this.state.liveStreamId})
        }
    }

    render() {
        return (
            <div className="livestream-container">
                <div class="form-container">
                    <div class="form-container-controls" id="container-liveStreamID">
                        <label>Side &nbsp;</label>
                        <select placeholder="Side" id="side" class="space" 
                            onChange={e => this.setState({ side: e.target.value })} value={this.state.side}>
                                <option value={"side1"}>Side 1</option>
                                <option value={"side2"}>Side 2</option>
                        </select>

                        <label>Live Stream ID &nbsp;</label>
                        <input type="text" placeholder="Stream ID" id="liveStreamId" class="space" maxlength="100"
                            onChange={e => this.setState({ liveStreamId: e.target.value })} value={this.state.liveStreamId} />

                        <label class="switch">
                            <input type="checkbox" id="liveStream" onClick={(e) => this.handleLiveStream(e)} />
                            <span class="slider"></span>
                        </label>
                    </div>
                    {this.state.error && <span class="error-message">{this.state.errorMsg}</span>}
                </div>
                <div id="frame-container">
                    <iframe id="embed" scrolling="no" seamless="seamless" src={this.state.url} allow="camera;microphone" height="600" width="800" title="WebRTC server"></iframe>
                </div>
            </div>
        );
    }
}

export default LiveStreaming;
