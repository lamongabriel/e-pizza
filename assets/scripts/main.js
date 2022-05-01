// Variables
let modalQt = 0;
let modalkey = 0;
let cart = [];


// Function Simplification
const qs = (el) => document.querySelector(el);
const qsa = (el) => document.querySelectorAll(el);

// Render Pizza Area and Modal for Buying
pizzaJson.map((item, index) => {
    // Cloning pizzaItem model from HTML models div
    let pizzaItem = qs(".models .pizza-item").cloneNode(true);

    // Mapping pizza area itens to match JSON info
    pizzaItem.setAttribute("data-key", index)
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
    pizzaItem.querySelector(".pizza-item--img img").src = item.img;
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

    // Creating click element for pizza modal and filling it's information
    pizzaItem.querySelector(".pizza-item > a").addEventListener("click", (e) => {
        e.preventDefault();
        modalQt = 1;

        // Getting the parent .pizza-item based on childen <a> tag click for retrieving id attribute
        let modalPizza = e.target.closest('.pizza-item').getAttribute("data-key");
        modalkey = modalPizza

        // Modal content receives pizza array content
        qs(".pizzaInfo h1").innerHTML = pizzaJson[modalPizza].name;
        qs(".pizzaBig > img").src = pizzaJson[modalPizza].img;
        qs(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[modalPizza].price.toFixed(2)}`;
        qs(".pizzaInfo--desc").innerHTML = pizzaJson[modalPizza].description;

        // Getting pizza weight in grams from array and selecting the larger one
        qs(".pizzaInfo--size.selected").classList.remove("selected");
        qsa(".pizzaInfo--size").forEach((pizzaItem, pizzaItemIndex) => {
            pizzaItem.querySelector("span").innerHTML = pizzaJson[modalPizza].sizes[pizzaItemIndex];
            if (pizzaItemIndex == 2) {
                pizzaItem.classList.add("selected")
            };
        });

        qs(".pizzaInfo--qt").innerHTML = modalQt;

        // Calling modal and calling it's animation
        qs(".pizzaWindowArea").style.display = "flex";
        qs(".pizzaWindowArea").style.opacity = "0";
        setTimeout(() => {
            qs(".pizzaWindowArea").style.opacity = "1";
        }, 200);
    });

    // Append pizzaInfo to HTML pizza-area div
    qs(".pizza-area").append(pizzaItem);
});

function modalClose() {
    qs(".pizzaWindowArea").style.opacity = "0";
    setTimeout(() => {
        qs(".pizzaWindowArea").style.display = "none";
    }, 200);
};

// Closing modal by clicking on the cancel button
qsa(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach((item) => {
    item.addEventListener("click", modalClose);
});

// Modal quantity value change on click
qs(".pizzaInfo--qtmenos").addEventListener("click", () => {
    if (modalQt > 1) {
        modalQt--
        qs(".pizzaInfo--qt").innerHTML = modalQt;
    }

});
qs(".pizzaInfo--qtmais").addEventListener("click", () => {
    modalQt++
    qs(".pizzaInfo--qt").innerHTML = modalQt;
});

// Pizza size selector
qsa(".pizzaInfo--size").forEach((pizzaItem) => {
    pizzaItem.addEventListener("click", (e) => {
        qs(".pizzaInfo--size.selected").classList.remove("selected");
        pizzaItem.classList.add("selected");
    });
});

// Add pizza to cart
qs(".pizzaInfo--addButton").addEventListener("click", () => {
    let size = Number(qs(".pizzaInfo--size.selected").getAttribute('data-key'));
    let identifier = `${pizzaJson[modalkey].id}@${size}`

    // Filtering equal values for pizzas, like same size and same type
    let key = cart.findIndex((item) => item.identifier == identifier)
    if (key > -1) {
        cart[key].quantity += modalQt
    } else {
        cart.push({
            identifier: identifier,
            id: pizzaJson[modalkey].id,
            size: size,
            quantity: modalQt,
        });
    }

    modalClose();
    sideCart();
})

// mobile sidecart opening and closing
qs(".menu-openner").addEventListener("click", () => {
    if (cart.length > 0)
        qs("aside").style.left = 0
});

qs(".menu-closer").addEventListener("click", () => {
    qs("aside").style.left = "100vw"
});

function sideCart() {

    qs(".menu-openner span").innerHTML = cart.length;

    // Only shows sideCart if it has content inside
    if (cart.length > 0) {
        qs("aside").classList.add("show");
        qs(".cart").innerHTML = "";

        let fullPrice = 0;
        let discount = 0;
        let finalPrice = 0;

        // map every item to show them inside the sideCart
        cart.map((itemPizza, itemIndex) => {
            let pizzaCartItem = pizzaJson.find((item) => item.id == cart[itemIndex].id);
            let cartItem = qs(".models .cart--item").cloneNode(true);

            fullPrice += pizzaCartItem.price * cart[itemIndex].quantity

            // sidecart content
            cartItem.querySelector("img").src = pizzaCartItem.img
            cartItem.querySelector(".cart--item-nome").innerHTML = pizzaCartItem.name + " " + pizzaCartItem.sizes[itemPizza.size];
            cartItem.querySelector(".cart--item--qt").innerHTML = itemPizza.quantity

            // plus and minus buttons
            cartItem.querySelector(".cart--item-qtmais").addEventListener("click", () => {
                cart[itemIndex].quantity++;
                sideCart();
            })
            cartItem.querySelector(".cart--item-qtmenos").addEventListener("click", () => {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity--;
                } else {
                    cart.splice(itemIndex, 1)
                }
                sideCart();
            })

            qs(".cart").append(cartItem);
        });

        discount = fullPrice * 0.1
        finalPrice = fullPrice - discount

        qs(".subtotal span:nth-child(2)").innerHTML = "R$ " + fullPrice.toFixed(2).replace(".", ",")
        qs(".desconto span:nth-child(2)").innerHTML = "R$ " + discount.toFixed(2).replace(".", ",")
        qs(".total span:nth-child(2)").innerHTML = "R$ " + finalPrice.toFixed(2).replace(".", ",")

        // If empty, sideCart hides
    } else {
        qs("aside").classList.remove("show");
        qs("aside").style.left = '100vw'
    }
}