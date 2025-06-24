import React from "react";
import Menu from "../../components/Menu/Menu";
import Header from "../../components/Header/Header";
import Content from "../../components/Content/Content";
import "./Main.css";

class Main extends React.Component {
  render() {
    return (
    <div className="main-container">
      <header>
        <Header />
      </header>
      <div className="main-content">
          <Menu />
          <Content />
      </div>
    </div>
    )
  }
}

export default Main;