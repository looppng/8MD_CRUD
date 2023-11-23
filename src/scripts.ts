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
        return `${createdDate.toLocaleString()}`; 
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
                    <button class="weapon-edit edit__button button" data-weapon-id="${weapon.id}">Edit</button>
                    <button class="weapon-delete button" data-weapon-id="${weapon.id}">Delete</button>
                </div>
                <p class="weapon__created">Created ${timeAgo(weapon.createdAt)}</p>
            </div>
        `;
        });

        const weaponsDelete = document.querySelectorAll<HTMLButtonElement>('.weapon-delete');

        weaponsDelete.forEach((weaponDelete) => {
            weaponDelete.addEventListener('click', () => {
                const { weaponId } = weaponDelete.dataset;

                axios.delete(`http://localhost:3004/weapons/${weaponId}`).then(() => {
                    drawWeapons();
                });
            });
        });
    });
};

drawWeapons();

const populateWeaponForm = (weapon: weapon) => {
    const weaponInput = weaponForm.querySelector<HTMLInputElement>('input[name="weapon"]');
    const weaponDescription = weaponForm.querySelector<HTMLInputElement>('input[name="weapon-description"]');
    const weaponPrice = weaponForm.querySelector<HTMLInputElement>('input[name="weapon-price"]');

    weaponInput.value = weapon.name;
    weaponDescription.value = weapon.description;
    weaponPrice.value = weapon.price.toString();
};

document.addEventListener('click', (event) => {
    const editButton = event.target as HTMLButtonElement;
    if (editButton.classList.contains('weapon-edit')) {
        const weaponId = editButton.dataset.weaponId;
        
        axios.get<weapon>(`http://localhost:3004/weapons/${weaponId}`).then(({ data }) => {
            populateWeaponForm(data);

            const saveButton = document.querySelector<HTMLButtonElement>('.save__button');
            const removeAdd = document.querySelector<HTMLButtonElement>('.add__button');

            removeAdd.style.display = 'none';
            saveButton.style.display = 'inline-block';
            saveButton.dataset.weaponId = weaponId;
        });
    }
});


const saveButton = document.querySelector<HTMLButtonElement>('.save__button');

saveButton.addEventListener('click', async () => {
    const weaponId = saveButton.dataset.weaponId;

    const weaponInput = weaponForm.querySelector<HTMLInputElement>('input[name="weapon"]');
    const weaponDescription = weaponForm.querySelector<HTMLInputElement>('input[name="weapon-description"]');
    const weaponPrice = weaponForm.querySelector<HTMLInputElement>('input[name="weapon-price"]');
    const weaponImg = weaponForm.querySelector<HTMLInputElement>('input[name="weapon-image"]');

    const weaponInputValue = weaponInput.value;
    const weaponDescriptionValue = weaponDescription.value;
    const weaponPriceValue = Number(weaponPrice.value);
    const weaponImgValue = weaponImg.files[0];

    const createdAt = new Date();
        try {
            let imageUrl;
            if (weaponImgValue) {
                imageUrl = URL.createObjectURL(weaponImgValue);
            } else {
                const existingWeapon = await axios.get<weapon>(`http://localhost:3004/weapons/${weaponId}`);
                imageUrl = existingWeapon.data.image;
            }
        

        const removeAdd = document.querySelector<HTMLButtonElement>('.add__button');

        const url = `http://localhost:3004/weapons/${weaponId}`;

        await axios.patch<weapon>(url, {
            name: weaponInputValue,
            description: weaponDescriptionValue,
            price: weaponPriceValue,
            image: imageUrl,
            createdAt: createdAt.toISOString(),
        });

        weaponInput.value = '';
        weaponDescription.value = '';
        weaponPrice.value = '';
        saveButton.style.display = 'none';
        removeAdd.style.display = 'block';
    } catch (error) {
        console.error('Error updating weapon:', error);
    }
});

const weaponForm = document.querySelector('.weapon-form');

weaponForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const weaponInput = weaponForm.querySelector<HTMLInputElement>('input[name="weapon"]');
    const weaponDescription = weaponForm.querySelector<HTMLInputElement>('input[name="weapon-description"]');
    const weaponPrice = weaponForm.querySelector<HTMLInputElement>('input[name="weapon-price"]');
    const weaponImg = weaponForm.querySelector<HTMLInputElement>('input[name="weapon-image"]');

    const weaponInputValue = weaponInput.value;
    const weaponDescriptionValue = weaponDescription.value;
    const weaponPriceValue = Number(weaponPrice.value);
    const weaponImgValue = weaponImg.files[0];

    const createdAt = new Date();

    let imageUrl;

    if (weaponImgValue) {
        imageUrl = URL.createObjectURL(weaponImgValue);
    }

    const isEdit = !!weaponInput.dataset.editId;
    const url = isEdit ? `http://localhost:3004/weapons/${weaponInput.dataset.editId}` : 'http://localhost:3004/weapons';

    const method: 'post' | 'put' = isEdit ? 'put' : 'post';

    try {
        await axios[method]<weapon>(url, {
            name: weaponInputValue,
            description: weaponDescriptionValue,
            price: weaponPriceValue,
            image: imageUrl,
            createdAt: createdAt.toISOString(),
        });


        weaponInput.value = '';
        weaponDescription.value = '';
        weaponPrice.value = '';

        drawWeapons();
    } catch (error) {
        console.error('Error updating/adding weapon:', error);
    }
});