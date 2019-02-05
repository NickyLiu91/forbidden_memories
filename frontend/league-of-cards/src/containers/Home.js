import React from "react";
import Collection from "./Collection.js"
import CardInfo from "../components/CardInfo.js"
import SideBar from "./SideBar.js"
import DuelField from "./DuelField.js"
import CardStore from "./CardStore.js"
import DecksList from "./DecksList.js"
import DuelistsList from "./DuelistsList.js"
import Header from "../components/Header.js"

export default class Home extends React.Component {
  state = {
    render: 'home',
    loggedIn: false,
    name: '',
    collection: [],
    allPlayers: [],
    currentDeck: '',
    currentDeckCards: [],
    currentPlayer: '',
    currentPlayerCollection: [],
    noDupesCurrentPlayerCollection: [],
    selectedCard: '',
    player2: '',
    player2Deck: [],
    password: '',
    decksList: [],
    gold: ''
  }

  log = () => {
    this.setState({
      currentPlayer: '',
      currentDeck: "",
      currentPlayerCollection: [],
      currentDeckCards: [],
      loggedIn: !this.state.loggedIn
    })
  }

  handleName = (event) => {
    this.setState({
      name: event.target.value
    })
  }

  handlePassword = (event) => {
    this.setState({
      password: event.target.value
    })
  }

  // generateDeckCard = (player, number) => {
  //
  //   let randomCard = this.state.collection[Math.floor(Math.random() * this.state.collection.length)]
  //
  //   randomCard.enemydeckCardId = number
  //
  //   if (this.state.currentDeckCards.filter(
  //     cardObj => cardObj.name === randomCard.name
  //   ).length < 1) {
  //     // player.decks[0].cards = [...player.decks[0].cards, randomCard]
  //
  //     fetch(`http://localhost:3000/api/v1/deckcards`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //       },
  //       body: JSON.stringify(
  //           {
  //             deck_id: player.id,
  //             card_id: randomCard.key
  //           }
  //     )})
  //   }
  // }

  // generateDeck = (playerObj) => {
  //   let deck
  //   fetch(`http://localhost:3000/api/v1/players/${playerObj.id}/decks`)
  //   .then(res => res.json())
  //   .then(json => {deck = json})
  //   .then(res => {
  //     fetch("http://localhost:3000/api/v1/cards", {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json'
  //       },
  //       body: JSON.stringify(
  //           {
  //             player_id: this.state.currentPlayer.id,
  //             name: "Amumu",
  //             title: "the Sad Mummy",
  //             role: "Tank",
  //             rarity: "Bronze",
  //             attack: 200,
  //             magic: 800,
  //             defense: 600,
  //             description: "''Solitude can be lonelier than death.''<br><br>A lonely and melancholy soul from ancient Shurima, Amumu roams the world in search of a friend. Cursed by an ancient spell, he is doomed to remain alone forever, as his touch is death and his affection ...",
  //             image: "Amumu.png",
  //             cardtype: "Champion",
  //           }
  //       )})
  //
  //   })
  // }

  getAllPlayers = () => {
    let newPlayersArray = []
    fetch("http://localhost:3000/api/v1/players")
    .then(response => response.json())
    .then(json => this.setState({
      allPlayers: json
    }))
    // .then(json => {
    //   json.map(playerObj => {
    //     let newPlayerObj = playerObj
    //     newPlayerObj.decks[0].cards = []
    //       newPlayersArray = [...newPlayersArray, newPlayerObj]
    //     }
    //   )
    // })
    // .then(res => this.setState({
    //   allPlayers: newPlayersArray
    // }, () => newPlayersArray.map(
    //   playerObj => {
    //     if (playerObj.computer === true) {
    //       playerObj.decks[0].cards = []
    //       this.generateDeck(playerObj)
    //     }
    //   }
    // )))
    // .then(res => {
    //   fetch("http://localhost:3000/api/v1/decks")
    //   .then(res => res.json())
    //   .then(json => this.setState({
    //     decksList: json
    //   }))
    // })
  }

