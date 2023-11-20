import axios from 'axios';

const weaponWrapper = document.querySelector<HTMLDivElement>('.weapon-wrapper');

type weapon = {
    id: number;
    name: string;
    description: string;
    price: number;
}

const drawWeapons = () => {
    const result = axios.get<weapon[]>('http://localhost:3004/weapons');

    weaponWrapper.innerHTML = '';

        result.then(({ data }) => {
    
            data.forEach((weapon) => {
                weaponWrapper.innerHTML += `
                <div class="weapon-box">
                    <h1>${weapon.name}</h1>
                    <p>${weapon.description}</p>
                    <p>${weapon.price}</p>
                <div>
                    <button class="weapon-edit edit__button button" data-weapon-id = "${weapon.id}">Edit</button>
                    <button class="weapon-delete button" data-weapon-id = "${weapon.id}">Delete</button>
                </div>

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

weaponForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const weaponInput = weaponForm.querySelector<HTMLInputElement>('input[name="weapon"]');
    const weaponDescription = weaponForm.querySelector<HTMLInputElement>('input[name="weapon-description"]');
    const weaponPrice = weaponForm.querySelector<HTMLInputElement>('input[name="weapon-price"]');

    const weaponInputValue = weaponInput.value;
    const weaponDescriptionValue = weaponDescription.value;
    const weaponPriceValue = weaponPrice.value;

    axios.post<weapon>('http://localhost:3004/weapons',
    {
        name: weaponInputValue,
        description: weaponDescriptionValue,
        price: weaponPriceValue
        }).then(() => {
            weaponInput.value = '';
            weaponDescription.value = '';
            weaponPrice.value = '';
            drawWeapons();
    });
    
});




