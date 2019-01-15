import React from "react";

import Hand from "./Hand.js"
import SpellField from "./SpellField.js"
import MonsterField from "./MonsterField.js"
import ActionBox from "../components/ActionBox.js"
import Graveyard from "./Graveyard.js"

let totalDamage = 4000

export default class DuelField extends React.Component {

  state = {
    turn: 1,
    currentPlayer: "player1",
    currentOpponent: "player2",
    summoned: false,
    player1: this.props.player1,
    player1Life: 4000,
    player1Monsters: [{}, {}, {}, {}, {}],
    player1Spells: [{}, {}, {}, {}, {}],
    player1Hand: [],
    player1Deck: this.props.player1Deck,
    player1Graveyard: [],
    player2: this.props.player2,
    player2Life: 4000,
    player2Monsters: [{}, {}, {}, {}, {}],
    player2Spells: [{}, {}, {}, {}, {}],
    player2Hand: [],
    player2Deck: this.props.player2Deck,
    player2Graveyard: [],
    actionType: '',
    selectedCard: '',
    selectedTarget: '',
    selectedItemTarget: ''
  }

  swapCurrentPlayer = () => {
    if (this.state.currentPlayer === "player1") {
      this.setState({
        currentPlayer: "player2",
        currentOpponent: "player1"
      }, () => {this.drawCard()})
    } else if (this.state.currentPlayer === "player2") {
      this.setState({
        currentPlayer: "player1",
        currentOpponent: "player2"
      }, () => {this.drawCard()})
    }
  }

  emptyField = (field) => {
    return field.every(
      enemyObject => Object.keys(enemyObject).length === 0
    )
  }

  start5CardsPlayer = () => {
    let newDeck = this.state.player1Deck
    let newHand = []
    let newCard
    let i = 0
    for(i = 0; i < 5; i ++) {
      if (this.state.player1Deck.length > 0) {
        newCard = newDeck.pop()
        newHand = [...newHand, newCard]
      } else {
        this.setState({
          player1Life: -9999
        })
      }
    }
    this.setState({
      player1Deck: newDeck,
      player1Hand: newHand
    })
  }

  start5CardsComputer = () => {
    let newDeck = this.state.player2Deck
    let newHand = []
    let newCard
    let i = 0
    for(i = 0; i < 5; i ++) {
      if (this.state.player2Deck.length > 0) {
        newCard = newDeck.pop()
        console.log(newCard)
        newHand = [...newHand, newCard]
      } else {
        this.setState({
          player2Life: -9999
        })
      }
    }
    this.setState({
      player2Deck: newDeck,
      player2Hand: newHand
    })
  }

  displayGraveyard1 = () => {
    this.setState({
      actionType: 'displayPlayer1Graveyard'
    })
  }

  displayGraveyard2 = () => {
    this.setState({
      actionType: 'displayPlayer2Graveyard'
    })
  }

  setUpDecks = () => {
    let player1Deck = []
    let player2Deck = []

    this.props.player1Deck.map(
      cardObj => {
        let newCardObj = cardObj
        newCardObj.position = ''
        newCardObj.attacked = false
        newCardObj.target = ''
        newCardObj.originalAttack = cardObj.attack
        newCardObj.originalMagic = cardObj.magic
        newCardObj.originalDefense = cardObj.defense
        player1Deck = [...player1Deck, newCardObj]
      }
    )

    this.props.player2Deck.map(
      cardObj => {
        let newCardObj = cardObj
        newCardObj.position = ''
        newCardObj.attacked = false
        player2Deck = [...player2Deck, newCardObj]
      }
    )

    this.setState({
      player1Deck: player1Deck,
      player2Deck: player2Deck
    })
  }

  componentDidMount() {
    this.setUpDecks()
    this.start5CardsPlayer()
    this.start5CardsComputer()
  }

  cancel = () => {
    this.setState({
      actionType: ''
    })
  }

