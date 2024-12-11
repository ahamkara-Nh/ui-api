async function getRestaurants() {
    try {
        const response = await fetch('http://localhost:3000/api/restaurants');
        const data = await response.json();
        console.log('All restaurants:', data);
        return data;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
    }
}

async function addRestaurant(restaurantData) {
    try {
        const response = await fetch('http://localhost:3000/api/restaurants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(restaurantData)
        });
        const data = await response.json();
        console.log('Added restaurant:', data);
        return data;
    } catch (error) {
        console.error('Error adding restaurant:', error);
    }
}

/// пример
async function main() {
    const newRestaurant = {
        name: "Sushi Master",
        cuisine: "Japanese",
        address: "456 Ocean Drive",
        rating: 4.8
    };

    await addRestaurant(newRestaurant);

    await getRestaurants();
}

main();
