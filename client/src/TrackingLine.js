import React, { Component } from "react";
import "./HelloWorld.css";

class TrackingTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      greeting: "Hola"
    };
    this.frenchify = this.frenchify.bind(this);
  }
  frenchify() {
    this.setState({ greeting: "Bonjour" });
  }
  render() {
    return (
      <div className="HelloWorld">
        {this.state.greeting} {this.props.name}!
        <br />
        <button onClick={this.frenchify}>Frenchify!</button>
      </div>
    );
  }
}

export default HelloWorld;