  clickHandCard = (card) => {
    console.log(card)
    // console.log(this.state.player1.id === this.state.currentPlayer.id)
    // console.log(this.state.summoned === false)
    if (card.cardtype === "Champion") {
      if (this.state.summoned === false && this.state.currentPlayer === "player1") {
        this.setState({
          selectedCard: card,
          actionType: "summon-position"
        })
      }
    } else if (card.cardtype === "Ability") {
      if (card.name === "Requiem" || card.name === "Demacian Justice" || card.name === "Primordial Burst" || card.name === "Silver Bolts") {
        this.setState({
          selectedCard: card,
          actionType: "non-target ability"
        })
      }
    } else if (card.cardtype === "Item") {
      this.setState({
        selectedCard: card,
        actionType: "item"
      })
    }
  }

  playMonsterAttack = () => {
    let newMonsterField = this.state.player1Monsters
    let newHand = this.state.player1Hand.filter(
      cardObj => cardObj.id !== this.state.selectedCard.id
    )

    let emptySlot = this.state.player1Monsters.findIndex(
      obj => Object.keys(obj).length === 0
    )

    let newMonster = this.state.selectedCard
    newMonster.position = "attack"

    newMonsterField.splice(emptySlot, 1, this.state.selectedCard)

    this.setState({
      player1Monsters: newMonsterField,
      player1Hand: newHand,
      actionType: '',
      summoned: true,
    })
  }

  playMonsterDefense = () => {
    let newMonsterField = this.state.player1Monsters
    let newHand = this.state.player1Hand.filter(
      cardObj => cardObj.id !== this.state.selectedCard.id
    )

    let emptySlot = this.state.player1Monsters.findIndex(
      obj => Object.keys(obj).length === 0
    )

    let newMonster = this.state.selectedCard
    newMonster.position = "defense"

    newMonsterField.splice(emptySlot, 1, this.state.selectedCard)

    this.setState({
      player1Monsters: newMonsterField,
      player1Hand: newHand,
      actionType: '',
      summoned: true,
    })
  }

  clickFieldMonster = (monster) => {
    if (this.state.currentPlayer === "player1") {
      this.setState({
        selectedCard: monster,
        actionType: 'fieldMonster'
      })
    }
  }

  changePosition = (monster) => {
    let newMonsterField = this.state.player1Monsters
    let monsterIndex = newMonsterField.findIndex(
      obj => obj.id === monster.id
    )

    if (monster.position === 'attack') {
      let newMonster = monster
      newMonster.position = 'defense'

      newMonsterField.splice(monsterIndex, 1, newMonster)
    } else {
      let newMonster = monster
      newMonster.position = 'attack'

      newMonsterField.splice(monsterIndex, 1, newMonster)
    }

    this.setState({
      player1Monsters: newMonsterField
    })
  }

  changeToAttacked = (monster, field) => {
    console.log('atacked')
    let newMonsterField = field
    let monsterIndex = newMonsterField.findIndex(
      obj => obj.id === this.state.selectedCard.id
    )

    let newMonster = monster
    newMonster.attacked = true
    newMonsterField.splice(monsterIndex, 1, newMonster)

    this.setState({
      player1Monsters: newMonsterField
    })
  }

  getEnemyTargetMode = (monster) => {
    this.setState({
      actionType: 'selectAttackTarget'
    })
  }

  highestAttack = (monster) => {
    if (monster.attack > monster.magic) {
      return monster.attack
    } else {
      return monster.magic
    }
  }

  sendSelectedCardFromPlayer1HandToGraveyard = () => {
    let newGraveyard = this.state.player1Graveyard
    let newHand = this.state.player1Hand.filter(
      cardObj => cardObj.id !== this.state.selectedCard.id
    )

    newGraveyard = [...this.state.player1Graveyard, this.state.selectedCard]

    this.setState({
      player1Hand: newHand,
      player1Graveyard: newGraveyard,
      actionType: ''
    })
  }