  updateDecksList = () => {
    fetch(`http://localhost:3000/api/v1/players/${this.state.currentPlayer.id}/decks`)
    .then(response => response.json())
    .then(json => this.setState({
      currentPlayerCollection: json
    }, () => this.generateNoDupesCurrentPlayerCollection()))
  }

  getPlayer = (event) => {
    event.preventDefault()
    this.setState({
      currentPlayer: this.state.allPlayers.find(playerObj => playerObj.name === this.state.name
        && playerObj.password_digest === this.state.password
      )
    }, () => {
      fetch(`http://localhost:3000/api/v1/players/${this.state.currentPlayer.id}`)
      .then(res => res.json())
      .then(res => this.setState({
        currentPlayer: res,
        currentPlayerCollection: res.cards,
        currentDeck: res.decks[0],
        loggedIn: true,
        gold: res.gold
      }, () => {
        fetch(`http://localhost:3000/api/v1/players/${this.state.currentPlayer.id}/decks/${this.state.currentDeck.id}`)
        .then(res => res.json())
        .then(res => this.setState({
          currentDeckCards: res.cards
        }))
        this.generateNoDupesCurrentPlayerCollection()
      }))
    })
  }

  generateNoDupesCurrentPlayerCollection = () => {
    // let newCollection = this.state.collection
    // this.state.currentPlayerCollection.forEach((card) => {
    //     newCollection.filter(collectionCard => collectionCard.name === card.name)[0].quantity ++
    // })

    let newCollection = this.state.collection.map(card => {
        card.quantity = this.state.currentPlayerCollection.filter(cardObj => cardObj.name === card.name).length;
        return card
      }
    )

    this.setState({
      noDupesCurrentPlayerCollection: newCollection
    })
  }

  fetchCards = () => {
    fetch("http://localhost:3000/api/v1/allcards")
    .then(response => response.json())
    .then(json => this.setState({
      collection: json
    }))
  }

  printState = (event) => {
    event.preventDefault()
    console.log(this.state)
  }

  getDeck = (deck) => {
    let desiredDeck
    console.log(deck)
    fetch("http://localhost:3000/api/v1/decks")
    .then(res => res.json())
    .then(res => desiredDeck = res.find(
      deckObj => deck.name === deckObj.name
    ))
    .then(res => this.setState(
      {
        currentDeck: desiredDeck,
        currentDeckCards: deck.cards
      }, () => this.renderHome())
    )
  }

  renderHome = () => {
    this.setState({
      render: 'home'
    })
  }

  numberNotInDeck = () => {

  }

