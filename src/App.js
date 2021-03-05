import React from 'react';
import logo from './logo.svg';
import './App.css';
import socketio from "socket.io-client";
import LiveStreaming from './components/liveStreaming';

class App extends React.Component {

  constructor(props){
    super(props)
  }

  componentDidMount(){
    const socket = socketio.connect("http://localhost:7000")  
    socket.connect()
    //Listen for data on the "outgoing data" namespace and supply a callback for what to do when we get one. In this case, we set a state variable
    socket.on("connection", data => {
      console.log("Data:" , data)
    });
    socket.on("connection", (socket) => {
      console.log("Socket ID: " + socket.id)
      socket.emit("auth", socket.id)
    });
    socket.emit("capture", "Test message")
  }

  render(){
    return (
      <div className="App">
          <LiveStreaming/>
      </div>
    );
  }
}

export default App;
