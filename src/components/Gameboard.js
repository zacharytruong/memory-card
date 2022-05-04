import { useState, useRef, useEffect } from 'react';
import uniqid from 'uniqid';
import gsap from 'gsap';
import './../styles/Gameboard.css';

const Card = (props) => {
  const { card } = props;
  const gamePlay = (e) => props.gamePlay(e.target);
  return <img alt={card.name} src={card.src} onClick={gamePlay} />;
};

const CardCaption = (props) => {
  const { card } = props;
  return <figcaption>{card.name}</figcaption>;
};

const CardContainer = (props) => {
  const { card } = props;
  const gamePlay = props.gamePlay;
  return (
    <figure key={uniqid()} className="card">
      <Card card={card} gamePlay={gamePlay} />
      <CardCaption card={card} />
    </figure>
  );
};

const GameArea = (props) => {
  const { cards, gamePlay } = props;
  const area = useRef();
  const card = gsap.utils.selector(area);
  useEffect(() => {
    gsap.fromTo(card('.card'), { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: .1 });
  }, [card]);
  return (
    <section ref={area}>
      {cards.map((card) => (
        <CardContainer card={card} key={uniqid()} gamePlay={gamePlay} />
      ))}
    </section>
  );
};

const NewGame = (props) => {
  const { message, createNewGame } = props;
  return (
    <section>
      <p>{message}</p>
      <button onClick={createNewGame}>New Game</button>
    </section>
  );
};

const Gameboard = (props) => {
  const importAll = (context) => {
    let images = [];
    context.keys().forEach((image, index) => {
      const src = context(image);
      const isClicked = false;
      const name = image
        .replace('./', '')
        .replace('_', ' ')
        .replace('.webp', '');
      images[index] = { name, src, isClicked };
    });
    return images;
  };
  const images = importAll(
    require.context(
      './../resources/genshin-impact',
      false,
      /\.(png|jpe?g|svg|webp)$/
    )
  );
  const [gameMode, setGameMode] = useState(true);
  const [score, setScore] = useState(0);
  const [currentBestScore, setCurrentBestScore] = useState(0);
  const [cards, setCards] = useState([...images]);
  const [scoresHistory, setScoresHistory] = useState([]);
  let gameboard;
  let message;
  const shuffle = (array) => {
    let currentIndex = array.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex]
      ];
    }

    return array;
  };

  const getMax = (a, b) => Math.max(a, b);
  const findCurrentBestScore = (array) => array.reduce(getMax, 0);

  const createNewGame = () => {
    setScore(0);
    const tempCards = [...cards];
    tempCards.forEach((item) => (item.isClicked = false));
    setCards(tempCards);
    setGameMode(true);
  };
  const gamePlay = (element) => {
    const target = element.alt;
    const tempcards = [...cards];
    const clickedTarget = tempcards.find((item) => item.name === target);
    if (!clickedTarget.isClicked) {
      clickedTarget.isClicked = true;
      shuffle(tempcards);
      setCards(tempcards);
      setScore(score + 1);
      setScoresHistory(scoresHistory.concat(score + 1));
      const bestScore = findCurrentBestScore(scoresHistory.concat(score + 1));
      setCurrentBestScore(bestScore);
    } else if (clickedTarget.isClicked) {
      setGameMode(false);
    }
  };
  if (gameMode && score >= cards.length) {
    message = 'You won!';
    gameboard = <NewGame message={message} createNewGame={createNewGame} />;
  } else if (!gameMode) {
    message = 'You failed!';
    gameboard = <NewGame message={message} createNewGame={createNewGame} />;
  } else {
    gameboard = <GameArea cards={cards} gamePlay={gamePlay} />;
  }
  return (
    <main>
      <h3>Current Score: {score}</h3>
      <h3>Best Score: {currentBestScore}</h3>
      {gameboard}
    </main>
  );
};

export default Gameboard;
