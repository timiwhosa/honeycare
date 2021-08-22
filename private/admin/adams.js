var hhh;
var allcategorydata;
var ordertofetch = 1;

// toggle section
async function section(position) {
  var y = document.querySelectorAll(".dashb-sections");
  for (i = 0; i < y.length; i++) {
    y[i].classList.remove("active");
    }
    window.location.href = window.location.href.split("#")[0] + `#${position}`;
    for (j = 0; j < y.length; j++) {
        if(y[j].dataset.target === window.location.href.split("#")[1]){
          y[j].classList.add("active");
        }
    }
  sectiontoshow(position);
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


// PRODUCT ACCORDION
function accordion(){
  var accordionHead = document.getElementsByClassName("accordion-head");
  Object.entries(accordionHead).forEach((accord) => {
    accord[1].addEventListener("click", showprodcat);
  });
  function showprodcat(e) {
    console.log(e);
    Object.entries(accordionHead).forEach((accord) => {
      console.log(accord.parentElement);
      accord[1].parentElement.classList.remove("active");
    });
    e.target.parentElement.classList.add("active");
  }
}


// PRODUCT ACCORDION

function accordioncontent(){
  var accordionContent = document.getElementsByClassName("accordion-content");
  Object.entries(accordionContent).forEach((accord) => {
    // console.log(accord[1])
    Object.entries(accord[1].children[0].children).forEach((accordchild) => {
      accordchild[1].addEventListener("click", showprodsubcat);
    });
  });
  function showprodsubcat(e) {
    // console.log(e);
    Object.entries(accordionContent).forEach((accord) => {
      Object.entries(accord[1].children[0].children).forEach((accordchild) => {
        accordchild[1].classList.remove("active");
      });
    });
    e.target.classList.add("active");
  }
}

// LOAD CATEGORY AND SUBCATEGORY OF PRODUCTS
function loadcatandsubcatforproduct() {
  var cat = document.getElementsByClassName("cat")[0]
  cat.innerHTML= "";
  allcategorydata[0].categories.forEach((category) => {
    var ul;
    ul = '';
    category.sub.forEach((subcat) => {
      ul += `<li>${subcat} </li>`
    });
    cat.innerHTML += `
      <div class="accordion">
        <button class="head accordion-head">
            ${category.name}
        </button>
        <div class="content accordion-content">
            <ul>
                ${ul}
            </ul>
        </div>
      </div>    
    `;

  });
  accordion();
  accordioncontent();
  document.getElementsByClassName("accordion")[0].classList.add("active");
}


// LOAD CATEGORY OPTIONS
function loadcategoryOptions(data) {
  var cat = document.getElementsByClassName("selectcategory");
  if (data.length > 0) {
    Object.entries(cat).forEach((catDiv) => {
      catDiv[1].innerHTML = "";
      data[0].categories.forEach((category) => {
        console.log(category.name)
        catDiv[1].innerHTML += `<option value="${category.name}">${category.name}</option>`;
      });
    });
  } else {
    Object.entries(cat).forEach((catDiv) => {
      catDiv[1].innerHTML += `<option></option>`;
    });
  }
}

// LOAD SUBCATEGORY OPTIONS

function loadsubcategoryOptions(data) {
  var cat = document.getElementsByClassName("selectsubcategory");
  if (data.length > 0) {
    if(data[0].categories[0].sub.length>=0){
      Object.entries(cat).forEach((catDiv) => {
        catDiv[1].innerHTML = "";
        data[0].categories[0].sub.forEach((subcategory) => {
          catDiv[1].innerHTML += `<option value=${subcategory}>${subcategory}</option>`;
        });
        catDiv[1].previousElementSibling.previousElementSibling.addEventListener(
          "change",
          changesubcatbasedoncat
        );
      });
    }
  } else {
    Object.entries(cat).forEach((catDiv) => {
      catDiv[1].innerHTML += `<option></option>`;
    });
  }
}

// CHANGE SUBCATEGORY BASED ON CATEGORY SELECTED
function changesubcatbasedoncat(cat) {
  var subcatdiv = cat.target.nextElementSibling.nextElementSibling;
  subcatdiv.innerHTML= "";
  allcategorydata[0].categories.forEach((category) => {
    if (category.name === cat.target.value) {
      category.sub.forEach((subcat) => {
        console.log(subcat)
        subcatdiv.innerHTML += `<option value=${subcat}>${subcat}</option>`;
      })
    }
  });
}

function success(data) {
  var suc = document.createElement("div");
  suc.setAttribute("class", "message-show bg-dblue white");
  suc.setAttribute("id", `success${Math.floor(Math.random())}`);
  suc.textContent = data;
  document.body.append(suc);
  setTimeout(() => {
    document.body.removeChild(suc);
  }, 2000);
}

function filereadscript(data) {
  if (data.files && data.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document
        .getElementsByClassName("preview-img")[0]
        .setAttribute("src", e.target.result);
    };
  }
  reader.readAsDataURL(data.files[0]);
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

function loadcategory() {
  fetch("/allcategories")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      allcategorydata = data;
      loadcategoryOptions(data);
      loadsubcategoryOptions(data);
      loadcatandsubcatforproduct();
      console.log(data);
    });
}
loadcategory();





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
  .getElementById("upload-product")
  .addEventListener("submit", uploadproduct);
