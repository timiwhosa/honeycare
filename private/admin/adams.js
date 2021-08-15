var hhh;
var ordertofetch = 1;

// toggle section
async function section(position) {
    var h = position;
  var y = document.querySelectorAll(".dashb-sections");
  for (i = 0; i < y.length; i++) {
    y[i].classList.remove("active");
    }
    window.location.href = window.location.href.split("#")[0] + `#${h}`;
    for (j = 0; j < y.length; j++) {
        if(y[j].dataset.target === window.location.href.split("#")[1]){
          y[j].classList.add("active");
        }
    }
  sectiontoshow(h);
}
async function sectiontoshow(section) {
  var y = document.querySelectorAll(".ctn");
  for (i = 0; i < y.length; i++) {
    y[i].classList.remove("active");
  }
  document.getElementById(section).classList.add("active");
}
section(window.location.href.split("#")[1]);


// TAB TOOGLE
var exactTarget;
async function tab(div) {
  var targetID = div.attributes[0].nodeValue;
  if (targetID === "request-products") {
    ordertofetch = 1;
    fetchOrder("recent")
  } else {
    ordertofetch = 2;
    fetchOrder("recent")
  }
  exactTarget = div.parentElement.parentElement.children[2].children;
  var divPosition;
  for (i = 0; i < exactTarget.length; i++) {
    if (exactTarget[i].id === targetID) {
      divPosition = i;
    }
  }
  for (i = 0; i < exactTarget.length; i++) {
    await divPosition;
    if (divPosition == 0) {
      exactTarget[0].style.left = 0;
      for (j = 1; j < exactTarget.length; j++) {
        exactTarget[j].style.left = "120%";
      }
      break;
    } else {
      if (i < divPosition) {
        exactTarget[i].style.left = "-120%";
      } else if (i > divPosition) {
        exactTarget[i].style.left = "120%";
      } else if (i == divPosition) {
        exactTarget[divPosition].style.left = 0;
      }
    }
  }
}

// MARKER
var tabs = document.querySelectorAll(".tab");
var marker = document.querySelectorAll(".indicator");

function indicator(e) {
  marker.forEach((mark) => {
    mark.style.left = e.offsetLeft + "px";
    mark.style.width = e.offsetWidth + "px";
  });
}
tabs.forEach((link) => {
  indicator(link.childNodes[1]);
});

// eventlistener for each span tab
tabs.forEach((link) => {
  link.childNodes.forEach((item) => {
    if (item.nodeName == "SPAN") {
      item.addEventListener("click", function (e) {
        indicator(e.target);
      });
    }
  });
});


// close overlay
var cover = document.getElementsByClassName("cover")[0];
var overlay = document.getElementsByClassName("overlay")[0];
function closeoverlay() {
    cover.style.display = "none";
    overlay.style.display = "none";
}
function showoverlay() {
  cover.style.display = "block";
  overlay.style.display = "block";
}
cover.addEventListener("click", closeoverlay);
overlay.children[0].addEventListener("click", closeoverlay);

// ALL ORDERS

async function eachorder(data) {
    var allorder = "";
    data.map((order) => {
        allorder += `
        <div class="product" onclick="getorder('${order._id}')">
                            <div class="product-head">
                                <div>
                                    <div class="">
                                        <div><span>Name:</span> <span>${order.name}</span></div>
                                        <div><span>Number:</span> <span>${order.number}</span></div>
                                        <div ><span>Paid:</span> <span>${order.total}</span></div>
                                        <div ><span>${order.date} ${order.time}</span></div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
        
        `;
    })
    document.getElementById("request-products").innerHTML = allorder;
}

// SINGLE ORDER
async function  loadspecificorder(data) {
    showoverlay();

    var allproducts = "";
    data[0].products.map((product) => {
        allproducts += `
            <div class="prod">
                    <img loading="lazy" src="/img/product/${product.section}/${product.subsection}/${product._id}.png" alt="">
                    <div class="grid">
                        <span class="b">${product.name}</span>
                        <span class="">${product.price}</span>
                        <span class="">Qty: ${product.incart}</span>
                    </div>
                </div>
        
        `;
    })
  var [status, text] = (function stats(id) {
    if (data[0].customerDetails.status === "delivered") {
      return ["notdelivered('" + id.toString() + "')", "Not Delivered"];
    } else {
      return ["delivered('" + id.toString() + "')", "Delivered"];
    }
  })(data[0]._id);
    var prod = await `
    <div class="single-order">
        <div class="single-order-left">
            <p class="b">Customer Details</p>
            <ul>
                <li class="b">Name: </li>
                <li> ${data[0].customerDetails.name}</li>
                <li class="b"> Number:</li>
                <li>${data[0].customerDetails.number}</li>
                <li class="b"> Address:</li>
                <li> ${data[0].customerDetails.address}</li>
            </ul>
        </div>
        <div class="single-order-right">
            <p class="total">Total: <span class="b blue">${
              data[0].customerDetails.total
            }</span></p>
            <div class="single-order-right-orders">
                ${allproducts}
            </div> 
            <button class="btn" type="submit" onclick="${status}">${text}</button>
        </div>
    </div>
    `;
    overlay.children[1].innerHTML = prod;
}

