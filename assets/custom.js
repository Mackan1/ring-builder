/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */
 var lazyLoadInstance = new LazyLoad({
    elements_selector: '.lazy',
    class_loading: 'lazy-loading',
    class_loaded: 'lazy-loaded',
    threshold: 300
  })
  


// Ring builder js

  const allSteps = document.querySelectorAll(".step")
  const allParts = document.querySelectorAll(".builder-part")
  const allMetals = document.querySelectorAll(".metal")

  //The bottom drawer which can be enabled in section schema
 if (document.querySelectorAll(".bottom-drawer__container").length > 1){
    var allBottomDrawerContainer = document.querySelectorAll(".bottom-drawer__container")
  } else {
    var allBottomDrawerContainer = false
  }
  
//Declaring all the global variables which are used to find and add to cart the correct combi product the user has gotten
  let diamondHandle;
  let diamondTitle;
  let diamondImage;
  let diamondPrice;

  let bandHandle;
  let bandTitle;
  let bandImage;
  let bandMetal;
  let bandPrice;
  
  let combiSize;
  
  let engravingText;
  let engravingFontType;

  let combiProduct;
  let combinationId;

  // default diamond value (mostly only used for the bottom drawer which may be disabled)
  if(!diamondHandle){
    let firstDiamondDiv = document.querySelector('.collection-display[data-index="0"]').querySelector(".product-card")
    //firstDiamondDiv.querySelector(".product-select button").style.border = "1px solid black"
    document.querySelectorAll(".selected-diamond").forEach((display)=>{
        display.innerText = firstDiamondDiv.querySelector(".product-title").innerText + " (default)"
    })
    document.querySelectorAll(".selected-diamond-price").forEach((display)=>{
        display.innerText = firstDiamondDiv.querySelector(".product-price").innerText
    })

    if (allBottomDrawerContainer){
      allBottomDrawerContainer[0].style.display = "flex"
    }
    
  }

