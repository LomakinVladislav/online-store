import React from "react";
import "./Card.css";

export class Card extends React.Component {
  cardName = 'Имя колоды'
  price = '0.00'

  render() {
    return (
      <div className="card-container">
        <div className="card-price">{this.price}</div>
        <div className="card-name">{this.cardName}</div>
      </div>
    )
  }
}

export default Card;