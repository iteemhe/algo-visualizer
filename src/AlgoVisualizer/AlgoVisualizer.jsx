import React, { Component } from "react";
import Node from "./Node/Node";
import "./AlgoVisualizer.css";

export default class AlgoVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        Foo
        <Node></Node>
      </div>
    );
  }
}