  sendOwnFromFieldToGraveyard = (monster) => {
      let newGraveyard = eval(`this.state.${this.state.currentPlayer}Graveyard`)
      let newMonsterField = eval(`this.state.${this.state.currentPlayer}Monsters`)
      let newSpellField = eval(`this.state.${this.state.currentPlayer}Spells`)

      let emptySlot = eval(`this.state.${this.state.currentPlayer}Monsters`).findIndex(
        obj => obj.id === monster.id
      )

      monster.attack = monster.originalAttack
      monster.magic = monster.originalMagic
      monster.defense = monster.originalDefense

      newGraveyard = [...eval(`this.state.${this.state.currentPlayer}Graveyard`), monster]

      // newSpellField = newSpellField.filter(obj => Object.keys(obj).length !== 0).filter(card => card.target.id !== monster.id)
      for (let i = 0; i < newSpellField.length; i ++) {
        if (Object.keys(newSpellField[i]).length !== 0 && newSpellField[i].target.id === monster.id){
          newSpellField.splice(i, 1, {})
          newGraveyard = [...newGraveyard, newSpellField[i]]
        }
      }

      newMonsterField.splice(emptySlot, 1, {})

      this.setState({
        [this.state.currentPlayer + 'Monsters']: newMonsterField,
        [this.state.currentPlayer + 'Graveyard']: newGraveyard,
        [this.state.currentPlayer + 'Spells']: newSpellField,
        actionType: ''
      })
  }

  sendEnemyFromFieldToGraveyard = (monster) => {
      let newGraveyard = eval(`this.state.${this.state.currentOpponent}Graveyard`)
      let newMonsterField = eval(`this.state.${this.state.currentOpponent}Monsters`)
      let newSpellField = eval(`this.state.${this.state.currentOpponent}Spells`)

      let emptySlot = eval(`this.state.${this.state.currentOpponent}Monsters`).findIndex(
        obj => obj.id === monster.id
      )

      monster.attack = monster.originalAttack
      monster.magic = monster.originalMagic
      monster.defense = monster.originalDefense

      newGraveyard = [...eval(`this.state.${this.state.currentOpponent}Graveyard`), monster]
      console.log(newSpellField)
      console.log(this.state.player1Spells)

      // newSpellField = newSpellField.filter(obj => Object.keys(obj).length !== 0).filter(card => card.target.id !== monster.id)
      for (let i = 0; i < newSpellField.length; i++) {
        if (Object.keys(newSpellField[i]).length !== 0 && newSpellField[i].target.id === monster.id){
          newGraveyard = [...newGraveyard, newSpellField[i]]
          newSpellField.splice(i, 1, {})
        }
      }

      newMonsterField.splice(emptySlot, 1, {})

      this.setState({
        [this.state.currentOpponent + 'Monsters']: newMonsterField,
        [this.state.currentOpponent + 'Graveyard']: newGraveyard,
        [this.state.currentOpponent + 'Spells']: newSpellField,
        actionType: ''
      })
  }

  fight = (monster1, monster2, field) => {
    if (this.state.currentPlayer === 'player1') {
      if (this.emptyField(this.state.player2Monsters)) {
        this.setState({
          player2Life: this.state.player2Life - this.highestAttack(monster1)
        })
      }
      if (monster2.position === 'defense') {
        if (this.highestAttack(monster1) > monster2.defense) {

          this.changeToAttacked(monster1, field)

          this.sendEnemyFromFieldToGraveyard(monster2)
        } else if (this.highestAttack(monster1) < monster2.defense) {
          this.changeToAttacked(monster1, field)
          this.setState({
            player1Life: this.state.player1Life - (monster2.defense - this.highestAttack(monster1))
          })
        }
      } else if (monster2.position === 'attack'){
        if (this.highestAttack(monster1) > this.highestAttack(monster2)) {
          this.setState({
            player2Life: this.state.player2Life - (this.highestAttack(monster1) - this.highestAttack(monster2))
          })
          this.changeToAttacked(monster1, field)
          this.sendEnemyFromFieldToGraveyard(monster2)
        } else if (this.highestAttack(monster1) < this.highestAttack(monster2)){
          this.setState({
            player1Life: this.state.player1Life - (this.highestAttack(monster2) - this.highestAttack(monster1))
          })

          this.sendOwnFromFieldToGraveyard(monster1)
        } else if (this.highestAttack(monster1) === this.highestAttack(monster2)){

          this.sendEnemyFromFieldToGraveyard(monster2)
          this.sendOwnFromFieldToGraveyard(monster1)
        }
      }
      this.setState({
        selectedTarget: '',
        actionType: ''
      })
    } else {
      console.log("computer fighting")
      if (monster2.position === 'defense') {
        if (this.highestAttack(monster1) > monster2.defense) {

          // this.changeToAttacked(monster1, field)
          this.sendEnemyFromFieldToGraveyard(monster2)
        } else if (this.highestAttack(monster1) < monster2.defense) {
          // this.changeToAttacked(monster1, field)
          this.setState({
            player2Life: this.state.player2Life - (monster2.defense - this.highestAttack(monster1))
          })
        }
      } else if (monster2.position === 'attack'){
        if (this.highestAttack(monster1) > this.highestAttack(monster2)) {

            totalDamage = totalDamage - (this.highestAttack(monster1) - this.highestAttack(monster2))


          // this.changeToAttacked(monster1, field)
          this.sendEnemyFromFieldToGraveyard(monster2)
        } else if (this.highestAttack(monster1) < this.highestAttack(monster2)){
          this.setState({
            player2Life: this.state.player2Life - (this.highestAttack(monster2) - this.highestAttack(monster1))
          })

          this.sendOwnFromFieldToGraveyard(monster1)
        } else if (this.highestAttack(monster1) === this.highestAttack(monster2)){

          this.sendEnemyFromFieldToGraveyard(monster2)
          this.sendOwnFromFieldToGraveyard(monster1)
        }
      }
    }
  }