// The select function which is called when the user choses a diamond or band
  function selectBtn(event){
    document.querySelector('.ring-builder').scrollIntoView();
    //partindex is the index of the selection part (Diamond selection or Band selection part) the user is at. 
    partIndex = parseInt(event.target.closest(".collection-display").dataset.index)
    let parentCardDiv = event.target.closest(".product-card")

    //inserting the selected diamond into the the correct global variables from the top of js file
    if (partIndex == "0"){
      diamondHandle = event.target.dataset.handle
      diamondTitle = parentCardDiv.querySelector(".product-title").innerText
      diamondImage = parentCardDiv.querySelector("img").src
      diamondPrice = parentCardDiv.querySelector(".product-price").innerText
      
      document.querySelectorAll(".selected-diamond").forEach((display)=>{
        display.innerText = diamondTitle
      })
      
      document.querySelectorAll(".selected-diamond-price").forEach((display)=>{
        display.innerText = diamondPrice
      })

      document.getElementById("selected-diamond-image").src = diamondImage
      allSteps[partIndex+1].classList.remove('was-active')

  //Default band metal image border and default band which is used for steps and bottom drawer
      if (!bandMetal){
        let firstBandDiv = document.querySelector('.collection-display[data-index="1"]').querySelector(".product-card")

        document.querySelectorAll(".active-band-metal-title").forEach((title)=>{
          let firstMetalOption = title.closest(".band-metal").querySelectorAll(".metal")[0]
          firstMetalOption.classList.add("active-band-metal")
          bandMetal = firstMetalOption.dataset.value
        })

        document.querySelectorAll(".selected-band").forEach((display)=>{
          display.innerText = firstBandDiv.querySelector(".product-title").innerText + " (default)"
        })
        document.querySelectorAll(".selected-band-metal").forEach((display)=>{
          display.innerText = firstBandDiv.querySelector(".active-band-metal-title").innerText.replace("Metal: ", "")
        })
        document.querySelectorAll(".selected-band-price").forEach((display)=>{
          display.innerText = firstBandDiv.querySelector(".product-price").innerText
        })
            if (allBottomDrawerContainer){
              allBottomDrawerContainer[1].style.display = "flex"
            }
      }
        //inserting the selected band into the the correct global variables from the top of js file
    } else {
      bandHandle = event.target.dataset.handle
      bandTitle = parentCardDiv.querySelector(".product-title").innerText
      bandImage = parentCardDiv.querySelector("img").src
      bandPrice = parentCardDiv.querySelector(".product-price").innerText

      document.querySelectorAll(".selected-band").forEach((display)=>{
        display.innerText = bandTitle
      })
      document.querySelectorAll(".selected-band-price").forEach((display)=>{
        display.innerText = bandPrice
      })
      document.querySelectorAll(".selected-band-metal").forEach((display)=>{
          display.innerText = bandMetal
      })

      document.getElementById("selected-band-image").src = bandImage

      if (allBottomDrawerContainer){
        allBottomDrawerContainer[1].style.display = "flex"
      }
    }


  // Step process at the top of the ring builder. 
      //This part is for step 1(diamond) and step 2(band). It is to make the step on top clickable and so the screen only shows the correct part
      allSteps[partIndex].querySelector(".change").addEventListener("click", (event)=>{
          allParts.forEach((part)=>{
              part.classList.remove('active-selector')
          })
          allParts[parseInt(event.target.closest(".step").dataset.index)].classList.add('active-selector')
          for (let i= 0; i < allSteps.length; i++){
            if (i == (parseInt(event.target.closest(".step").dataset.index))){
              allSteps[i].classList.add('active')
              allSteps[i].classList.remove('was-active')
            } else {       
              allSteps[i].classList.remove('active')  
              if(i != (allSteps.length -1)){
                allSteps[i].classList.add('was-active')    
              }
            }
          }
      })
      //This part is only for step 3(complete diamond). To make it possible for the user to click on the step 3 button after they have chosen a band(if they were to go back to a prior step and regret)
      if(bandHandle){
        allSteps[2].addEventListener("click", (event)=>{
          allParts.forEach((part)=>{
              part.classList.remove('active-selector')
          })
          allParts[parseInt(event.target.closest(".step").dataset.index)].classList.add('active-selector')
          for (let i= 0; i < allSteps.length; i++){
            if (i == (parseInt(event.target.closest(".step").dataset.index))){
              allSteps[i].classList.add('active')
              allSteps[i].classList.remove('was-active')
            } else {       
              allSteps[i].classList.remove('active')  
              if(i != (allSteps.length -1)){
                allSteps[i].classList.add('was-active')    
              }
            }
          }
      })
      }

      
//Displaying the correct selection part and turning the others to display none
      if (diamondHandle && !bandHandle){
        allSteps[partIndex+1].classList.add('active')
        allSteps[0].classList.add('was-active')
        allSteps[partIndex].classList.remove('active')
        allParts[partIndex].classList.remove('active-selector')
        allParts[partIndex+1].classList.add('active-selector')
      } else if (diamondHandle && bandHandle){
        allSteps[2].classList.add('active')
        allSteps[0].classList.add('was-active')
        allSteps[1].classList.add('was-active')
        allSteps[partIndex].classList.remove('active')
        allParts[2].classList.add('active-selector')
        allParts[partIndex].classList.remove('active-selector')
        findingProduct()
      }
      
  }


