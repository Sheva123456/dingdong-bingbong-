
    // Tab Switching Function
    function openPage(pageName, elmnt, color) {
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablink");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
      }
      document.getElementById(pageName).style.display = "block";
      elmnt.style.backgroundColor = color;
    }

    // Click default tab on page load
    document.getElementById("defaultOpen").click();

    //===============================================================================================================





    // Filter Selection Function
    filterSelection("all");
    function filterSelection(c) {
      var x, i;
      x = document.getElementsByClassName("filterDiv");
      if (c == "all") c = "";
      for (i = 0; i < x.length; i++) {
        w3RemoveClass(x[i], "show");
        if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
      }
    }

    function w3AddClass(element, name) {
      var i, arr1, arr2;
      arr1 = element.className.split(" ");
      arr2 = name.split(" ");
      for (i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
      }
    }

    function w3RemoveClass(element, name) {
      var i, arr1, arr2;
      arr1 = element.className.split(" ");
      arr2 = name.split(" ");
      for (i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
          arr1.splice(arr1.indexOf(arr2[i]), 1);     
        }
      }
      element.className = arr1.join(" ");
    }

    // Add active class to the current button (highlight it)
    var btnContainer = document.getElementById("myBtnContainer");
    var btns = btnContainer.getElementsByClassName("btn");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function(){
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
      });
    }



// Tab Switching Function

  // Function to get URL parameter
  function getUrlParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }
  
  // Function to open a tab by URL parameter or default
  window.onload = function () {
    const tabFromUrl = getUrlParam("tab"); // Get 'tab' parameter from URL
    if (tabFromUrl && document.getElementById(tabFromUrl)) {
      // Open the specified tab if it exists
      openPage(tabFromUrl, document.querySelector(`[onclick*="${tabFromUrl}"]`), "#4CAF50");
    } else {
      // Open the default tab
      document.getElementById("defaultOpen").click();
    }
  };

//add to cart and product data 

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

let currentuser = JSON.parse(localStorage.getItem('current-user')) || { cart: [] };
document.addEventListener('DOMContentLoaded', () => {
  // Retrieve products from localStorage or use a default array
  const products = JSON.parse(localStorage.getItem('products')) || [];
  

  // Attach event listeners to all "Add to Cart" buttons
  document.querySelectorAll('.product button#add-to-cart').forEach((button) => {
      button.addEventListener('click', () => {
          // Get the product ID from the parent `.product` div
          const productElement = button.closest('.product');
          const productId = productElement.getAttribute('data-id');
          
          // Find the product in the products array
          const product = products.find(p => p.id == productId);

          if (product) {
              // Add the product to the current user's cart
              currentuser.cart.push(product);

              // Update localStorage for the current user
              localStorage.setItem('current-user', JSON.stringify(currentuser));

              // Optional: Alert the user
              alert(`${product.name} has been added to your cart!`);
          } else {
              console.error('Product not found!');
          }
      });
  });
});

console.log(currentuser)
  