  selectTarget = (monster) => {
    this.setState({
      selectedTarget: monster
    }, () => {console.log(this.state)})
  }

  computerPlayMonster = (monster) => {
    console.log("cpu play mnstr")
        console.log(this.state.player2Monsters)
    let newMonsterField = this.state.player2Monsters
    console.log(newMonsterField)
    let newHand = this.state.player2Hand.filter(
      cardObj => cardObj.id !== monster.id
    )

    let emptySlot = this.state.player2Monsters.findIndex(
      obj => Object.keys(obj).length === 0
    )
    console.log(emptySlot)
    console.log(newMonsterField)
    console.log(newMonsterField.splice(emptySlot, 1, monster))


    newMonsterField.splice(emptySlot, 1, monster)
    console.log(newMonsterField)
    console.log(this.state)

    this.setState({
      player2Monsters: newMonsterField,
      player2Hand: newHand
    })
  }

  drawCard = () => {
    if (this.state.currentPlayer === 'player1') {
      const newDeck = this.state.player1Deck
      let newCard
      if (this.state.player1Deck.length > 0) {
        newCard = newDeck.pop()
        this.setState({
          player1Deck: newDeck,
          player1Hand: [...this.state.player1Hand, newCard]
        })
      } else {
        this.setState({
          player1Life: -9999
        })
      }
    } else {
      const newDeck = this.state.player2Deck
      let newCard
      if (this.state.player2Deck.length > 0) {
        newCard = newDeck.pop()
        this.setState({
          player2Deck: newDeck,
          player2Hand: [...this.state.player2Hand, newCard]
        })
      } else {
        this.setState({
          player2Life: -9999
        })
      }
    }
  }

  showState = () => {
    console.log(this.state)
  }

  test = (object) => {
    return object.attack
  }

  getStrongestMonsterInOwnHand = () => {

    return this.state.player2Hand.filter(obj => obj.cardtype === 'Champion').sort( (a, b) => {
    	if(this.highestAttack(a) > this.highestAttack(b)) {
    		return -1
      } else {
      	return 1
      }
      return 0
    })[0]
  }

  getWeakestMonsterInOwnHand = () => {
    return this.state.player2Hand.filter(obj => obj.cardtype === 'Champion').sort( (a, b) => {
    	if(this.highestAttack(a) > this.highestAttack(b)) {
    		return 1
      } else {
      	return -1
      }
    })[0]
  }

  checkForKillableEnemyMonster = (monster, monster2) => {
    return ( Object.keys(monster).length !== 0 && monster.position === 'attack' && this.highestAttack(monster) <= this.highestAttack(monster2)) ||
    ( Object.keys(monster).length !== 0 && monster.position === 'defense' && monster.defense <= this.highestAttack(monster2))
  }