  addToDeck = (card) => {

    if (this.state.currentDeckCards.filter(
      cardObj => cardObj.name === card.name
    ).length < 3 &&
    this.state.currentDeckCards.length < 40 &&
    card.quantity - this.state.currentDeckCards.filter(cardObj => cardObj.name === card.name).length > 0) {

      let cardToAdd = this.state.currentPlayerCollection.filter(cardObj =>
        cardObj.name === card.name && this.state.currentDeckCards.filter(cardObj2 => cardObj2.id === cardObj.id ).length === 0
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
                deck_id: this.state.currentDeck.id,
                card_id: cardToAdd.id
              }
        )})
        .then(response => this.setState({
          currentDeckCards: [...this.state.currentDeckCards, cardToAdd]
        }))
    }

  }

  removeFromDeck = (card) => {
    // let newDeckCards = this.state.currentDeckCards
    let deckCardToDelete
    console.log(this.state.currentDeck.id)
    console.log(card.id)
    // let removeIndex = newDeckCards.findIndex(
    //   cardObj => cardObj === card.name
    // )
    //
    // newDeckCards.splice(removeIndex, 1)

    fetch(`http://localhost:3000/api/v1/deckcards`)
    .then(res => res.json())
    .then(json => deckCardToDelete = json.filter(
      obj => obj.card.id === card.id && obj.deck.id === this.state.currentDeck.id
    )[0])
    .then(res => fetch(`http://localhost:3000/api/v1/deckcards/${deckCardToDelete.id}`, {
      method: 'DELETE'
    }))
    .then(response => {
      this.setState({
        currentDeckCards: this.state.currentDeckCards.filter(cardObj => cardObj.id !== card.id)
      })
    })
  }

  componentDidMount() {
    this.fetchCards()
    this.getAllPlayers()
  }

  renderStuff = (event) => {
    console.log(event.target.className)
    if (event.target.className === 'collection') {
      fetch(`http://localhost:3000/api/v1/decks/${this.state.currentDeck.id}`)
      .then(res => res.json())
      .then(json => {this.setState({
          currentDeckCards: json.cards
        }, () => {
          this.setState({
            render: 'collection'
          })
        })
      })
    } else {
      this.setState({
        render: event.target.className
      })
    }
  }

  getCardInfo = (card) =>{
    this.setState({
      selectedCard: card
    })
    this.renderCard()
  }

  renderCard = () => {
    this.setState({
      render: 'cardinfo'
    })
  }

  getDuelist = (player) => {
    let desiredDeck
    fetch(`http://localhost:3000/api/v1/decks/${this.state.currentDeck.id}`)
    .then(res => res.json())
    .then(res => this.setState(
      {
        currentDeckCards: res.cards
      }, () => {
        fetch(`http://localhost:3000/api/v1/players/${player.id}/decks/1`)
        .then(response => response.json())
        .then(json => {
          this.setState({
            player2: player,
            player2Deck: json.cards
          }, () => { this.renderDuel()}
        )
        })
      }
    ))

  }

  renderDuel = () => {
    this.setState({
      render: 'duel'
    })
  }

  // createPlayerCollection = () => {
  //
  //     this.state.collection.map(
  //       cardObj => fetch(`http://localhost:3000/api/v1/collections`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Accept': 'application/json',
  //         },
  //         body: JSON.stringify(
  //             {
  //               player_id: this.state.allPlayers.find(playerObj => playerObj.name === this.state.name).id,
  //               card_id: cardObj.id
  //             }
  //         )})
  //     )
  //     let createdPlayer = this.state.allPlayers.find(
  //       playerObj => playerObj.name === this.state.name
  //     )
  //
  //     createdPlayer.cards = this.state.collection
  // }

  createPlayer = (event) => {
    event.preventDefault()
    fetch(`http://localhost:3000/api/v1/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(
          {
            name: this.state.name,
            password_digest: this.state.password,
            image: 'image/TwistedFatePortrait.png',
            computer: false,
            level: "1-1",
            gold: 1000
          }
    )}).then(res => this.setState({
        allPlayers: [...this.state.allPlayers, {id: this.state.allPlayers.length + 1, name: this.state.name, decks: [], cards: [], collection: [], image: 'image/TwistedFatePortrait.png', computer: false, password_digest: this.state.password}],
        render: 'home'
    }, () => {
      fetch(`http://localhost:3000/api/v1/decks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(
            {
              name: "Deck 1",
              player_id: this.state.allPlayers[this.state.allPlayers.length - 1].id
            }
      )})
      // .then(res => {this.generateDeck(this.state.allPlayers[this.state.allPlayers.length - 1])})
    }
  ))
  }

  updateCurrentPlayerCollection = () => {
    fetch(`http://localhost:3000/api/v1/players/${this.state.currentPlayer.id}/cards`)
    .then(response => response.json())
    .then(json => this.setState({
      currentPlayerCollection: json
    }, () => this.generateNoDupesCurrentPlayerCollection()))
  }

  buyPack = () => {
    fetch(`http://localhost:3000/api/v1/players/${this.state.currentPlayer.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(
          {
            gold: this.state.gold - 100
          }
    )})
    .then(res => {
      this.setState({
        gold: this.state.gold - 100
      })
    })
  }

  reward = () => {
    let listOfCards = this.state.player2deck

    let number = Math.floor(Math.random() * 100) + 1
    let newCard

    const diamonds = listOfCards.filter(obj => obj.rarity === "Diamond")
    const platinums = listOfCards.filter(obj => obj.rarity === "Platinum")
    const golds = listOfCards.filter(obj => obj.rarity === "Gold")
    const silvers = listOfCards.filter(obj => obj.rarity === "Silver")
    const bronzes = listOfCards.filter(obj => obj.rarity === "Bronze")

    if (number > 98) {
      if (diamonds.length === 0 && platinums.length === 0 && golds.length === 0 && silvers.length === 0) {
        newCard = bronzes[Math.floor(Math.random() * bronzes.length)]
      } else if (diamonds.length === 0 && platinums.length === 0 && golds.length === 0) {
        newCard = silvers[Math.floor(Math.random() * silvers.length)]
      } else if (diamonds.length === 0 && platinums.length === 0) {
        newCard = golds[Math.floor(Math.random() * golds.length)]
      } else if (diamonds.length === 0) {
        newCard = platinums[Math.floor(Math.random() * platinums.length)]
      } else {
        newCard = diamonds[Math.floor(Math.random() * diamonds.length)]
      }
    } else if ( number > 93) {
      if (platinums.length === 0 && golds.length === 0 && silvers.length === 0) {
        newCard = bronzes[Math.floor(Math.random() * bronzes.length)]
      } else if (platinums.length === 0 && golds.length === 0 ) {
        newCard = silvers[Math.floor(Math.random() * bronzes.length)]
      } else if (platinums.length === 0) {
        newCard = golds[Math.floor(Math.random() * bronzes.length)]
      } else {
        newCard = platinums[Math.floor(Math.random() * bronzes.length)]
      }
    } else if ( number > 85) {
      if (golds.length === 0 && silvers.length === 0) {
        newCard = bronzes[Math.floor(Math.random() * bronzes.length)]
      } else if (golds.length === 0 ) {
        newCard = silvers[Math.floor(Math.random() * bronzes.length)]
      } else {
        newCard = golds[Math.floor(Math.random() * bronzes.length)]
      }
    } else if ( number > 50) {
      if (silvers.length === 0) {
        newCard = bronzes[Math.floor(Math.random() * bronzes.length)]
      } else {
        newCard = silvers[Math.floor(Math.random() * bronzes.length)]
      }
    } else {
      newCard = bronzes[Math.floor(Math.random() * bronzes.length)]
    }

    fetch("http://localhost:3000/api/v1/cards", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(
          {
            player_id: this.props.currentPlayer.id,
            key: newCard.key,
            name: newCard.name,
            title: newCard.title,
            role: newCard.role,
            rarity: newCard.rarity,
            attack: newCard.attack,
            magic: newCard.magic,
            defense: newCard.defense,
            description: newCard.description,
            image: newCard.image,
            cardtype: newCard.cardtype,
            effect: newCard.effect,
            target: newCard.target
          }
      )})
      .then(response => this.props.updateCurrentPlayerCollection())
      .then(fetch(`http://localhost:3000/api/v1/players/${this.state.currentPlayer.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(
            {
              gold: this.state.gold + 30
            }
      )})
      .then(res => {
        this.setState({
          gold: this.state.gold + 30
        })
      }))
  }


  render() {
    if (this.state.render === 'home' && this.state.loggedIn === false) {
      return(
        <div>
        <img id="shurima" src="image/shurima_sun_01.jpg" />
          <div id="home">
          <h1>FORBIDDEN MEMORIES</h1>
            <form>
              <button onClick={event => this.printState(event)}>State</button>
              <h1>Log-In</h1>
                Account: <input type="text" value={this.state.name} onChange={event => this.handleName(event)}/>
                <br/>
                <br/>
                Password: <input type="password" value={this.state.password} onChange={event => this.handlePassword(event)}/>
                <br/>
                <br/>
                <button type="button" onClick={this.getPlayer}>Submit</button>
            </form>
              <br/>
            <button className="create" onClick={event => {this.renderStuff(event)}}>Create Account</button>
          </div>
        </div>
      )
    } else if (this.state.render === 'home' && this.state.loggedIn === true){
      return(
        <div>
          <img id="demacia" src="image/demacia.jpeg" />
          <div id="logged-in">
            <h1>FORBIDDEN MEMORIES</h1>
              <button onClick={event => this.printState(event)}>State</button>
              <h1>Welcome, {this.state.currentPlayer.name}!</h1>
              <br/>
              <br/>
              <button className="collection" onClick={event => {this.renderStuff(event)}}>Collection</button>
              <br/>
              <br/>
              <button className="store" onClick={event => {this.renderStuff(event)}}>Card Store</button>
              <br/>
              <br/>
              <button className="decksList" onClick={event => {this.renderStuff(event)}}>Decks</button>
              <br/>
              <br/>
              <button className="duelistsList" onClick={event => {this.renderStuff(event)}}>DUEL!!!</button>
              <br/>
              <br/>
              <button onClick={this.log}>Log-Out</button>
          </div>
        </div>
      )
    } else if (this.state.render === 'create' ){
      return(
        <div>
        <img id="shurima" src="image/shurima_sun_01.jpg" />
          <div id="home">
            <h1>FORBIDDEN MEMORIES</h1>
              <form>
                Account Name: <input type="text" value={this.state.name} onChange={event => this.handleName(event)}/>
                <br/>
                <br/>
                Password: <input type="password" value={this.state.password} onChange={event => this.handlePassword(event)}/>
                <br/>
                <br/>
                <button type="button" onClick={this.createPlayer}>Submit</button>
              </form>
          </div>
        </div>
      )
    } else if (this.state.render === 'decksList') {
      return(
        <div>
          <Header renderStuff={this.renderStuff}/>
          <DecksList
            currentPlayer={this.state.currentPlayer}
            renderCollection={this.renderCollection}
            renderHome={this.renderHome}
            getDeck={this.getDeck}
            currentDeck={this.state.currentDeck}
          />
        </div>
      )
    } else if (this.state.render === 'store') {
      return(
        <div>
          <Header renderStuff={this.renderStuff} />
          <CardStore
            collection={this.state.collection}
            currentPlayer={this.state.currentPlayer}
            renderCollection={this.renderCollection}
            packCard={this.state.packCard}
            updateCurrentPlayerCollection={this.updateCurrentPlayerCollection}
            currentDeckCards={this.state.currentDeckCards}
            gold={this.state.gold}
            buyPack={this.buyPack}
          />
        </div>
      )
    } else if (this.state.render === 'collection') {
      return(
        <div>
          <Header renderStuff={this.renderStuff} />
          <div className="container-with-decklist">
            <Collection
              noDupesCurrentPlayerCollection={this.state.noDupesCurrentPlayerCollection}
              getCardInfo={this.getCardInfo}
              renderHome={this.renderHome}
              currentDeckCards={this.state.currentDeckCards}
              addToDeck={this.addToDeck}
            />
            <SideBar
            currentDeckCards={this.state.currentDeckCards}
            removeFromDeck={this.removeFromDeck}
            />
          </div>
        </div>

      )
    } else if (this.state.render === 'cardinfo') {
      return(
        <div>
          <Header renderStuff={this.renderStuff} />
            <div className="container-with-decklist">
              <CardInfo selectedCard={this.state.selectedCard}
                addToDeck={this.addToDeck}
                renderCollection={this.renderCollection}
                renderHome={this.renderHome}
              />
              <SideBar currentDeckCards={this.state.currentDeckCards}
              removeFromDeck={this.removeFromDeck}/>
            </div>
        </div>
      )
    } else if (this.state.render === 'duelistsList') {
      return(
        <div>
          <Header renderStuff={this.renderStuff} />
          <div className="duelist-list-container">
            <DuelistsList
              allPlayers={this.state.allPlayers}
              getDuelist={this.getDuelist}
              renderDuel={this.renderDuel}
            />
          </div>
        </div>
      )
    } else if (this.state.render === 'duel') {
      return(
        <div>
          <Header renderStuff={this.renderStuff}/>
          <DuelField
            player1={this.state.currentPlayer}
            player1Deck={this.state.currentDeckCards}
            player2={this.state.player2}
            player2Deck={this.state.player2Deck}
            renderHome={this.renderHome}
            renderWin={this.renderWin}
          />
        </div>
      )
    }
  }
}
