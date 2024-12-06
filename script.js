let isGravityInverted = false; // État pour suivre la direction de la gravité
let clickCount = 0; // Compteur de clics
const maxClicks = 5; // Nombre de clics pour arrêter la gravité
let isUpsideDown = false; // État pour savoir si le site est à l'envers
let additionalClicks = 0; // Compteur de clics après l'arrêt de la gravité

// Ajout des sons
const gravitySound = new Audio('https://www.soundjay.com/button/beep-07.mp3'); // Son lors de l'inversion

// Liste de couleurs pour le fond
const backgroundColors = ['#FF5733', '#33FF57', '#3357FF', '#FFC300', '#DAF7A6', '#900C3F', '#581845'];

// Fonction pour changer aléatoirement la couleur du fond
function changeBackgroundColor() {
    const randomColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
    document.body.style.backgroundColor = randomColor;
}

// Initialisation de la gravité
function applyGravity() {
    const elements = document.querySelectorAll('.nav-button, .section, footer, header');
    const gravity = 0.2; // Gravité (force)
    const damping = 0.9; // Réduction de la vitesse après chaque mouvement

    elements.forEach(element => {
        let posY = element.getBoundingClientRect().top;
        let velocityY = 0;

        function fall() {
            if (clickCount >= maxClicks && additionalClicks < 2) {
                element.style.transform = ''; // Réinitialise les transformations
                return; // Stoppe l'animation lorsque la gravité est désactivée
            }

            velocityY += isGravityInverted ? -gravity : gravity; // Gravité normale ou inversée
            posY += velocityY;

            if (!isGravityInverted && posY + element.offsetHeight >= window.innerHeight) {
                posY = window.innerHeight - element.offsetHeight; // Au sol
                velocityY *= -damping; // Inversion de la vitesse (rebond)
                triggerExplosion(element); // Explosion visuelle
            } else if (isGravityInverted && posY <= 0) {
                posY = 0; // Plafond
                velocityY *= -damping; // Inversion de la vitesse (rebond)
                triggerExplosion(element); // Explosion visuelle
            }

            element.style.transform = `translateY(${posY}px)`;
            requestAnimationFrame(fall); // Continue l'animation
        }

        fall();
    });
}

// Explosion visuelle
function triggerExplosion(element) {
    const explosion = document.createElement('div');
    explosion.classList.add('explosion');
    explosion.style.left = `${element.offsetLeft}px`;
    explosion.style.top = `${element.offsetTop}px`;
    document.body.appendChild(explosion);

    setTimeout(() => {
        explosion.remove(); // Supprime l'explosion après 500ms
    }, 500);
}

// Permet de déplacer les éléments avec la souris
function makeDraggable() {
    const elements = document.querySelectorAll('.nav-button, .section, footer, header');

    elements.forEach(element => {
        let offsetX = 0;
        let offsetY = 0;

        element.addEventListener('mousedown', (e) => {
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;

            function moveAt(event) {
                element.style.position = 'absolute';
                element.style.left = `${event.clientX - offsetX}px`;
                element.style.top = `${event.clientY - offsetY}px`;
            }

            document.addEventListener('mousemove', moveAt);

            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', moveAt);
            }, { once: true });
        });
    });
}

// Inverse la gravité ou active le mode "à l'envers"
function toggleGravity() {
    if (clickCount >= maxClicks) {
        additionalClicks++;

        // Active le mode à l'envers après 5 clics
        if (!isUpsideDown) {
            document.body.style.transform = 'rotate(180deg)'; // Inverse tout le site
            document.body.style.transition = 'transform 0.5s ease';
            isUpsideDown = true;

            document.addEventListener('mousemove', reactivateGravity, { once: true });
        }

        // Réactive la gravité après 2 clics supplémentaires
        if (additionalClicks === 2) {
            clickCount = 0; // Réinitialise le compteur principal
            isUpsideDown = false; // Réinitialise l'état "à l'envers"
            document.body.style.transform = ''; // Remet le site à l'endroit
            applyGravity(); // Relance la gravité
            additionalClicks = 0; // Réinitialise le compteur de clics supplémentaires
        }

        return; // Empêche toute autre action
    }

    isGravityInverted = !isGravityInverted; // Inverse l'état de la gravité
    changeBackgroundColor(); // Change la couleur du fond
    clickCount++; // Incrémente le compteur de clics
    gravitySound.play(); // Joue un son pour l'inversion
}

// Réactive la gravité après un mouvement de la souris
function reactivateGravity() {
    clickCount = 0; // Réinitialise le compteur principal
    isUpsideDown = false; // Réinitialise l'état "à l'envers"
    document.body.style.transform = ''; // Remet le site à l'endroit
    applyGravity(); // Relance la gravité
    changeBackgroundColor(); // Change la couleur du fond pour un effet dynamique
}

// Affiche une section et cache les autres
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

// Applique les fonctionnalités après le chargement
document.addEventListener('DOMContentLoaded', () => {
    applyGravity(); // Applique la gravité
    makeDraggable(); // Rend les éléments déplaçables
    document.body.addEventListener('click', toggleGravity); // Inverse la gravité au clic
});