//The band metal choser at the band part
  function addBandMetal(event) {
    let parentDiv = event.target.closest(".band-metal")
    parentDiv.querySelectorAll("img").forEach((metal)=>{
      metal.classList.remove("active-band-metal")
    })
    bandMetal = event.target.dataset.value
    event.target.classList.add("active-band-metal")
    parentDiv.querySelector(".active-band-metal-title").innerText = "Metal: " + event.target.dataset.value
    event.target.closest(".product-card").querySelector(".variant-image").src = event.target.dataset.image
    event.target.closest(".product-card").querySelector(".product-price").innerHTML = event.target.dataset.price
  }

  function hoverBandMetal(event){
    event.target.closest(".band-metal").querySelector(".active-band-metal-title").innerText = "Metal: " + event.target.dataset.value
  }

  function selectedBandMetal(event){
   event.target.closest(".band-metal").querySelector(".active-band-metal-title").innerText = "Metal: " + event.target.closest(".band-metal").querySelector(".active-band-metal").dataset.value
  }

  // Fetching the bands using ajax api on window onload to save load time
  function fectingBands(){ 
   fetch("https://markus-blazar.myshopify.com/collections/bands?view=bands-ajax")
            .then(response => response.text())
            .then((data) =>{
              document.getElementById("bandCollection").innerHTML += data
              document.querySelectorAll(".product-select button").forEach((button)=>{
                button.addEventListener("click", selectBtn )
              })
            })
    
  }

  // Fetching all the final combinations using ajax api on window onload to save load time. All the combinations are saved in the variable combinations which will be used later
  let combinations = []
  function fectingCombinations(){ 
   fetch("https://markus-blazar.myshopify.com/collections/combinations?view=combinations-ajax.json")
            .then(response => response.json())
            .then((data) =>{
              combinations = [...data]
            })
  }


  //The diamond filter. It filters with the help of all diamonds from the diamonds collection in json format(declared in the liquid file).
  let currentTag;

  function filteredDiamonds (event){
    document.querySelector('.collection-display[data-index="0"]').innerHTML = ""
   if (event.target.dataset.tag == currentTag){
      event.target.classList.toggle("is-active")
      currentTag = ""
   } else {
      currentTag = event.target.dataset.tag
     event.target.closest(".my-heart-filters").querySelectorAll("button").forEach((button)=>{
      button.classList.remove("is-active")
     })
     event.target.classList.add("is-active")
   }
   
   if (currentTag){
    allDiamonds.forEach((product)=>{
      if (product.tags.indexOf(event.target.dataset.tag) > -1){
        document.querySelector('.collection-display[data-index="0"]').innerHTML += `
          <div class="product-card">
          <img
            class="product-image Image--lazyLoad Image--fadeIn"
            src="${ product.images[0]  }"
            onmouseover="this.src='${product.images[1]}';"
            onmouseout="this.src='${product.images[0] }';"
          />
          <div class="product-information">
            <h3 class="product-title">${ product.title }</h3>
            <p class="product-price">${ product.price }</p>
          </div>
          <div class="product-select">
            <button
              onclick="selectBtn(event)"
              class="Button Button--primary"
              data-handle="${ product.handle }"
            >
              SELECT
            </button>
          </div>
        </div>
        `
      } 
    })
    //If the users wants revert and remove their diamond filter choice they can press on the active tag filter and get all diamonds back
   } else {
     allDiamonds.forEach((product)=>{
        document.querySelector('.collection-display[data-index="0"]').innerHTML += `
          <div class="product-card">
          <img
            class="product-image Image--lazyLoad Image--fadeIn"
            src="${ product.images[0] }"
            onmouseover="this.src='${ product.images[1] }';"
            onmouseout="this.src='${ product.images[0] }';"
          />
          <div class="product-information">
            <h3 class="product-title">${ product.title }</h3>
            <p class="product-price">${ product.price }</p>
          </div>
          <div class="product-select">
            <button
              onclick="selectBtn(event)"
              class="Button Button--primary"
              data-handle="${ product.handle }"
            >
              SELECT
            </button>
          </div>
        </div>
        `
    })
   }
    
  }


  // function findingPriceBottomDrawer(){
  //   var diamondTag = "__builder-diamond:" + diamondHandle
  //   var bandTag = "__builder-band:" + bandHandle
  //         //to display the right combination product at complete ring
  //         combinations.forEach((combination)=>{
  //            if (combination.tags.indexOf(diamondTag) > -1 && combination.tags.indexOf(bandTag) > -1) {
  //                     combiProduct = combination
  //                 }
  //         })
  //     combiProduct.variants.forEach(function(variant){
  //             if (variant.option1 == bandMetal && variant.featured_image.src){
  //                             document.querySelector(".add-to-cart-drawer").innerHTML = variant.price
  //             }
  //           })
  // }

