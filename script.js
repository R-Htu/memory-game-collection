const SndFlipCard = new Audio('https://github.com/Dashieel/SoloLearnSrc/raw/refs/heads/main/flipcard.mp3');
const SndShuffleCards = new Audio('https://github.com/Dashieel/SoloLearnSrc/raw/refs/heads/main/cards.mp3');
const SndCorrect = new Audio('https://github.com/Dashieel/SoloLearnSrc/raw/refs/heads/main/correct.mp3');
const SndComplete = new Audio('https://github.com/Dashieel/SoloLearnSrc/raw/refs/heads/main/complete.mp3');
let Cards = Array.from(document.getElementsByClassName('card'));

let MovsEl = document.getElementById('movements');
let TimeEl = document.getElementById('time');
let StatsEl = document.getElementById('stats');
let ShuffleEl = document.getElementById('shuffle');

const Imgs = [
    'https://cdn.pixabay.com/photo/2024/11/02/19/08/bird-9169969_1280.jpg',
    'https://cdn.pixabay.com/photo/2023/11/06/16/31/mountain-8370051_640.jpg',
    'https://cdn.pixabay.com/photo/2025/07/05/02/55/together-9697018_640.png',
    'https://cdn.pixabay.com/photo/2025/07/09/12/15/fox-9704574_640.jpg',
    'https://cdn.pixabay.com/photo/2025/07/14/07/23/flower-9713477_640.png',
    'https://cdn.pixabay.com/photo/2025/07/02/13/20/fishing-rod-9692407_640.png'
];

let firstCard = null;
let secondCard = null;

let movs = 0;
let time = 0;
let timer = null;
let matchedCards = 0;
let loaded = false;
let shuffled = false;

let Games = [];

window.addEventListener('load', () => {
    Cards = Array.from(document.getElementsByClassName('card'));
    MovsEl = document.getElementById('movements');
    TimeEl = document.getElementById('time');
    StatsEl = document.getElementById('stats');
    ShuffleEl = document.getElementById('shuffle');

    document.getElementById('loading').style.display = 'none';
    document.getElementById('s-text').textContent = 'Shuffle';
    ShuffleEl.style.animation = 'click-me .8s infinite';
    loaded = true;

    Array.from(document.getElementsByClassName('s hiden')).forEach(e => e.classList.remove('hiden'));

    init();
});

function init() {

    document.getElementById('btn-stats').addEventListener('click', e => {
        StatsEl.classList.remove('hiden');
        StatsEl.innerHTML = '';

        if (Games.length === 0) {
            const stat = document.createElement('div');
            stat.classList.add('stat');
            stat.textContent = 'No statistics';

            StatsEl.appendChild(stat);
            return;
        }

        Games.forEach((game, i) => {
            const stat = document.createElement('div');
            stat.classList.add('stat');

            const gam = document.createElement('h3');
            gam.textContent = `Game ${i + 1}`;
            const mov = document.createElement('p');
            mov.textContent = `Movements: ${game.movs}`;
            const tim = document.createElement('p');
            tim.textContent = `Time: ${game.time}`;

            stat.append(gam, mov, tim);
            StatsEl.appendChild(stat);
        })
    });

    StatsEl.addEventListener('click', () => {
        StatsEl.classList.add('hiden');
    });

    ShuffleEl.addEventListener('click', e => {
        if (!loaded) return;
        const Peers = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];

        movs = 0;
        time = 0;
        timer = null;
        matchedCards = 0;
        shuffled = false;

        TimeEl.textContent = `Time: ${time}`;
        MovsEl.textContent = `Movements: ${movs}`;

        ShuffleEl.classList.add('hiden');

        SndShuffleCards.play();

        Cards.forEach((card, i) => {
            card.classList = 'card no-shuffled flipped';
            setTimeout(() => {
                card.classList.remove('no-shuffled');
                card.classList.add('flipped');
                const index = Math.round(Math.random() * (Peers.length - 1))
                const choosedPid = Peers[index];
                Peers.splice(index, 1);
                card.setAttribute('data-pid', choosedPid);
                // card.textContent = choosedPid;
                card.style.backgroundImage = `url(${Imgs[choosedPid - 1]})`;

                setTimeout(() => {
                    card.classList.remove('flipped');
                    animate(card);
                    card.style.backgroundImage = 'none';
                    SndFlipCard.currentTime = 0;
                    SndFlipCard.play();

                    shuffled = true;
                }, 1500);
            }, 30 * i);
        })
    });

    Cards.forEach(card => {
        card.addEventListener('click', e => {
            if (!shuffled) return;

            if (!timer) startTimer();

            if (e.target.classList.contains('matched')) return;

            if (firstCard && secondCard) return;

            if (firstCard === e.target) return;

            if (!firstCard) return flipCard(1, e);
            flipCard(2, e);

            movs++;
            MovsEl.textContent = `Movements: ${movs}`;
        });
    });
}