// onclick="delivered('${data[0]._id}')"
// Refill 
function refill(data) {
  var refillDiv = document.getElementById("refills");
  refillDiv.innerHTML="";
  data.forEach((refil) => {
    refillDiv.innerHTML += `
<div class="refill">
  <img loading="lazy" src="/img/product/allproducts/product4.png" alt="">
  <div class="">
      <div class=""><span>Name:</span>${refil.name}</div>
      <div class=""><span>Number:</span>${refil.number}</div>
      <div class="">${refil.date} ${refil.time}</div>
      <div class="flex">
      <button class="bg-dblue" onclick="deliveredRefill('${refil._id}')">Delivered</button>
      <button class="bg-dgreen" ><a href="/img/product/allproducts/product4.png" class="white" download>Download</a></button></div>
  </div>
</div>
`;
  })
}

function loadcategoryOptions(data) {
  var categorytoedit = document.getElementById("categorytoedit");
  var editcategory = document.getElementById("editcategory");
  var categoryfallunder = document.getElementById("categoryfallunder");
  categorytoedit.innerHTML = "";
  editcategory.innerHTML = "";
  categoryfallunder.innerHTML = "";
  if (data.length > 0) {
    data[0].categories.forEach((category) => {
      categorytoedit.innerHTML += `<option value=${category}>${category}</option>`;
      editcategory.innerHTML += `<option value=${category}>${category}</option>`;
      categoryfallunder.innerHTML += `<option value=${category}>${category}</option>`;
    });
  } else {
    categorytoedit.innerHTML = "<option>no category</option>";
    editcategory.innerHTML = "<option>no category</option>";
    categoryfallunder.innerHTML = "<option>no category</option>";
  }
}

document
  .getElementById("edit-category")
  .addEventListener("submit", categorytoeditfnc);

function categorytoeditfnc(e) {
  e.preventDefault();
  console.log(e.target[0].value)
}





// GET REQUEST

function getallorders(type) {
  fetch(`/orders?type=${type}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      eachorder(data);
    })
    .catch((err) => {
      console.error(err);
    });
}

function getorder(id) {
    
    fetch(`/order?id=${id}`).then((res) => {
        return res.json();
    }).then((data) => {
        loadspecificorder(data);
    }).catch((err) => {
        console.error(err);
    })
}


function fetchOrder(type) {
  if (ordertofetch === 1) {
      getallorders(type);
  }
  else if (ordertofetch === 2) {
    fetch(`/refills?type=${type}`)
    .then((refill) => {
      return refill.json();
    })
    .then((data) => {
      // console.log(data);
      refill(data);
    });
  }
}






//POST REQUEST

// order Delivered
function delivered(id) {
  var confirmit = confirm("Are you sure this product has been Delivered");
  if (confirmit === true) {
    fetch("/order-delivered", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        alert(data.message);
        closeoverlay();
        fetchOrder("recent");
      })
      .catch((err) => console.error(err));
  }
}
function notdelivered(id) {
  var confirmit = confirm("Not Delivered this");
  if (confirmit === true) {
    fetch("/order-notdelivered", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        alert(data.message);
        closeoverlay();
        fetchOrder("delivered");
      })
      .catch((err) => console.error(err));
  }
}

function deliveredRefill(id) {
  var confirmit = confirm("Add item to Delivered?");
  if (confirmit === true) {
    console.log(id);
  }
}

document
  .getElementById("new-category-form")
  .addEventListener("submit", addnewcategory);
function addnewcategory(e) {
  e.preventDefault();
  var confirmit = confirm("Add this category");
  if (confirmit === true) {
    fetch("/addcategory", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ category: e.target[0].value }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.status === 208) {
          alert(data.message)
        } else {
          success(data.message);
          e.target[0].value = "";
        }
      })
      .catch((err) => console.error(err));
  }
}

function success(data) {
  var successDiv = document.getElementById("success");
  successDiv.innerText = data;
  successDiv.style.display = "flex"
  setTimeout(() => {
    successDiv.style.display = "none";
  }, 2000);
}

fetch("/allcategories").then((res) => { return res.json() })
  .then((data) => {
    loadcategoryOptions(data);
    console.log(data);
})

// toogle
if (window.location.href.includes("#")){
  if (window.location.href.split("#")[1] === "request") {
    fetchOrder("recent");
  }
} else {
    window.location.href = window.location.href + "#request";
}