function uploadproduct(e) {
  e.preventDefault();
  console.log(e)
  var name = e.target[0].value;
  var price = e.target[1].value;
  var image = e.target[2].files[0];
  var category = e.target[3].value;
  var subcategory = e.target[4].value;
  var Description = e.target[5].value;
  var ingredients = e.target[6].value;
  var uses = e.target[7].value;
  const formdata = new FormData();
  formdata.append("product-image", image);

  var confirmit = confirm("Add this product");
  if (confirmit === true) {
    var urll = `/upload/product?name=${name}&price=${price}&category=${category}&subcategory=${subcategory}&Description=${Description}&ingredients=${ingredients}&uses=${uses}`;
                
    fetch(urll, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: formdata,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.status === 208) {
          alert(data.message);
        } else {
          success(data.message);
          loadcategory();
          e.target[0].value = "";
        }
      })
      .catch((err) => console.error(err));
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
          alert(data.message);
        } else {
          success(data.message);
          loadcategory();
          e.target[0].value = "";
        }
      })
      .catch((err) => console.error(err));
  }
}

document
  .getElementById("new-subcategory")
  .addEventListener("submit", addnewsubcategory);
function addnewsubcategory(e) {
  e.preventDefault();
  // console.log(e)
  var confirmit = confirm("Add this subcategory");
  if (confirmit === true) {
    fetch("/addsubcategory", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        category: e.target[0].value,
        subcategory: e.target[1].value,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.status === 208) {
          alert(data.message);
        } else {
          success(data.message);
          loadcategory();
          e.target[0].value = "";
        }
      })
      .catch((err) => console.error(err));
  }
}


document
  .getElementById("edit-category")
  .addEventListener("submit", editcategoryname);
function editcategoryname(e) {
  e.preventDefault();
  console.log(e)
  // console.log(e)
  if (e.target[0].value.toLowerCase() === e.target[1].value.toLowerCase()) {
    return
  } else {
    var confirmit = confirm("Change category name?");
    if (confirmit === true) {
      fetch("/editcategoryname", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          category: e.target[0].value.toLowerCase(),
          newcategory: e.target[1].value.toLowerCase(),
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.status === 208) {
            alert(data.message);
          } else {
            success(data.message);
            loadcategory();
            e.target[0].value = "";
          }
        })
        .catch((err) => console.error(err));
    }
  }
}

document
  .getElementById("edit-subcategory")
  .addEventListener("submit", editsubcategoryname);
function editsubcategoryname(e) {
  e.preventDefault();
  // console.log(e)
  if (e.target[1].value.toLowerCase() === e.target[2].value.toLowerCase()) {
    return;
  } else {
    var confirmit = confirm("Change subcategory name?");
    if (confirmit === true) {
      fetch("/editsubcategoryname", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          category: e.target[0].value.toLowerCase(),
          subcategory: e.target[1].value.toLowerCase(),
          newsubcategory: e.target[2].value.toLowerCase(),
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.status === 208) {
            alert(data.message);
          } else {
            success(data.message);
            loadcategory();
            e.target[0].value = "";
          }
        })
        .catch((err) => console.error(err));
    }
  }
}

document.getElementById("settions-form").addEventListener("submit", changepassword);

function changepassword(e) {
  e.preventDefault();
  var username = e.target[0].value;
  var newusername = e.target[1].value;
  var password = e.target[2].value;
  var newpassword = e.target[3].value;
  // console.log(username, newusername, password, newpassword)
  
   var confirmit = confirm("Change passowrd?");
   if (confirmit === true) {
     fetch("/passwordchange", {
       method: "POST",
       headers: { "content-type": "application/json" },
       body: JSON.stringify({
         username,newusername,password,newpassword
       })
     })
       .then((res) => {
         return res.json();
       })
       .then((data) => {
         if (data.status === 208) {
           alert(data.message);
         } else {
           success(data.message);
           e.target[0].value = "";
           e.target[1].value = "";
           e.target[2].value = "";
           e.target[3].value = "";
         }
       })
       .catch((err) => console.error(err));
   }
}

function logout() {
  fetch("/logout", {
    method: "POST",
    headers: { "content-type": "application/json" }
  }).then((res) => { return res.json() }).then((data) => {
    if (data.status === 200) {
      window.location.href = data.redirect;
    }
  });
};

// toogle
if (window.location.href.includes("#")){
  if (window.location.href.split("#")[1] === "request") {
    fetchOrder("recent");
  }
} else {
    window.location.href = window.location.href + "#request";
}


