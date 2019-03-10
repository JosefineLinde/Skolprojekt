// ...
// GLOBAL VARIABLES: const.
// ...

// ...
// GLOBAL VARIABLES: let.

let shoppingCart = [];
// ...

// this variable will be set to the list of of documents returned by the Firestore database. This variable is 
// undefined, meaning it has no value at all, when the page first loads. 
let documents;

// ...
// FUNCTIONS.
// ...
 // funktion för att räkna ut slutpris för en beställning.
 function calculateTotalPrice() {
    let total = 0;
    for (let i = 0; i < shoppingCart.length; i++) {
        total = total + shoppingCart[i].price;
       // console.log('Nuvarande total; ' + total);
       // console.log('Nuvarande produkts pris: ' + produktLista[i].price);
      }
    return total;
   }

  
// ...
// JQUERY EVENT FUNCTIONS (i.e. click() or change()).
// ...



$('#make-order').click(() => {
    // check if varukorg is NOT empty.
    if (shoppingCart.length > 0) {
        $('#make-order').html('<p>Din beställning har genomförts!</p>');
        $('#shoppingCartStatus').empty() 
        $('#totalPrice').empty() 
         shoppingCart = []
    } else {
        $('#make-order').html('<p>Din varukorg är tom!</p>')

       
    }

    dataLayer.push({
        shoppingCart
    })

    
     dataLayer.push({
         event: 'make-order'
         });
});

// ...
// CODE TO RUN ON PAGE LOAD (= code that is only meant to be run once, e.g. getting data from Firestore).
// ...
// get access to the Firestore database.
let db = firebase.firestore();

// get the collection named 'products' (this collection must exist in Firestore).
let collection = db.collection('products');

// create a query to: Get all documents, order alphabetically by the field (property) 'name'.
let query = collection.orderBy('name');

// run the query against the Firestore database; this may take certain amount of time.
query.get().then((products) => {
    // the database has completed the query and returned an object that we've named 'products'.
    //
    // The products object contains the actual list of documents returned by the database; save the list in the global
    // variable called documents.
    documents = products.docs;

    // loop through our list of documents.
    for (let i = 0; i < documents.length; i++) {
        // for each document, call a function called data() on it (to get the document's data) and save the data
        // in a variable called productData.
        let productData = documents[i].data();

       

        let htmlString = `
            <div>
                <span>${productData.name}</span>
                <span>${productData.price}</span>
                <img src=${productData.img}></img>
                <button class="buy" data-product-id="${productData.productId}">Add</button>
            </div>
        `;

       $('#productData').append(htmlString);

    
    }

    $('.buy').click((event) => {
        let productId = $(event.target).attr('data-product-id');
       
        let data = findFirebaseData(documents,'productId',productId);
        
        shoppingCart.push(data);

         // push the list representing the shopping cart onto the the data layer.
    dataLayer.push({
        shoppingCart
    })

    // send the 'add-to-cart' event to GTM.
     dataLayer.push({
         event: 'add-to-cart'
     });
     

        let productList = findObjectsInList(shoppingCart,'productId', productId);
        if (productList.length === 1) {
            let htmlString = `
            <div id="${productId}">
                <span>${data.name}</span>
                <span class="price">${data.price}</span>
                <span class="antal">1</span>
                <button id="remove-${productId}">Delete</button>
            </div>
        `;

        $('#shoppingCartStatus').append(htmlString);

        $('#remove-' + productId).click(() => {
       
            removeObjectsInList(shoppingCart, 'productId', productId);

            $('#' + productId).remove(); 

            dataLayer.push({
                shoppingCart: undefined
            })

            
            dataLayer.push({
                shoppingCart
            })

            
            dataLayer.push({
                event: 'remove-from-cart'
             });
           
        
            $('#totalPrice').html('Total:' + calculateTotalPrice());
        });
            
        $('#totalPrice').html('Total:' + calculateTotalPrice());

        } else {
            $('#'+ productId +' .antal').html(productList.length);  
            $('#'+ productId +' .price' ).html(productList.length * data.price);
             
          
            $('#totalPrice').html('Total:' + calculateTotalPrice());
        }

        
    });

   
});

 

        
        



// while the query is being processed by the database, show to the user that data is being loaded, for example 
// using a spinner. For now, just log a message to the console.
console.log('Query sent to database, awaiting results...');

