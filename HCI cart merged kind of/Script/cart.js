function countItemQuantities(cart) {
    const itemQuantities = {};

    cart.forEach(item => {
        if (itemQuantities[item.id]) {
            itemQuantities[item.id]++;
        } else {
            itemQuantities[item.id] = 1;  // First occurrence, initialize count
        }
    });

    return itemQuantities;
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables for cart, UI elements, and account data
    let currentuser = JSON.parse(localStorage.getItem('current-user'));
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceContainer = document.getElementById('total-price');
    const eligibleDiscount = document.getElementById('eligible discount');
    const discountInput = document.getElementById('discount-value');
    let purchaseButton = document.getElementById('Purchase');

    let ecobar = document.querySelector('.line-eco-meter');
    let wastebar = document.querySelector('.line-waste-meter');
    let ecobar2 = document.querySelector('.line-eco-meter2');
    let wastebar2 = document.querySelector('.line-waste-meter2');
    let accountwaste = (currentuser.accountwaste || 0);
    let accountdisc = (currentuser.accountdisc || 0);
    let tempAccountdisc = 0;
    let tempAccountwaste = 0;
    let discountValue = parseFloat(discountInput.value); 
    let meter = document.getElementById('meter');

    let discountApplied = false;  
    const otherdisc = document.getElementById('total-eco-points');
    const otherwaste = document.getElementById('total-waste-points');
    const cancelButton = document.getElementById('cancel');
    const applyButton =document.getElementById('Apply')
    let cont = document.querySelector('.container');
    

    let total = 0;
    let totalwaste = 0;
    let totaleco = 0;
    let maxdiscount = accountdisc - accountwaste;   

    console.log(currentuser.accountdisc);
    console.log(currentuser.accountwaste);
    console.log(discountInput.value)

    accountdisc = Math.min(accountdisc, 100);
        currentuser.accountdisc = accountdisc;

        accountwaste = Math.min(accountwaste, 100);
        currentuser.accountwaste = accountwaste;
    
    // Function to recalculate totals
    function recalculateTotals() {
        // Reset all total variables
        total = 0;
        totalwaste = 0;
        totaleco = 0;
        tempAccountdisc = 0;
        tempAccountwaste = 0;

        // Recalculate totals from the cart
        currentuser.cart.forEach(item => {
            let pricevalue = String(item.price).replace('$', ''); // Clean price
            total += parseFloat(pricevalue);
            totalwaste += parseFloat(item.wasteIndex);
            if (parseFloat(item.wasteIndex) < 5) {
                totaleco += 5 - parseFloat(item.wasteIndex);
            }
        });
        if (currentuser.cart.length == 0){
            cont.style.display ='none'
        }
        if (currentuser.cart.length >= 0){
            cont.style.display ='block'
        }
        // Add waste and eco values to the temporary account variables, but don't add them multiple times
        tempAccountdisc += totaleco;
        tempAccountwaste += totalwaste;

        // Prevent values from exceeding 100
        if ( tempAccountdisc > 100) {tempAccountdisc = 100}
        if (tempAccountwaste > 100) {tempAccountwaste = 100}
        tempAccountdisc = Math.min(tempAccountdisc, 100);
        tempAccountwaste = Math.min(tempAccountwaste , 100);

        console.log('tempwaste',tempAccountwaste);
        console.log('tempdisc',tempAccountdisc);
        
        // Update UI
        totalPriceContainer.innerHTML = `<strong><p id='total'>Total: $${total.toFixed(2)} <p></strong> `;
        if (otherdisc) {
            otherdisc.innerHTML = `<p>Total eco-points: ${Math.min(tempAccountdisc+accountdisc, 100)}</p>`;
        }
        if (otherwaste) {
            otherwaste.innerHTML = `<p>Total waste-points: ${Math.min(tempAccountwaste+accountwaste, 100)}</p>`;
        }
        if (wastebar2) {
            wastebar2.style.width = `${Math.min(tempAccountwaste+accountwaste, 100)}%`;
        }
        if (wastebar2.style.width > 100) {wastebar2.style.width = 100} 
        if (ecobar2) {
            ecobar2.style.width = `${Math.min(tempAccountdisc+accountdisc, 100)}%`;
        }
        if (ecobar2.style.width > 100) {ecobar2.style.width = 100} 

        accountdisc = Math.min(accountdisc, 100);
        currentuser.accountdisc = accountdisc;

        accountwaste = Math.min(accountwaste, 100);
        currentuser.accountwaste = accountwaste;
    }

    // Limit max discount 
    if (maxdiscount > 30) {  
        maxdiscount = 30;  
    }  
    if (maxdiscount > 0) {  
        eligibleDiscount.innerHTML = `You are eligible for a discount up to ${maxdiscount}%`;  
    } else {  
        eligibleDiscount.innerHTML = `No discounts available`;  
    }  
    // Initially hide the cancel button
    cancelButton.style.display = 'none';
    

// Update visibility when discount is applied
applyButton.addEventListener('click', () => {
    if (accountdisc <= accountwaste) {
        alert('No discounts available!');
        return; // Prevent further execution
    }
    
    if (discountApplied) {
        alert('Discount has already been applied!');
        return; // Prevent further execution
    }
    
    let discountValue = parseFloat(discountInput.value);
    
    if (isNaN(discountValue) || discountInput.value.trim() === '') {
        alert("You haven't input a valid discount");
        return; // Stop if input is empty or invalid
    }
    if (discountValue > maxdiscount) {
        alert(`Discount cannot exceed ${maxdiscount}%. It will be capped.`);
        discountValue = maxdiscount;
        discountInput.value = maxdiscount;
    }
    
    discountApplied = true; // Mark discount as applied

    const calculatedDiscount = Math.min(discountValue || 0, maxdiscount);
    if (!isNaN(calculatedDiscount)) {
        if (calculatedDiscount > 0) {
            tempAccountdisc = Math.max(0, (tempAccountdisc + accountdisc - calculatedDiscount));
        } else {
            tempAccountdisc = totaleco;  // If no discount, just use totaleco
        }

        // Prevent tempAccountdisc from exceeding 100
        tempAccountdisc = Math.min(tempAccountdisc, 100);

        // Update the eco progress bar
        if (ecobar2) {
            const updatedEcoWidth = tempAccountdisc > 100 ? 100 : tempAccountdisc;
            ecobar2.style.width = `${updatedEcoWidth}%`;
        }

        if (otherdisc) {
            otherdisc.innerHTML = `<p>${tempAccountdisc}</p>`;
        }

        // Recalculate the total price and update UI
        totalPriceContainer.innerHTML = `<strong><p id='total'>Total: $${(total * (1 - calculatedDiscount / 100)).toFixed(2)} </p>`;
        
        // Hide the Apply button and show the Cancel button
        applyButton.style.display = 'none';  
        cancelButton.style.display = 'block';  
    } else {
        console.error('Invalid discountValue');
    }
});
    if (discountApplied) {
        cancelButton.style.display = 'block';  // Show cancel button
    }
    // Check if the "Purchase" button is available and add functionality
    if (purchaseButton) {
        purchaseButton.addEventListener('click', () => {
            if (currentuser.cart.length === 0) {
                alert('Your cart is empty!');
            } else {
                // Process the purchase logic (e.g., remove cart items, update user data)
                if (discountApplied) {
                    const discountValue = Math.min(parseFloat(discountInput.value) || 0, maxdiscount);
                    if (!isNaN(discountValue)) {
                        accountdisc = Math.max(0, accountdisc - discountValue); // Prevent negative values
                        currentuser.accountdisc = accountdisc;
                        localStorage.setItem('current-user', JSON.stringify(currentuser));
                        
                    } else {
                        console.error('Invalid discountValue');
                    }
                }

                // Display a confirmation message and reset the cart display
                alert('Thank you for your purchase!');
                cartItemsContainer.innerHTML = '<p>Your cart is empty!</p>'; // Clear cart UI

                // Update waste meter 
                accountwaste += totalwaste; 
                accountdisc += totaleco; 

                currentuser.accountwaste = Math.min(accountwaste, 100);
                currentuser.accountdisc = Math.min(accountdisc, 100);

                

                currentuser.cart = []; // Empty the cart array after purchase
                // Update local storage
                localStorage.setItem('current-user', JSON.stringify(currentuser));

                console.log('Account Waste:', accountwaste);
                console.log('Account Discount:', accountdisc);
                console.log(currentuser.cart);
                location.reload();
            }
        });
    }

    // Function to update the UI based on the current cart
    // Function to update the UI based on the current cart
function updateCartUI() {
    cartItemsContainer.innerHTML = ''; // Clear the cart UI before updating
    
    if (currentuser.cart.length === 0) {
        cartItemsContainer.style.display = 'none'; // Hide the container when cart is empty
    } else {
        cartItemsContainer.style.display = 'block'; // Show the container when cart has items
        currentuser.cart.forEach(item => {
            // Ensure that wasteIndex is treated as a string, and remove the 'Waste Index: ' part
            let wasteIndexValue = String(item.wasteIndex);
            if (wasteIndexValue.includes('Waste Index: ')) {
                wasteIndexValue = wasteIndexValue.replace('Waste Index: ', '');
            }
            // Check if the product already exists in the cart
            let existingProductDiv = document.querySelector(`#product-${item.id}`);

            if (existingProductDiv) {
                // If the product already exists, update the quantity and waste index
                let quantityElement = existingProductDiv.querySelector('.quantity');
                let itemQuantities = countItemQuantities(currentuser.cart); // Recalculate quantities
                quantityElement = itemQuantities[item.id];
            } else {
                // Create a new product div if it doesn't exist
                const cartItem = document.createElement('div');
                cartItem.classList.add('product');
                cartItem.id = `product-${item.id}`;  // Unique ID for each product div
                cartItem.innerHTML = `
                    <div id='product'>
                        <img id='image' src="${item.image}" alt="${item.name}">
                        <div id='details'>
                            <h4>${item.name} </h4>
                            <p>Price: $${item.price}</p>
                            <p>Waste Index: ${item.wasteIndex}</p>
                        </div>
                        <div class='quantity-controls'>
                        <button class='add'><span class="material-symbols-outlined">
                        add_circle 
                        </span></button><span class='quantity'> ${countItemQuantities(currentuser.cart)[item.id]}</span>
                        <button class = 'remove'><span class="material-symbols-outlined" class='remove'>
                        do_not_disturb_on</button></span>
                        </div>
                        </div>
                `;
                cartItemsContainer.appendChild(cartItem);

                const removeButton = cartItem.querySelector('.remove');
                const addButton = cartItem.querySelector('.add');
                
                addButton.addEventListener('click', () => {
                    currentuser.cart.push(item);
                    localStorage.setItem('current-user', JSON.stringify(currentuser));
                    discountApplied = false; // Reset discount state
                    
                    updateCartUI();
                    recalculateTotals();
                    
                });
                
                removeButton.addEventListener('click', () => {
                    const itemIndex = currentuser.cart.findIndex(cartItem => cartItem.id === item.id);
                    if (itemIndex !== -1) {
                        currentuser.cart.splice(itemIndex, 1);
                        localStorage.setItem('current-user', JSON.stringify(currentuser));
                        discountApplied = false; // Reset discount state
                        updateCartUI();
                        recalculateTotals();
                    }
                });
            }
        });
    }

    // Recalculate totals
    recalculateTotals();
}

    
    cancelButton.addEventListener('click', () => {
        if (!discountApplied) {
            alert('No discount has been applied yet.');
            return;
        }
        
        discountApplied = false;  // Reset the discount applied state
        discountInput.value = ''; // Clear the discount input field
    
        // Recalculate totals without the discount
        recalculateTotals();
        
        // Update the total price display without the discount
        totalPriceContainer.innerHTML = `<strong><p id='total'>Total: $${total.toFixed(2)} </p>`;
        
        // Update eco and waste progress bars
        if (ecobar2) {
            ecobar2.style.width = `${accountdisc}%`; // Reset eco bar to the original value
        }
        if (wastebar2) {
            wastebar2.style.width = `${accountwaste}%`; // Reset waste bar to the original value
        }
    
        // Hide the Cancel button and show the Apply button
        cancelButton.style.display = 'none';
        applyButton.style.display = 'block';
    });


    // Check if the cart is empty and display items if available
    if (currentuser.cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty!</p>';
    } else {
        updateCartUI(); // Update the cart UI
    }

    // **5. Cap the waste progress bar at 100%**  
    if (accountwaste > 100) {
        accountwaste = 100;
    }

    // **6. Update waste progress bar width based on account waste**  
    if (wastebar) {
        wastebar.style.width = currentuser.accountwaste + '%';
    }

    // **7. Update eco progress bar width based on account discount**  
    if (ecobar) {
        ecobar.style.width = currentuser.accountdisc + '%';
    }

    if (currentuser.cart.length != 0){
        meter.style.display='block'; 
    }
});
document.addEventListener('DOMContentLoaded', function() {
  
    let logged_in = localStorage.getItem('logged-in') || 'false'; // Set default if null
  
    const signInButton = document.getElementById('sign-in')
    const accounticon = document.getElementById('accounticon');
  
    if (logged_in === 'false') {
        accounticon.style.display = "none";
        signInButton.style.display = "block";
    } else {
        accounticon.style.display = "block";
        signInButton.style.display = "none";
    }
  
    signInButton.addEventListener('click', () => {
        window.location.href = 'Login.html';
    });
  });
  const signInButton = document.getElementById('sign-in')
  signInButton.addEventListener('click', (event) => {
    window.location.href = 'Login.html';
  });
