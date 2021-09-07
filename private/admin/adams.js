var hhh;
var allcategorydata;
var ordertofetch = 1;

String.prototype.escape = function () {
  var tagtoreplace = {
    "&": "&amp;",
    "<": "&lt",
    ">": "&gt",
    "=": "",
    "(": "l",
    ")": "l",
    script: " ",
    Script: " ",
    '"': " ",
    "`": " ",
    ".": " ",
  };
  return this.replace(/[(.)&<>`=]/g, function (tag) {
    return tagtoreplace[tag] || tag;
  });
};

// toggle section
async function section(position) {
  var y = document.querySelectorAll(".dashb-sections");
  for (i = 0; i < y.length; i++) {
    y[i].classList.remove("active");
  }
  window.location.href = window.location.href.split("#")[0] + `#${position}`;
  for (j = 0; j < y.length; j++) {
    if (y[j].dataset.target === window.location.href.split("#")[1]) {
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
    fetchOrder("recent");
  } else {
    ordertofetch = 2;
    fetchOrder("recent");
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

function indicator(e,mark) {
  // marker.forEach((mark) => {
    mark.style.left = e.offsetLeft + "px";
    mark.style.width = e.offsetWidth + "px";
  // });
}
tabs.forEach((link) => {
  indicator(link.childNodes[1], link.children[2]);
});

// eventlistener for each span tab
tabs.forEach((link) => {
  link.childNodes.forEach((item) => {
    if (item.nodeName == "SPAN") {
      item.addEventListener("click", function (e) {
        indicator(e.target, link.children[2]);
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
// document
//   .getElementsByClassName("closeOverlay")[0]
//   .addEventListener("click", closeoverlay);

// ALL ORDERS

async function eachorder(data) {
  var allorder = "";
  data.map((order) => {
    var paid = (order)=> {
      if (order.paid === true) {
        return { status: "Paid", color: "green"}
      } else {
        return { status: "Pending Payment", color: "red" };
      }
    }
    var { status, color } = paid(order);
    allorder += `
        <div class="product" onclick="getorder('${order._id}')">
          <div class="product-head">
              <div>
                  <div class="">
                      <div><span>Name:</span> <span>${order.name.escape()}</span></div>
                      <div><span>Number:</span> <span>${order.number
                        .toString()
                        .escape()}</span></div>
                      <div ><span>Paid:</span> <span>${order.total}</span></div>
                      <div ><span>${order.date} ${order.time}</span></div>
                      <div class="b ${color}"> ${status}</div>
                  </div>
              </div>
              
          </div>
        </div>
        
      `;
  });
  document.getElementById("request-products").innerHTML = allorder;
}

// SINGLE ORDER
async function loadspecificorder(data) {
  showoverlay();

  var allproducts = "";
  data[0].products.map((product) => {
    allproducts += `
            <div class="prod">
                    <img loading="lazy" src="${product.image}" alt="">
                    <div class="grid">
                        <span class="b">${product.name.escape()}</span>
                        <span class="">${product.price
                          .toString()
                          .escape()}</span>
                        <span class="">Qty: ${product.incart}</span>
                    </div>
                </div>
        
        `;
  });
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
                <li class="b">Order Id: </li>
                <li> ${data[0]._id}</li>
                <li class="b">Name: </li>
                <li> ${data[0].customerDetails.name.escape()}</li>
                <li class="b"> Number:</li>
                <li>${data[0].customerDetails.number.toString().escape()}</li>
                <li class="b"> Address:</li>
                <li> ${data[0].customerDetails.address.escape()}</li>
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
  refillDiv.innerHTML = "";
  data.forEach((refil) => {
    refillDiv.innerHTML += `
<div class="refill">
  <img loading="lazy" src="${refil.image}" alt="">
  <div class="">
      <div class=""><span>Name:</span>${refil.name.escape()}</div>
      <div class=""><span>Number:</span>${refil.number
        .toString()
        .escape()}</div>
      <div class="">${refil.date} ${refil.time}</div>
      <div class="flex">
      <button class="bg-dblue" onclick="deliveredRefill('${
        refil._id
      }')">Delivered</button>
      <button class="bg-dgreen" ><a href="${
        refil.image
      }" class="white" download="${refil.image.split("?img=")[1]}">Download</a></button></div>
  </div>
</div>
`;
  });
}

Object.entries(document.getElementsByClassName("recent-delivered")).forEach(
  (ele) => {
    ele[1].addEventListener("click", (e) => {
      Object.entries(e.target.parentElement.children).forEach((child) => {
        child[1].style.boxShadow = "none";
      });
      e.target.style.boxShadow = "5px 5px 10px var(--dark-blue)";
    })
    
  }
);

// PRODUCT ACCORDION
function accordion() {
  var accordionHead = document.getElementsByClassName("accordion-head");
  Object.entries(accordionHead).forEach((accord) => {
    accord[1].addEventListener("click", showprodcat);
  });
  function showprodcat(e) {
    Object.entries(accordionHead).forEach((accord) => {
      accord[1].parentElement.classList.remove("active");
    });
    e.target.parentElement.classList.add("active");
  }
}

// to toggle between products by subcategory
function accordioncontent() {
  var accordionContent = document.getElementsByClassName("accordion-content");
  Object.entries(accordionContent).forEach((accord) => {
    Object.entries(accord[1].children[0].children).forEach((accordchild) => {
      accordchild[1].addEventListener("click", showprodsubcat);
    });
  });
  function showprodsubcat(e) {
    Object.entries(accordionContent).forEach((accord) => {
      Object.entries(accord[1].children[0].children).forEach((accordchild) => {
        accordchild[1].classList.remove("active");
      });
    });
    e.target.classList.add("active");
    fetchproductbasedonselectedsubcategory(
      e.target.parentElement.parentElement.parentElement.children[0].innerText,
      e.target.textContent
    );
  }
}

// LOAD PRODUCTS FOR A GIVEN CATEGORY AND SUB CATEGORY
function loadproducts(data) {
  var prodDiv = document.getElementsByClassName("products-product-left")[0];
  prodDiv.innerHTML = "";
  data.forEach((product) => {
    // console.log(product)
    prodDiv.innerHTML += `
      <div class="prod" onclick='editproduct(${JSON.stringify(product)})'>
        <img loading="lazy" src="${product.image}" alt="">
        <div class="">
            <ul>
                <li class="name">${product.name.escape()}</li>
                <li>${product.price.toString().escape().toLocaleString()}</li>
            </ul>
        </div>
    </div>
    `;
  });
}

// EDIT A SINGLE PRODUCT

function editproduct(data) {
  showoverlay();
  var OverlayCtn = document.getElementsByClassName("overlay-content")[0];
  OverlayCtn.innerHTML = "";
  // console.log(data);
  OverlayCtn.innerHTML = `
    <div class="single-product">
      <form action="" id="update-product" enctype="multipart/form-data" class="grid-2">
          <div class="single-left grid-1">
              <div class="ovy">
              <label for="product-name">Product Id</label>
              <input type="text" value="${data._id}" name="" id="product-Id" required readonly placeholder="${data._id}">

              <label for="product-name">Product name</label>
              <input type="text" value="${data.name}" name="" id="product-nameEdit" required placeholder="what is the product called">
          
              <label for="product-price">Price</label>
              <input type="number" value="${data.price}" name="price" id="product-priceEdit" required placeholder="5,000">
          
              <label for="categoryEdit">Category</label>
              <input type="text" value="${data.category}" name="categoryEdit" id="categoryEdit" readonly required>
              <label for="subcategoryEdit">SubCategory</label>
              <input type="text" value="${data.subcategory}" name="subcategoryEdit" id="subcategoryEdit" readonly required>
          
              <label for="product-description">Description</label>
              <textarea name="" id="product-description" cols="30" rows="5"  required placeholder="product Description">${data.description}</textarea>
          
              <label for="ingredientsEdit">Ingredients</label>
              <textarea name="" id="ingredientsEdit" cols="30"  rows="5" required placeholder="Ingredients">${data.ingredients}</textarea>
          
              <label for="usesEdit">Uses</label>
              <textarea name="" id="usesEdit" cols="30" rows="5"  required placeholder="Uses"> ${data.uses}</textarea>
                  
              <div class="grid-3">
                  <button  type="reset" class="closeOverlay border-btn" onclick="deleteProduct('${data.image}')">Delete Product</button>
                  <button type="reset" class="closeOverlay border-btn" onclick="closeoverlay()">Cancel</button>
                  <button type="submit">Save changes</button>
              </div>
              </div>
          </div>
          <div class="single-right">
              <div class="upload-preview">
                  <img src="${data.image}" alt="" class="single-imgPreview">
              </div>
              <label for="product-image">Product Image</label>
              <input type="file" name="product-image" id="product-imageEdit" oninput="filereadscript(this,'single-imgPreview')" placeholder="change image" required>

          </div>                    
      </form>
  </div>
  
  `;
  document.getElementById("update-product").addEventListener("submit", (e) => {
    e.preventDefault();
    updateProduct(e);
  });
}
function deleteProduct(id) {
  var t = confirm("Delete this product")
  if (t === true) {
     fetch("/deleteProduct", {
       method: "POST",
       headers: { "content-type": "application/json" },
       body: JSON.stringify({ id }),
     })
       .then((data) => {
         return data.json();
       })
       .then((data) => {
         if (data.status === 200) {
           success(data.message, "success");
           closeoverlay();
         } else {
           success(data.message, "error");
         }
       });
  }
}
function updateProduct(e) {
  // console.log(e);
  var _id = e.target[0].value;
  var name = e.target[1].value;
  var price = e.target[2].value;
  var category = e.target[3].value;
  var subcategory = e.target[4].value;
  var description = e.target[5].value;
  var ingredients = e.target[6].value;
  var uses = e.target[7].value;
  var image = e.target[11].files[0];

  var formd = new FormData();
  formd.append("Product-image", image);
  formd.append("_id", _id);
  formd.append("name", name);
  formd.append("price", price);
  formd.append("category", category);
  formd.append("subcategory", subcategory);
  formd.append("description", description);
  formd.append("ingredients", ingredients);
  formd.append("uses", uses);

  fetch(`/UpdateProduct?_id=${_id}&type=update`, {
    method: "POST",
    headers: { "conent-type": "file" },
    body: formd,
  })
    .then((res) => {
      return res.json();
    })
    .then(async (data) => {
      if (data.status === 200) {
        success(data.message, "success");
        closeoverlay();
      } else {
        success(data.message, "error");
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

// LOAD CATEGORY AND SUBCATEGORY OF PRODUCTS
function loadcatandsubcatforproduct() {
  var cat = document.getElementsByClassName("cat")[0];
  cat.innerHTML = "";
  allcategorydata[0].categories.forEach((category) => {
    var ul;
    ul = "";
    category.sub.forEach((subcat) => {
      ul += `<li>${subcat} </li>`;
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
        // console.log(category.name)
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
    if (data[0].categories[0].sub.length >= 0) {
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
  subcatdiv.innerHTML = "";
  allcategorydata[0].categories.forEach((category) => {
    if (category.name === cat.target.value) {
      category.sub.forEach((subcat) => {
        // console.log(subcat);
        subcatdiv.innerHTML += `<option value=${subcat}>${subcat}</option>`;
      });
    }
  });
}

function success(data, type) {
  var suc = document.createElement("div");
  if (type === "error") {
    suc.setAttribute("class", "message-show bg-red white");
  } else {
    suc.setAttribute("class", "message-show bg-dblue white");
  }
  suc.setAttribute("id", `success${Math.floor(Math.random())}`);
  suc.textContent = data;
  document.body.append(suc);
  setTimeout(() => {
    document.body.removeChild(suc);
  }, 2000);
}

function filereadscript(data, targetDiv) {
  if (data.files && data.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document
        .getElementsByClassName(targetDiv)[0]
        .setAttribute("src", e.target.result);
    };
  }
  reader.readAsDataURL(data.files[0]);
}

// CONTACT
function loadContact(data) {
  var contactDiv = document.getElementsByClassName("contactDiv")[0];
  contactDiv.innerHTML = "";
  data.forEach((contact) => {
    
    var cm = document.createElement("div");
    cm.setAttribute("class", "contact-message");
    var ul = document.createElement("ul");

    var li1 = document.createElement("li");
    li1.setAttribute("class", "flex");
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");
    span1.textContent = `${contact.time}`;
    span2.textContent = `${contact.date}`;
    li1.appendChild(span1);
    li1.appendChild(span2);
    //
    var li2 = document.createElement("li");
    var span3 = document.createElement("span");
    span3.setAttribute("class", "b");
    var span4 = document.createElement("span");
    span3.textContent = "Name:";
    span4.textContent = `${contact.name.escape()}`;
    li2.appendChild(span3);
    li2.appendChild(span4);
    //
    var li3 = document.createElement("li");
    var span5 = document.createElement("span");
    span5.setAttribute("class", "b");
    var span6 = document.createElement("span");
    span5.textContent = "Phone:";
    span6.textContent = `${contact.number.toString().escape()}`;
    li3.appendChild(span5);
    li3.appendChild(span6);
    //
    var li4 = document.createElement("li");
    li1.setAttribute("class", "contactmessage");
    var span7 = document.createElement("span");
    span7.setAttribute("class", "b");
    var span8 = document.createElement("span");
    span7.textContent = "Message:";
    span8.textContent = `${contact.message.escape()}`;
    li4.appendChild(span7);
    li4.appendChild(span8);

    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);
    ul.appendChild(li4);

    cm.appendChild(ul);

    contactDiv.appendChild(cm);
  });
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
  fetch(`/order?id=${id}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data)
      loadspecificorder(data);
    })
    .catch((err) => {
      console.error(err);
    });
}

function fetchOrder(type) {
  if (ordertofetch === 1) {
    getallorders(type);
  } else if (ordertofetch === 2) {
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
      if (data.status === 200) {
        allcategorydata = data.allcategory;
        loadcategoryOptions(data.allcategory);
        loadsubcategoryOptions(data.allcategory);
        loadcatandsubcatforproduct();
      } else {
        alert(data.message);
      }
    });
}
loadcategory();

function fetchproductbasedonselectedsubcategory(category, subcategory) {
  fetch(`/products/${category}/${subcategory}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.status === 200) {
        loadproducts(data.productstosend);
      } else {
        alert(data.message);
      }
      // console.log(data);
    });
}

document
  .getElementsByClassName("contactTab")[0]
  .addEventListener("click", getcontact);
function getcontact() {
  fetch("/allcontacts")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // console.log(data);
      loadContact(data.contact);
    });
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
    // console.log(id);
    fetch("/refill-delivered", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        alert(data.message);
        fetchOrder("delivered");
      })
      .catch((err) => console.error(err));
  }
}

document
  .getElementById("upload-product")
  .addEventListener("submit", uploadproduct);
function uploadproduct(e) {
  e.preventDefault();
  // console.log(e);
  var name = e.target[0].value;
  var price = e.target[1].value;
  var image = e.target[2].files[0];
  var category = e.target[3].value;
  var subcategory = e.target[4].value;
  var description = e.target[5].value;
  var ingredients = e.target[6].value;
  var uses = e.target[7].value;

  var confirmit = confirm("Add this product");
  if (confirmit === true) {
    var formd = new FormData();
    formd.append("Product-image", image);
    formd.append("name", name);
    formd.append("price", price);
    formd.append("category", category);
    formd.append("subcategory", subcategory);
    formd.append("description", description);
    formd.append("ingredients", ingredients);
    formd.append("uses", uses);

    fetch(`/upload/product?type=upload&name=${name}&category=${category}&subcategory=${subcategory}`, {
      method: "POST",
      headers: { "conent-type": "file" },
      body: formd,
    })
      .then((res) => {
        return res.json();
      })
      .then(async (data) => {
        if (data.status === 200) {
          success(data.message, "success");
          e.target[0].value="";
          e.target[1].value="";
          e.target[2].files[0]="";
          e.target[3].value="";
          e.target[4].value="";
          e.target[5].value="";
          e.target[6].value="";
          e.target[7].value="";
        } else {
          success(data.message, "error");
        }
      })
      .catch((err) => {
        console.error(err);
      });
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
          success(data.message,"success");
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
          success(data.message,"success");
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
  // console.log(e);
  // console.log(e)
  if (e.target[0].value.toLowerCase() === e.target[1].value.toLowerCase()) {
    return;
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
            success(data.message,"success");
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
            success(data.message, "success");
            loadcategory();
            e.target[0].value = "";
          }
        })
        .catch((err) => console.error(err));
    }
  }
}

document
  .getElementById("settions-form")
  .addEventListener("submit", changepassword);

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
        username,
        newusername,
        password,
        newpassword,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.status === 208) {
          alert(data.message);
        } else {
          success(data.message,"success");
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
    headers: { "content-type": "application/json" },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.status === 200) {
        window.location.href = data.redirect;
      }
    });
}

// toogle
if (window.location.href.includes("#")) {
  if (window.location.href.split("#")[1] === "request") {
    fetchOrder("recent");
  } else if (window.location.href.split("#")[1] === "contact") {
    getcontact();
  }
} else {
  window.location.href = window.location.href + "#request";
}
