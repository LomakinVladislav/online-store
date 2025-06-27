import React from "react";
import Card from "../Card/Card";
import styles from "./Content.module.css"

class Content extends React.Component {
  render() {
    return (
      <div className={styles[`content-container`]}>
        <Card/> 

      </div>
    )
  }
}

export default Content; 