import React from "react";
import "./Content.css";
import Card from "../Card/Card";

class Content extends React.Component {
  render() {
    return (
      <div className="content-container">
        <Card/> 
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
      </div>
    )
  }
}

export default Content; 