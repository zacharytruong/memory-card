import Gameboard from './Gameboard';
import './../styles/App.css';

const App = (props) => {
  return (
    <div className="App">
      <header>
        <h1>MEMORY CARDS GAME</h1>
        <p>Gameplay: you can click on an image to gain point, but you cannot click on the same image more than once.</p>
      </header>
      <Gameboard />
      <footer>
        <p>Built with 🎉 by Zach Truong</p>
        <p>
          Source code:{' '}
          <a
            href="https://github.com/zacharytruong/memory-card"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