  playAppropriateMonster = () => {
    let strongestHandMonster = this.getStrongestMonsterInOwnHand()
    let weakestHandMonster = this.getWeakestMonsterInOwnHand()
    let killableEnemyMonster = this.state.player1Monsters.some(
      monster =>
        this.checkForKillableEnemyMonster(monster, strongestHandMonster)
    )

    if (this.state.player1Monsters.every(
      enemyObject => Object.keys(enemyObject).length === 0
    )) {
      strongestHandMonster.position = 'attack'
      this.computerPlayMonster(strongestHandMonster)
    } else if (killableEnemyMonster === false) {
      if (this.state.player2Hand.filter(obj => obj.name === "Requiem").length > 0) {
        let cardToUse = this.state.player2Hand.find(obj => obj.name === "Requiem")
        this.requiem(cardToUse)
      }
      weakestHandMonster.position = 'defense'

      this.computerPlayMonster(weakestHandMonster)
    } else if (killableEnemyMonster === true ) {
      strongestHandMonster.position = 'attack'

      this.computerPlayMonster(strongestHandMonster)
    }

    this.computerFieldMoves()
  }

  computerFieldMoves = () => {

    let sortedField = this.state.player2Monsters.sort( (a, b) => {
      	if(this.highestAttack(a) > this.highestAttack(b)) {
      		return -1
        } else {
        	return 1
        }
        return 0
      }
    )

    let sortedPlayerField = this.state.player1Monsters.sort( (a, b) => {
      	if(this.highestAttack(a) > this.highestAttack(b)) {
      		return -1
        } else {
        	return 1
        }
        return 0
      }
    )

    sortedField.map(
      monster => {
        // console.log(monster)
        // console.log(Object.keys(monster).length)
        if (Object.keys(monster).length !== 0) {
          if (this.emptyField(sortedPlayerField)) {
              totalDamage = totalDamage - this.highestAttack(monster)
          } else if (monster.position === 'attack' && this.findStrongestKillablePlayerMonster(monster) == undefined) {
            console.log(monster)
            console.log(this.findStrongestKillablePlayerMonster(monster))
            let newMonsterField = this.state.player2Monsters
            let monsterIndex = newMonsterField.findIndex(
              obj => obj.id === monster.id
            )

            let newMonster = monster
            newMonster.position = 'defense'

            newMonsterField.splice(monsterIndex, 1, newMonster)

            this.setState({
              player2Monsters: newMonsterField
            })
          } else if (this.findStrongestKillablePlayerMonster(monster)) {
            let attackTarget = this.findStrongestKillablePlayerMonster(monster)
            monster.position = 'attack'
            this.fight(monster, attackTarget, this.state.player2Monsters)
          }
        }
      }
    )
    this.setState({
      player1Life: totalDamage
    })
  }

  findStrongestKillablePlayerMonster = (monster) => {
    let sortedPlayerField = this.state.player1Monsters.sort( (a, b) => {
        if(this.highestAttack(a) > this.highestAttack(b)) {
          return -1
        } else {
          return 1
        }
        return 0
      }
    )

    let strongestKillableMonster = sortedPlayerField.find(
      monsterObj =>
        (monsterObj.position === 'attack' && this.highestAttack(monster) >= this.highestAttack(monsterObj)) ||
        (monsterObj.position === 'defense' && this.highestAttack(monster) >= monsterObj.defense)
    )

    return strongestKillableMonster

    // let strongestKillableMonsterSlot = this.state.player1Monsters.findIndex(
    //   obj => obj.name === strongestKillableMonster.name
    // )

  }

  computerEndTurn = () => {
    this.renewAllFields()
    this.setState({
      summoned: false
    }, () => {
      this.swapCurrentPlayer()
    })
  }

  renewAllFields = () => {
    let newMonsterField1 = this.state.player1Monsters
    let newerMonsterField1 = []
    let newMonsterField2 = this.state.player2Monsters
    let newerMonsterField2 = []

    newMonsterField1.map(monster => {
      if (Object.keys(monster).length !== 0){
        let newMonster = monster
        newMonster.attacked = false
        newerMonsterField1 = [...newerMonsterField1, newMonster]
      } else {
        // console.log(monster)
        // console.log(newerMonsterField1)
        // console.log(Object.keys(monster).length)
        newerMonsterField1 = [...newerMonsterField1, {}]
        // console.log(newerMonsterField1)
      }
    })

    newMonsterField2.map(monster => {
      if (Object.keys(monster).length !== 0){
        let newMonster = monster
        newMonster.attacked = false
        newerMonsterField2 = [...newerMonsterField2, newMonster]
      } else {
        newerMonsterField2 = [...newerMonsterField2, {}]
      }
    })

    this.setState({
      player1Monsters: newerMonsterField1,
      player2Monsters: newerMonsterField2,
    })

  }

