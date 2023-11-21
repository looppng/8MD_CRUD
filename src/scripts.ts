import axios from 'axios';

const weaponWrapper = document.querySelector<HTMLDivElement>('.weapon-wrapper');

type weapon = {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    createdAt: string;
}

const timeAgo = (timestamp: string): string => {
    const now = new Date();
    const createdDate = new Date(timestamp);

    const timeDifference = now.getTime() - createdDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours >= 24) {
        return `${createdDate.toLocaleString()}`; // Display full date if more than a day
    } else if (hours >= 1) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes >= 1) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return 'a few seconds ago';
    }
};

const drawWeapons = () => {
    const result = axios.get<weapon[]>('http://localhost:3004/weapons');

    weaponWrapper.innerHTML = '';

        result.then(({ data }) => {
    
            data.forEach((weapon) => {
                weaponWrapper.innerHTML += `
                <div class="weapon-box">
                    <div class="img-box">
                        <img src="${weapon.image}" alt="${weapon.name}">
                    </div>
                        <h1>${weapon.name}</h1>
                        <p>${weapon.description}</p>
                        <p>Weapon Price : $${weapon.price}</p>
                    <div>
                        <button class="weapon-edit edit__button button" data-weapon-id = "${weapon.id}">Edit</button>
                        <button class="weapon-delete button" data-weapon-id = "${weapon.id}">Delete</button>
                    </div>
                    <p class="weapon__created">Created ${timeAgo(weapon.createdAt)}</p>
                </div>
        `;});

        const weaponsDelete = document.querySelectorAll<HTMLButtonElement>('.weapon-delete');

        weaponsDelete.forEach((weaponDelete) => {
            weaponDelete.addEventListener('click', () => {
                const {weaponId} = weaponDelete.dataset;

                axios.delete(`http://localhost:3004/weapons/${weaponId}`).then(() => {
                    drawWeapons();
                }); 
            });
        });    
    });
};

drawWeapons();

const weaponForm = document.querySelector('.weapon-form');

weaponForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const weaponInput = weaponForm.querySelector<HTMLInputElement>('input[name="weapon"]');
    const weaponDescription = weaponForm.querySelector<HTMLInputElement>('input[name="weapon-description"]');
    const weaponPrice = weaponForm.querySelector<HTMLInputElement>('input[name="weapon-price"]');
    const weaponImg = weaponForm.querySelector<HTMLInputElement>('input[name="weapon-image"]');

    const weaponInputValue = weaponInput.value;
    const weaponDescriptionValue = weaponDescription.value;
    const weaponPriceValue = weaponPrice.value;
    const weaponImgValue = weaponImg.files[0];

    const createdAt = new Date();

    axios.post<weapon>('http://localhost:3004/weapons',
    {
        name: weaponInputValue,
        description: weaponDescriptionValue,
        price: weaponPriceValue,
        image: weaponImgValue,
        createdAt: createdAt.toISOString()
        }).then(() => {
            weaponInput.value = '';
            weaponDescription.value = '';
            weaponPrice.value = '';
            drawWeapons();
    });
    
});




