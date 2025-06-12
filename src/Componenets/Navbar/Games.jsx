import React, { useState } from 'react';

const Games = () => {
  const [selectedGame, setSelectedGame] = useState(null);

const gamesList = [
  {
    id: 1,
    name: 'Krunker',
    url: 'https://krunker.io',
    description: 'Fast-paced online multiplayer FPS game.',
    category: 'Action',
    image: 'https://krunker.io/img/screen3.jpg'
  },
  {
    id: 2,
    name: 'Slither.io',
    url: 'https://slither.io',
    description: 'Multiplayer snake game in a competitive arena.',
    category: 'Arcade',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/4f/Slither.io_App_Logo.png'
  },
  {
    id: 3,
    name: 'Agar.io',
    url: 'https://agar.io',
    description: 'Eat cells, avoid others, and grow big in this viral hit.',
    category: 'Strategy',
    image: 'https://agar.io/images/share.jpg'
  },
  {
    id: 4,
    name: 'Shell Shockers',
    url: 'https://shellshock.io',
    description: 'Egg-based multiplayer first person shooter with different weapons.',
    category: 'Action',
    image: 'https://shellshock.io/images/ogimage.jpg'
  },
  {
    id: 5,
    name: 'Zombs Royale',
    url: 'https://zombsroyale.io',
    description: '100-player 2D battle royale game with fast-paced combat.',
    category: 'Battle Royale',
    image: 'https://zombsroyale.io/images/social.png'
  },
  {
    id: 6,
    name: 'Paper.io 2',
    url: 'https://paper-io.com',
    description: 'Expand your territory by capturing areas without getting hit.',
    category: 'Strategy',
    image: 'https://static.vecteezy.com/system/resources/previews/021/486/578/original/paper-io-game-ui-interface-for-mobile-app-free-vector.jpg'
  },
  {
    id: 7,
    name: 'Gartic.io',
    url: 'https://gartic.io',
    description: 'Draw and guess the word in real-time with friends or strangers.',
    category: 'Drawing & Social',
    image: 'https://gartic.io/img/opengraph.png'
  },
  {
    id: 8,
    name: 'Diep.io',
    url: 'https://diep.io',
    description: 'Multiplayer tank shooter with upgrades and strategy.',
    category: 'Shooter',
    image: 'https://diep.io/img/thumb.png'
  },
  {
    id: 9,
    name: 'Minecraft',
    url: 'https://g.eags.us/eaglercraft/',
    description: 'The famous sandbox game where you can build, explore, and survive.',
    category: 'Sandbox',
    image: 'https://skribbl.io/res/og_image.png'
  },
  {
    id: 10,
    name: 'Little Big Snake',
    url: 'https://littlebigsnake.com',
    description: 'Beautiful slither-style game with missions and upgrades.',
    category: 'Arcade',
    image: 'https://img.gamedistribution.com/cedec90e2a3b4a87bc6507dcba2f4b77-512x384.jpeg'
  },
  {
    id: 11,
    name: 'War Brokers',
    url: 'https://warbrokers.io',
    description: 'Block-style multiplayer FPS with vehicles and missions.',
    category: 'FPS',
    image: 'https://warbrokers.io/images/social.png'
  },
  {
    id: 12,
    name: 'Surviv.io',
    url: 'https://surviv.io',
    description: 'Top-down battle royale shooter with loot and fast rounds.',
    category: 'Battle Royale',
    image: 'https://surviv.io/images/og-image.png'
  }
];


  const categories = ['All', 'Action', 'Arcade', 'Strategy', 'Battle Royale'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredGames = selectedCategory === 'All' 
    ? gamesList 
    : gamesList.filter(game => game.category === selectedCategory);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
  };

  const styles = {
    container: {
      backgroundColor: '#0d0d0d',
      color: '#ffffff',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      backgroundColor: '#1a1a1a',
      padding: '20px',
      borderBottom: '2px solid #333',
      textAlign: 'center'
    },
    title: {
      fontSize: '2.5rem',
      margin: '0',
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      fontSize: '1.1rem',
      margin: '10px 0 0 0',
      color: '#888'
    },
    gameView: {
      padding: '20px'
    },
    backButton: {
      backgroundColor: '#ff6b6b',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '16px',
      marginBottom: '20px',
      transition: 'all 0.3s ease'
    },
    backButtonHover: {
      backgroundColor: '#ff5252',
      transform: 'translateY(-2px)'
    },
    gameTitle: {
      fontSize: '2rem',
      marginBottom: '15px',
      color: '#4ecdc4'
    },
    iframe: {
      width: '100%',
      height: '600px',
      border: 'none',
      borderRadius: '10px',
      backgroundColor: '#222'
    },
    gamesList: {
      padding: '20px'
    },
    categories: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '15px',
      marginBottom: '30px'
    },
    categoryButton: {
      backgroundColor: '#2a2a2a',
      color: '#fff',
      border: '2px solid #444',
      padding: '10px 20px',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s ease'
    },
    categoryButtonActive: {
      backgroundColor: '#4ecdc4',
      borderColor: '#4ecdc4',
      color: '#000'
    },
    gamesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '25px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    gameCard: {
      backgroundColor: '#1a1a1a',
      borderRadius: '15px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid #333'
    },
    gameCardHover: {
      transform: 'translateY(-5px)',
      borderColor: '#4ecdc4',
      boxShadow: '0 10px 25px rgba(78, 205, 196, 0.3)'
    },
    gameImage: {
      width: '100%',
      height: '150px',
      objectFit: 'cover',
      backgroundColor: '#333'
    },
    gameInfo: {
      padding: '20px'
    },
    gameName: {
      fontSize: '1.3rem',
      margin: '0 0 8px 0',
      color: '#fff'
    },
    gameCategory: {
      fontSize: '0.9rem',
      color: '#4ecdc4',
      marginBottom: '10px',
      fontWeight: 'bold'
    },
    gameDescription: {
      fontSize: '0.95rem',
      color: '#ccc',
      lineHeight: '1.4',
      margin: '0'
    },
    loadingMessage: {
      textAlign: 'center',
      fontSize: '1.1rem',
      color: '#888',
      marginTop: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>LightUpSwift Games</h1>
        <p style={styles.subtitle}>India's First Social Media Gaming Hub</p>
      </header>

      {selectedGame ? (
        <div style={styles.gameView}>
          <button 
            style={styles.backButton}
            onClick={handleBackToGames}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ff5252';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ff6b6b';
              e.target.style.transform = 'translateY(0px)';
            }}
          >
            ← Back to Games
          </button>
          <h2 style={styles.gameTitle}>{selectedGame.name}</h2>
          <iframe 
            src={selectedGame.url}
            style={styles.iframe}
            title={selectedGame.name}
          />
          <p style={styles.loadingMessage}>
            Game loading... If the game doesn't load, please check your internet connection.
          </p>
        </div>
      ) : (
        <div style={styles.gamesList}>
          <div style={styles.categories}>
            {categories.map(category => (
              <button
                key={category}
                style={{
                  ...styles.categoryButton,
                  ...(selectedCategory === category ? styles.categoryButtonActive : {})
                }}
                onClick={() => setSelectedCategory(category)}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category) {
                    e.target.style.backgroundColor = '#3a3a3a';
                    e.target.style.borderColor = '#555';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category) {
                    e.target.style.backgroundColor = '#2a2a2a';
                    e.target.style.borderColor = '#444';
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>

          <div style={styles.gamesGrid}>
            {filteredGames.map(game => (
              <div
                key={game.id}
                style={styles.gameCard}
                onClick={() => handleGameSelect(game)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = '#4ecdc4';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(78, 205, 196, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.borderColor = '#333';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img 
                  src={game.image} 
                  alt={game.name}
                  style={styles.gameImage}
                />
                <div style={styles.gameInfo}>
                  <h3 style={styles.gameName}>{game.name}</h3>
                  <div style={styles.gameCategory}>{game.category}</div>
                  <p style={styles.gameDescription}>{game.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Games;