//the finding product function finds the right combination from the users choices by finding the correct 
  function findingProduct(){
          let diamondTag = "__builder-diamond:" + diamondHandle
          let bandTag = "__builder-band:" + bandHandle
          //to display the right combination product at complete ring
          combinations.forEach((combination)=>{
             if (combination.tags.indexOf(diamondTag) > -1 && combination.tags.indexOf(bandTag) > -1) {
                      combiProduct = combination
                  }
          })
          document.getElementById("ring-size").innerHTML = '<option value="" disabled selected>SELECT YOUR RING SIZE</option>'
          document.querySelector(".img-showcase").innerHTML = "<img class='Image--lazyLoad Image--fadeIn' id='active-image' src='' alt='' />"

          //finds the right product variant id using bandmetal to find the right variant
          combiProduct.variants.forEach((variant)=>{
            if (variant.option1 == bandMetal && variant.featured_image.src){
              document.getElementById("active-image").src = variant.featured_image.src
              document.getElementById("combination-price").innerHTML = variant.price
            }
            //Inserting all the available sizes for the variant in the Ring sizes dropdown
             if (variant.option1 == bandMetal){
              document.getElementById("ring-size").innerHTML += `
                <option value="${variant.option2}">${variant.option2}</option>
              `
            }
          })

          
                      
          //Inserting the correct band and diamond information at the complete ring display
          document.getElementById("combination-band-title").innerHTML = bandTitle
          document.getElementById("combination-band-metal").innerHTML = bandMetal
          document.getElementById("combination-band-price").innerHTML = bandPrice

          document.getElementById("combination-diamond-title").innerHTML = diamondTitle
          document.getElementById("combination-diamond-price").innerHTML = diamondPrice

          document.getElementById("combination-description").innerHTML = combiProduct.description

          //inserting the correct images at the final complete ring. Extra focus on the featured variant image because the first combi image should have the correct bandmetal      
          combiProduct.images.forEach((image)=>{
              let activeImage = document.getElementById("active-image").src
              if (!activeImage.includes(image)){
                let img = document.createElement('img'); 
                img.src = image;
                document.querySelector(".img-showcase").appendChild(img)
              }
          })
           document.querySelector(".img-select").innerHTML = ""

          document.querySelectorAll(".img-showcase img").forEach((image, index)=>{
             document.querySelector(".img-select").innerHTML += `
             <div class="img-item">
              <a href="#" data-id="${(index) + 1}">
                ${image.outerHTML}
              </a>
            </div>`});
          
          const imgs = document.querySelectorAll(".img-select a")
          const imgBtns = [...imgs]
        
          
          imgBtns.forEach((imgItem)=>{
            imgItem.addEventListener("click", (event)=>{
             
              event.preventDefault();
              imgId = imgItem.dataset.id;
              slideImage();
            })
          })
  }
    let imgId = 1

    function slideImage(){
            const displayWidth = document.querySelector(".img-showcase img:first-child").clientWidth;
            document.querySelector(".img-showcase").style.transform = `translateX(${-(imgId - 1)*displayWidth}px)`
    }



//finding the correct combination is after the user also has chosen ring size. This is used to add the correct product to cart
  function findCombiId (selected){
    combiSize = selected.value
      combiProduct.variants.forEach((variant)=>{
            if (variant.option1 == bandMetal && variant.option2 == combiSize){
              combinationId = variant.id
      }
    })
  }

  //If the user decides to want engraving this function is called to show the users options
  function showEngraving (selected){
    if (selected.value == "Yes"){
        document.querySelector(".combination-engraving-options").style.display = "block"
    } else {
        engravingText = ""
        engravingFontType = ""
       document.querySelector(".combination-engraving-options").style.display = "none"
    }
  }

  function inputEngravingText (text){
    engravingText = text.value
  }

  function engravingFontSelection(fontType){
    engravingFontType = fontType.value
  }


//The change button which activates the correct selection part is shown when the user presses the step on top of the ringg builder
  function changeButton(event){
            allParts.forEach((part)=>{
              part.classList.remove('active-selector')
            })
            allParts[parseInt(event.target.dataset.index)].classList.add('active-selector')
            for (let i= 0; i < allSteps.length; i++){
                if (i == (parseInt(event.target.dataset.index))){
                allSteps[i].classList.add('active')
              } else {
                allSteps[i].classList.remove('active')
              }
            }
  }

  //used for the bottom drawer when the user presses book an appointment
  function scrollOnTop(){
    window.scrollTo(0, 0);
  }

  //Add to cart function and updating the drawer
  function addToCart (event){
    event.preventDefault();
    if (combiSize){
      let formData = {
        "items": [
          {
            "id": combinationId,
            "quantity": 1,
            "properties": {
              "Engraving": engravingText,
              "Engraving Font": engravingFontType
            }
          }
        ]
      }
      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

        //updating the cart drawer and cart count
        .then((resp) => {
          document.dispatchEvent(
            new CustomEvent('product:added', {
              bubbles: true,
              detail: {
                variant: combinationId,
                quantity: 1
              }
            }))
        })
        .catch((err) => {
          console.error('Error: ' + err)
        })
        document.getElementById("ring-size-label").style =""
    } else {

      //if ring size has not been chosen it will scroll to it and turn red
      const combinationSizeButton = document.getElementById("ring-size-label")
      document.querySelector(".combination-information").scrollIntoView();
      combinationSizeButton.style.color = "red"
      combinationSizeButton.style.fontWeight = "bold"
    }
  }