  // sendTargetedCardFromFieldToGraveyard = () => {
  //   let newGraveyard = this.state.player1Graveyard
  //   let newMonsterField = this.state.player2Monsters
  //
  //   let emptySlot = this.state.player2Monsters.findIndex(
  //     obj => obj.id === this.state.selectedTarget.id
  //   )
  //
  //   newMonsterField.splice(emptySlot, 1, {})
  //
  //   this.setState({
  //     player2Monsters: newMonsterField,
  //     player2Graveyard: newGraveyard,
  //     actionType: ''
  //   })
  // }

  // getStrongestMonsterInEnemyField = () => {
  //   return this.state.player1Monsters.sort( function(a, b) {
  //   	if(a.attack > b.attack) {
  //   		return -1
  //     } else {
  //     	return 1
  //     }
  //   })[0]
  // }

  computerTurn = () => {
    this.setState({
      turn: this.state.turn + 1,
      currentPlayer: "player2",
      currentOpponent: "player1"
    },
     () => {
      console.log(this.state.player2Monsters)
      if (this.state.player2Deck.length > 0) {
        const newDeck = this.state.player2Deck
        const newCard = newDeck.pop()
        this.setState({
          player2Deck: newDeck,
          player2Hand: [...this.state.player2Hand, newCard]
        }, () => this.playAppropriateMonster()
      )
      this.computerEndTurn()
      } else {
        this.setState({
          player2Life: -9999
        })
      }
    })
  }

  requiem = (card) => {
    if (this.state.currentPlayer === "player1") {
      let newHand = this.state.player1Hand.filter(
        cardObj => cardObj.id !== card.id
      )

      this.setState({
          player2Graveyard: [...this.state.player2Graveyard, ...this.state.player2Monsters.filter(
            obj => Object.keys(obj).length !== 0
          )]
        }, () => {
        this.setState({
            player2Monsters: [{}, {}, {}, {}, {}],
            player1Hand: newHand,
            player1Graveyard: [...this.state.player1Graveyard, card]
        })
      })
    } else {
      let newHand = this.state.player2Hand.filter(
        cardObj => cardObj.id !== card.id
      )

      this.setState({
          player1Graveyard: [...this.state.player1Graveyard, ...this.state.player1Monsters].filter(
            obj => Object.keys(obj).length !== 0
          )
        }, () => {
        this.setState({
            player1Monsters: [{}, {}, {}, {}, {}],
            player2Hand: newHand,
            player2Graveyard: [...this.state.player2Graveyard, card]
        })
      })
    }
  }

  demacianJustice = (card) => {
    let highestMonster = this.state.player2Monsters.sort( (a, b) => {
    	if(a.attack > b.attack) {
    		return -1
      } else {
      	return 1
      }
      return 0
    })[0]

    let newGraveyard = this.state.player2Graveyard
    let newMonsterField = this.state.player2Monsters
    let newHand = this.state.player1Hand.filter(
      cardObj => cardObj.id !== card.id
    )

    let emptyFieldSlot = this.state.player2Monsters.findIndex(
      obj => obj.id === highestMonster.id
    )

    newGraveyard = [...this.state.player2Graveyard, highestMonster]

    newMonsterField.splice(emptyFieldSlot, 1, {})

    this.setState({
      player2Monsters: newMonsterField,
      player2Graveyard: newGraveyard,
      player1Hand: newHand,
      player1Graveyard: [...this.state.player1Graveyard, card],
      actionType: ''
    })
  }

