document.addEventListener('DOMContentLoaded', () => {
    const nameForm = document.getElementById('name-form');
    const nameInputSection = document.getElementById('name-input-section');
    const gameSection = document.getElementById('game-section');
    const welcomeMessage = document.getElementById('welcome-message');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const grid = document.querySelector('.grid');
    const width = 28;
    let score = 0;
    let username = "";
    let timeLeft = 900;
    let timerId;
    const squares = [];

    const layout = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,3,1,0,0,1,0,1,0,0,0,1,0,1,1,0,1,0,0,0,1,0,1,0,0,1,3,1,
        1,0,1,0,0,1,0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,1,0,0,1,0,1,
        1,0,1,1,1,1,0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,0,1,1,1,1,2,2,1,1,1,1,0,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,1,0,1,0,0,0,2,2,0,0,0,1,0,1,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,0,1,
        1,0,1,0,0,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,0,1,0,0,1,
        1,0,1,0,1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,
        1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1,
        1,1,1,0,1,0,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,
        1,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,0,1,1,1,0,1,1,0,1,1,1,0,1,0,1,1,1,1,0,1,
        1,0,0,0,0,1,0,1,0,0,0,1,0,1,1,0,1,0,0,0,1,0,1,0,0,0,0,1,
        1,1,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1,
        1,0,0,1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,1,
        1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,
        1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    ];

    nameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        username = document.getElementById('username').value.trim();
        if (!username) return;
        welcomeMessage.textContent = `Welcome, ${username}!`;
        nameInputSection.style.display = 'none';
        gameSection.style.display = 'block';
        createBoard();
        startGame();
    });

    function createBoard() {
        for (let i = 0; i < layout.length; i++) {
            const square = document.createElement('div');
            square.id = i;
            grid.appendChild(square);
            squares.push(square);

            if (layout[i] === 0) squares[i].classList.add('pac-dot');
            else if (layout[i] === 1) squares[i].classList.add('wall');
            else if (layout[i] === 2) squares[i].classList.add('ghost-lair');
            else if (layout[i] === 3) squares[i].classList.add('power-pellet');
        }
    }

    let pacmanCurrentIndex = 490;

    function startGame() {
        squares[pacmanCurrentIndex].classList.add('pac-man');
        document.addEventListener('keydown', movePacman);
        ghosts.forEach(ghost => moveGhost(ghost));
        startTimer();
    }

    function movePacman(e) {
        squares[pacmanCurrentIndex].classList.remove('pac-man');
        switch (e.key) {
            case 'ArrowLeft':
                if (pacmanCurrentIndex % width !== 0 &&
                    !squares[pacmanCurrentIndex - 1].classList.contains('wall')) {
                    pacmanCurrentIndex -= 1;
                }
                break;
            case 'ArrowRight':
                if (pacmanCurrentIndex % width < width - 1 &&
                    !squares[pacmanCurrentIndex + 1].classList.contains('wall')) {
                    pacmanCurrentIndex += 1;
                }
                break;
            case 'ArrowUp':
                if (pacmanCurrentIndex - width >= 0 &&
                    !squares[pacmanCurrentIndex - width].classList.contains('wall')) {
                    pacmanCurrentIndex -= width;
                }
                break;
            case 'ArrowDown':
                if (pacmanCurrentIndex + width < width * width &&
                    !squares[pacmanCurrentIndex + width].classList.contains('wall')) {
                    pacmanCurrentIndex += width;
                }
                break;
        }
        squares[pacmanCurrentIndex].classList.add('pac-man');
        pacDotEaten();
        checkForGameOver();
    }

    function pacDotEaten() {
        if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
            score++;
            scoreDisplay.textContent = score;
            squares[pacmanCurrentIndex].classList.remove('pac-dot');
        }
    }

    class Ghost {
        constructor(className, startIndex, speed) {
            this.className = className;
            this.startIndex = startIndex;
            this.speed = speed;
            this.currentIndex = startIndex;
            this.timerId = NaN;
        }
    }

    const ghosts = [
        new Ghost('blinky', 348, 250),
        new Ghost('pinky', 376, 400),
        new Ghost('inky', 351, 300),
        new Ghost('clyde', 379, 500),
    ];

    function moveGhost(ghost) {
        const directions = [1, -1, width, -width];
        let direction = directions[Math.floor(Math.random() * directions.length)];

        ghost.timerId = setInterval(() => {
            if (!squares[ghost.currentIndex + direction].classList.contains('wall')) {
                squares[ghost.currentIndex].classList.remove(ghost.className, 'ghost');
                ghost.currentIndex += direction;
                squares[ghost.currentIndex].classList.add(ghost.className, 'ghost');
            } else {
                direction = directions[Math.floor(Math.random() * directions.length)];
            }
            checkForGameOver();
        }, ghost.speed);
    }

    function checkForGameOver() {
        if (squares[pacmanCurrentIndex].classList.contains('ghost')) {
            endGame("Game Over");
        }
    }

    function startTimer() {
        timerId = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerId);
                endGame("Time's Up!");
            }
        }, 1000);
    }

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    function endGame(message) {
        ghosts.forEach(ghost => clearInterval(ghost.timerId));
        clearInterval(timerId);
        document.removeEventListener('keydown', movePacman);
        setTimeout(() => {
            alert(`${message}\n${username}'s Score: ${score}`);
            // Save to database
            fetch('save_score.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `username=${encodeURIComponent(username)}&score=${score}`
            });
        }, 500);
    }
});