function flipCard(card, e) {
    SndFlipCard.currentTime = 0;
    SndFlipCard.play();

    if (card === 1) {
        firstCard = e.target;
        firstCard.classList.add('flipped');
        animate(firstCard);
        let choosedPid = firstCard.getAttribute('data-pid');
        setTimeout(() => {
            firstCard.style.backgroundImage = `url(${Imgs[choosedPid - 1]})`;
        }, 150);
    } else {
        secondCard = e.target;
        secondCard.classList.add('flipped');
        animate(secondCard);
        let choosedPid = secondCard.getAttribute('data-pid');
        setTimeout(() => {
            secondCard.style.backgroundImage = `url(${Imgs[choosedPid - 1]})`;
        }, 150);
    }

    if (firstCard && secondCard) {
        const pid1 = firstCard.getAttribute('data-pid');
        const pid2 = secondCard.getAttribute('data-pid');

        if (pid1 === pid2) {
            setTimeout(() => {
                firstCard.classList.add('matched');
                animate(firstCard, 'animate-matched');
                firstCard = null;
                secondCard.classList.add('matched');
                animate(secondCard, 'animate-matched');
                secondCard = null;
                SndCorrect.currentTime = 0;
                SndCorrect.play();

                matchedCards++;

                if (matchedCards === 6) {
                    stopTimer();
                }
            }, 500)
        } else

            setTimeout(() => {
                firstCard.classList.remove('flipped');
                animate(firstCard);
                setTimeout(() => {
                    firstCard.style.backgroundImage = 'none';
                    firstCard = null;
                }, 150);
                secondCard.classList.remove('flipped');
                animate(secondCard);
                setTimeout(() => {
                    secondCard.style.backgroundImage = 'none';
                    secondCard = null;
                }, 150);
                SndFlipCard.currentTime = 0;
                SndFlipCard.play();
            }, 1000)
    }
}

function startTimer() {
    timer = setInterval(() => {
        time++;
        TimeEl.textContent = `Time: ${time}`;
    }, 1000);
}
function stopTimer() {
    clearInterval(timer);

    Games.push({
        movs: movs,
        time: time
    })

    setTimeout(() => {
        SndComplete.currentTime = 0;
        SndComplete.play();

        Cards.forEach((card, i) => {
            setTimeout(() => {
                animate(card, 'animate-matched');
            }, 100 * i)
        });
    }, 1100);

    setTimeout(() => {
        SndShuffleCards.currentTime = 0;
        SndShuffleCards.play();

        Cards.forEach((card, i) => {
            setTimeout(() => {
                card.classList.add('no-shuffled');
                card.classList.remove('flipped');
            }, 30 * i)
        });

        setTimeout(() => {
            ShuffleEl.classList.remove('hiden');
        }, 500)
    }, 3500);
}

function animate(card, anim = 'animate-flip') {
    card?.classList.add(anim);

    card?.addEventListener('animationend', () => {
        card.classList.remove(anim);
    });
}