  primordialBurst = (card) => {
    let highestMonster = this.state.player2Monsters.sort( (a, b) => {
      if(a.magic > a.magic) {
        return -1
      } else {
        return 1
      }
      return 0
    })[0]

    let newGraveyard = this.state.player2Graveyard
    let newMonsterField = this.state.player2Monsters
    let newHand = this.state.player1Hand.filter(
      cardObj => cardObj.id !== card.id
    )

    let emptyFieldSlot = this.state.player2Monsters.findIndex(
      obj => obj.id === highestMonster.id
    )


    newGraveyard = [...this.state.player2Graveyard, highestMonster]

    newMonsterField.splice(emptyFieldSlot, 1, {})

    this.setState({
      player2Monsters: newMonsterField,
      player2Graveyard: newGraveyard,
      player1Hand: newHand,
      player1Graveyard: [...this.state.player1Graveyard, card],
      actionType: ''
    })
  }

  silverBolts = (card) => {
    let highestMonster = this.state.player2Monsters.sort( (a, b) => {
      if(a.defense > a.defense) {
        return -1
      } else {
        return 1
      }
      return 0
    })[0]

    let newGraveyard = this.state.player2Graveyard
    let newMonsterField = this.state.player2Monsters
    let newHand = this.state.player1Hand.filter(
      cardObj => cardObj.id !== card.id
    )

    let emptyFieldSlot = this.state.player2Monsters.findIndex(
      obj => obj.id === highestMonster.id
    )

    newGraveyard = [...this.state.player2Graveyard, highestMonster]

    newMonsterField.splice(emptyFieldSlot, 1, {})

    this.setState({
      player2Monsters: newMonsterField,
      player2Graveyard: newGraveyard,
      player1Hand: newHand,
      player1Graveyard: [...this.state.player1Graveyard, card],
      actionType: ''
    })
  }

  getItemTargetMode = () => {
    console.log(this.state)
    console.log(this.state.selectedCard)
    this.setState({
      actionType: 'selectItemTarget'
    })
  }

  selectItemTarget = (card) => {
    this.setState({
      selectedItemTarget: card
    })
  }

  longSword = (card) => {
    if (this.state.currentPlayer === 'player1') {
      if (this.state.selectedItemTarget === '') {
        this.setState({
          actionType: ''
        })
      } else {
        let newMonsterField = this.state.player1Monsters
        let newHand = this.state.player1Hand.filter(
          cardObj => cardObj.id !== card.id
        )
        let newSpellField = this.state.player1Spells

        let monsterToEquip = newMonsterField.find(obj => obj.id === this.state.selectedItemTarget.id)
        let monsterToEquipSlot = newMonsterField.findIndex(obj => obj.id === this.state.selectedItemTarget.id)
        let emptySlot = this.state.player1Spells.findIndex(
          obj => Object.keys(obj).length === 0
        )

        card.target = monsterToEquip

        newSpellField.splice(emptySlot, 1, card)

        monsterToEquip.attack = monsterToEquip.attack + 300

        newMonsterField.splice(monsterToEquipSlot, 1, monsterToEquip)

        this.setState({
          player1Monsters: newMonsterField,
          player1Hand: newHand,
          player1Spells: newSpellField,
          actionType: '',
          selectedItemTarget: ''
        })
      }
    }
  }

  amplifyingTome = (card) => {
    if (this.state.currentPlayer === 'player1') {
      let newMonsterField = this.state.player1Monsters
      let newHand = this.state.player1Hand.filter(
        cardObj => cardObj.id !== card.id
      )
      let newSpellField = this.state.player1Spells

      let monsterToEquip = newMonsterField.find(obj => obj.id === card.id)
      let monsterToEquipSlot = newMonsterField.findIndex(obj => obj.id === card.id)
      let emptySlot = this.state.player1Spells.findIndex(
        obj => Object.keys(obj).length === 0
      )

      newSpellField.splice(emptySlot, 1, card)

      monsterToEquip.attack = monsterToEquip.magic + 300

      newMonsterField.splice(monsterToEquipSlot, 1, monsterToEquip)

      this.setState({
        player1Monsters: newMonsterField,
        player1Hand: newHand,
        player1Spells: newSpellField
      })
    }
  }

