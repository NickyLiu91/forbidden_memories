import React from "react";
import {connect} from 'react-redux';
import Card from "../components/Card.js"

class Collection extends React.Component {

  state = {
    // list: this.props.noDupesCurrentPlayerCollection,
    sortNumber: 0,
    sortTypes: ['none', 'attack', 'magic', 'defense', 'power', 'quantity', "rarity"]
  }

  generateCards = () => {
    return this.props.noDupesCurrentPlayerCards.map(
      cardObj => <Card key={cardObj.id} location={"collection"} card={cardObj}
      getCardInfo={this.getCardInfo} copies={this.props.deckCards} addToDeck={this.addToDeck}/>
    )
  }

  addToDeck = (card) => {

    if (this.props.deckCards.filter(
      cardObj => cardObj.name === card.name
    ).length < 3 &&
    this.props.deckCards.length < 40 &&
    card.quantity - this.props.deck.filter(cardObj => cardObj.name === card.name).length > 0) {

      let cardToAdd = this.state.currentPlayerCollection.filter(cardObj =>
        cardObj.name === card.name && this.props.deck.filter(cardObj2 => cardObj2.id === cardObj.id ).length === 0
      )[0]
      console.log(cardToAdd)

        fetch(`http://localhost:3000/api/v1/deckcards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(
              {
                deck_id: this.props.deck.id,
                card_id: cardToAdd.id
              }
        )})
        // .then(response => {this.setState({
        //   currentDeckCards: [...this.props.deck, cardToAdd]
        // })
        .then(res => {
          this.props.changeDeckCards([...this.props.deck, cardToAdd])
        })
    }
  }

  highestAttack = (monster) => {
    if (monster.attack > monster.magic) {
      return monster.attack
    } else {
      return monster.magic
    }
  }

  sort = () => {
    let newNumber = this.state.sortNumber + 1
    let newSortType = this.state.sortTypes[newNumber]
    let newList = this.state.list

    if (newNumber === this.state.sortTypes.length) {
      newList = this.props.noDupesCurrentPlayerCards
      newNumber = 0
    } else {
      if (newSortType === 'power') {
        newList.sort( (a, b) => {
          if(this.highestAttack(a) > this.highestAttack(b)) {
            return -1
          } else {
            return 1
          }
          return 0
        })
      } else if (newSortType === 'rarity'){
        newList.sort( (a, b) => {
          if (a[newSortType] === 'Diamond' && b[newSortType] === 'Platinum') {
            return -1
          } else if (a[newSortType] === 'Diamond' && b[newSortType] === 'Gold') {
            return -1
          } else if (a[newSortType] === 'Diamond' && b[newSortType] === 'Silver') {
            return -1
          } else if (a[newSortType] === 'Diamond' && b[newSortType] === 'Bronze') {
            return -1
          } else if (a[newSortType] === 'Platinum' && b[newSortType] === 'Gold') {
            return -1
          } else if (a[newSortType] === 'Platinum' && b[newSortType] === 'Silver') {
            return -1
          } else if (a[newSortType] === 'Platinum' && b[newSortType] === 'Bronze') {
            return -1
          } else if (a[newSortType] === 'Gold' && b[newSortType] === 'Silver') {
            return -1
          } else if (a[newSortType] === 'Gold' && b[newSortType] === 'Bronze') {
            return -1
          } else if (a[newSortType] === 'Silver' && b[newSortType] === 'Bronze') {
            return -1
          } else {
            return 1
          }
          return 0
        })
      } else {
        newList.sort( (a, b) => {
          if(a[newSortType] > b[newSortType]) {
            return -1
          } else {
            return 1
          }
          return 0
        })
      }
    }
    this.setState({
      sortNumber: newNumber,
      list: newList
    })
  }

  render() {
    return(
      <div>
        <img id="bilgewater" src="image/bilgewater.jpeg"/>
        <div>
        <h1>Card List</h1>
        <button onClick={this.sort}>{this.state.sortTypes[this.state.sortNumber]}</button>
          <div id="card-list">
            {this.generateCards()}
          </div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    account: state.accountChanger.account,
    currentPlayerCards: state.currentPlayerCardsChanger.currentPlayerCards,
    noDupesCurrentPlayerCards: state.noDupesCurrentPlayerCardsChanger.noDupesCurrentPlayerCards,
    deck: state.deckChanger.deck,
    deckCards: state.deckCardsChanger.deckCards,
    card: state.cardChanger.card,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeAccount: (event) => dispatch({type: 'CHANGE_ACCOUNT', newAccount: event}),
    changeCurrentPlayerCards: (event) => dispatch({type: 'CHANGE_CURRENTPLAYERCARDS', newCurrentPlayerCards: event}),
    changeNoDupesCurrentPlayerCards: (event) => dispatch({type: 'CHANGE_NODUPESCURRENTPLAYERCARDS', newNoDupesCurrentPlayerCards: event}),
    changeDeck: (event) => dispatch({type: 'CHANGE_DECK', newDeck: event}),
    changeDeckCards: (event) => dispatch({type: 'CHANGE_DECKCARDS', newDeckCards: event}),
    changeCard: (event) => dispatch({type: 'CHANGE_CARD', newCard: event}),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Collection);
