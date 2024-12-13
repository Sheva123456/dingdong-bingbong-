// **1. Load product details from URL parameters when the DOM is ready**  
window.addEventListener('DOMContentLoaded', () => {
    // **2. Retrieve product data from the URL query string**  
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');  
    const price = urlParams.get('price');  
    const wasteIndex = urlParams.get('wasteIndex');  
    const image = urlParams.get('img'); 
     

    // **3. Populate product details in the HTML page**  
    document.getElementById('product-name').textContent = name;  
    document.getElementById('product-price').textContent = price;  
    document.getElementById('product-waste-index').textContent = `Waste Index: ${wasteIndex}`;  
    document.getElementById('product-image').src = image;  
});

// **4. Retrieve the cart from localStorage or initialize it as an empty array**  
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentuser = JSON.parse(localStorage.getItem('current-user'))
// **5. Add event listener for the "Add to Cart" button**  
document.getElementById('add-to-cart').addEventListener('click', () => {
    // **6. Create a product object using the displayed details**  
    const product = {
        name: document.getElementById('product-name').textContent,  
        price: document.getElementById('product-price').textContent,  
        wasteIndex: document.getElementById('product-waste-index').textContent,  
        image: document.getElementById('product-image').src,  
    };

    // **7. Add the product to the cart array**  
    currentuser.cart.push(product);

    // **8. Save the updated cart back to localStorage**  
    localStorage.setItem('cart', JSON.stringify(cart));

    // **9. Alert the user that the product was added to the cart**  
    alert(`${product.name} has been added to your cart!`);
});
console.log(currentuser)

const products = [
    {
        id: 1,
        name: "Milk 1",
        price: 10.00,
        wasteIndex: 6,
        image: "https://i.ibb.co.com/8YTVWVb/R-1.jpg",
    },
    {
        id: 2,
        name: "Apple",
        price: 20.00,
        wasteIndex: 3,
        image: "https://i.ibb.co.com/K5fVQfn/apple.jpg",
    },
    {
        id: 3,
        name: "Milk 2",
        price: 30.00,
        wasteIndex: 3,
        image: "https://i.ibb.co.com/8YTVWVb/R-1.jpg",
    },
    {
        id: 4,
        name: "Celery",
        price: 30.00,
        wasteIndex: 2,
        image: "https://i.ibb.co.com/gZKBYTP/R.jpg",
    },
];
localStorage.setItem('products', JSON.stringify(products));

document.querySelectorAll('.product').forEach(productElement => {
    productElement.addEventListener('click', () => {
        // Retrieve the product ID from the HTML element
        const productId = productElement.getAttribute('data-id');
        
        // Find the corresponding product in the JSON array
        const product = storedProducts.find(p => p.id == productId);

        if (product) {
            // Redirect to the product page with the ID as a query parameter
            currentuser.cart.push(productElement)
        }
    });
});