  render() {
    if (this.state.player1Life <= 0) {
      return(
        <div id="post-match">
        <img id="shadow-isles" src="image/shadow-isles.jpeg" />
          <div id="post-match-message">
            <h1>YOU HAVE RUN OUT OF STAMINA</h1>
            <h1>YOU ARE NO LONGER ABLE TO FIGHT</h1>
            <h1>YOU CAN ONLY WATCH ON AS YOUR ENEMY COMES TO DELIVER THE FINISHING BLOW</h1>
          </div>
        </div>
      )
    } else if (this.state.player2Life <= 0) {
      return(
        <div id="post-match">
          <img id="targon" src="image/targon.jpeg" />
          <div id="post-match-message">
            <h1>CONGRATULATIONS!</h1>
            <h1>YOU HAVE DEFEATED YOUR OPPONENT!</h1>
          </div>
        </div>
      )
    } else {
      return(
        <div>
          <img id="noxus-arena" src="image/noxus-arena.jpeg" />
          <div id="duel-field-container">
            <div id="duel-field">

              <div>{this.props.player2.name}</div>
              <img src={this.props.player2.image}/>
              <div>
                <img id="summoners-rift" src="image/summoners-rift.jpg"/>
                <div id="enemy-field">
                  <div id="player2-hand">
                  <Hand hand={this.state.player2Hand}/>
                  </div>
                  <br/>
                  <div className="extra-field">
                  <div id="player2-deck" className="duel-card" >
                  p2 Deck
                  </div>
                  <div id="player2-graveyard" className="duel-card" onClick={this.displayGraveyard2}>
                  Graveyard
                  </div>
                  </div>
                  <br/>
                  <div id="player2-spells">
                  <SpellField spells={this.state.player2Spells} />
                  </div>
                  <div id="player2-monsters">
                    <MonsterField
                    player={"player2"}
                      monsters={this.state.player2Monsters}
                      selectTarget={this.selectTarget}
                    />
                  </div>
                </div>
              </div>
              <br/>
              <br/>
              <div id="middle-bar">
              <div className="life-points">{this.state.player2Life}</div>
              <button onClick={this.computerTurn}>End Turn</button>
              <div className="life-points">{this.state.player1Life}</div>
              </div>
              <br/>
              <br/>
              <div>
                <img id="summoners-rift" src="image/summoners-rift.jpg"/>
                <div id="player-field">

                  <div id="player1-monsters">
                    <MonsterField
                      monsters={this.state.player1Monsters}
                      clickFieldMonster={this.clickFieldMonster}
                      selectTarget={this.selectTarget}
                      selectItemTarget={this.selectItemTarget}
                      actionType={this.state.actionType}
                      player={"player1"}
                    />
                  </div>
                  <div id="player1-spells">
                  <SpellField spells={this.state.player1Spells} playMonster={this.playMonster}/>
                  </div>
                  <br/>
                  <div className="extra-field">
                  <div id="player1-deck" className="duel-card" onClick={this.drawCard}>
                  p1 Deck
                  </div>
                  <div id="player1-graveyard" className="duel-card" onClick={this.displayGraveyard1}>
                  Graveyard
                  </div>
                </div>
                </div>
                <div id="player1-hand">
                  <Hand
                    hand={this.state.player1Hand}
                    clickHandCard={this.clickHandCard}
                  />
                </div>
              </div>
              <img src={this.props.player1.image}/>
              <div>{this.props.player1.name}</div>
            </div>
            <div id="action-box">
              <ActionBox
                actionType={this.state.actionType}
                selectedCard={this.state.selectedCard}
                selectedTarget={this.state.selectedTarget}
                playMonsterAttack={this.playMonsterAttack}
                playMonsterDefense={this.playMonsterDefense}
                getEnemyTargetMode={this.getEnemyTargetMode}
                cancel={this.cancel}
                changePosition={this.changePosition}
                selectedTarget={this.state.selectedTarget}
                fight={this.fight}
                player1Graveyard={this.state.player1Graveyard}
                player2Graveyard={this.state.player2Graveyard}
                emptyField={this.emptyField}
                player2Monsters={this.state.player2Monsters}
                player1Monsters={this.state.player1Monsters}
                turn={this.state.turn}
                requiem={this.requiem}
                demacianJustice={this.demacianJustice}
                primordialBurst={this.primordialBurst}
                silverBolts={this.silverBolts}
                getItemTargetMode={this.getItemTargetMode}
                selectedItemTarget={this.state.selectedItemTarget}
                longSword={this.longSword}
              />
            </div>
          </div>
        </div>
      )
    }
  }

}
