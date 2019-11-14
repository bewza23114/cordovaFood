//Initial Firebase
var firebaseConfig = {
  apiKey: "AIzaSyBcdnhWfoAEFIBBa3k6xoJ03dJBTD8jdPc",
  authDomain: "food247-4a7d1.firebaseapp.com",
  databaseURL: "https://food247-4a7d1.firebaseio.com",
  projectId: "food247-4a7d1",
  storageBucket: "food247-4a7d1.appspot.com",
  messagingSenderId: "295030401649",
  appId: "1:295030401649:web:a71eb0eae853c5235b09d0"
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

// Monitor authen status
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var email = user.email;
    console.log(email + " signed in");
    $("#loginbtn").hide();
    $("#logoutbtn").show();
  } else {
    localStorage.clear();
    console.log("Clear!!!!!!!!");
    console.log("signed out");
    $("#loginbtn").show();
    $("#logoutbtn").hide();
  }
});

document.addEventListener('init', function (event) {
  var page = event.target;

  var provider = new firebase.auth.GoogleAuthProvider();

  $("#googlebtn").click(function () {
    firebase.auth().signInWithPopup(provider).then(function (result) {
      var token = result.credential.accessToken;
      var user = result.user;
      $("#content")[0].load("foodcategory.html");
      // ...
    }).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      // ...
    });
  })

  if (page.id === 'foodcategoryPage') {
    console.log("foodcategoryPage");

    $("#menubtn").click(function () {
      console.log("click menubtn")
      $("#sidemenu")[0].open();
    });

    db.collection("recommended").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {

        var item = `<ons-carousel-item modifier="nodivider" onclick="gomenu('${doc.data().restaurant_id}');" class="recomended_item">
        <div class="thumbnail" style="background-image: url('${doc.data().picture}'); margin-top:10px;">
        <div style="margin-left: 84%; width:16%; border-radius: 4px; margin-bottom:5px; background-color: rgb(241, 137, 40);">
            <ons-icon size="15px" style="color: rgb(255, 255, 255);" icon="fa-star"><span
                    style="color:white; padding-left:5px">${doc.data().rating}</span>
            </ons-icon>
        </div>
        </div>
        <div style="background-color:rgba(117, 122, 128, 0.938);" class="recomended_item_title" id="item1_name""><span style="color: white">${doc.data().name}</span></div>
        </ons-carousel-item>`;

        $("#carousel").append(item);
      });
    });
    $("#fastfoodbtn").click(function () {
      console.log("click fastfoodbtn");
      setcategory("fastfood");
    });
    $("#steakbtn").click(function () {
      console.log("click steakbtn");
      setcategory("steak");
    });
    $("#thaifoodbtn").click(function () {
      console.log("click thaifoodbtn");
      setcategory("thaifood");
    });
    $("#noodlebtn").click(function () {
      console.log("click noodlebtn");
      setcategory("noodle");
    });
    $("#drinkbtn").click(function () {
      console.log("click drinkbtn");
      setcategory("drink");
    });
    $("#dessertbtn").click(function () {
      console.log("click dessertbtn");
      setcategory("dessert");
    });
  }

  if (page.id === 'restaurantlistPage') {
    db.collection("restaurant").where("type", "==", localStorage.getItem("curr_type")).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var item = `<ons-card style="padding-top:10px">
    <div
        style="background-size: 330px auto; background-repeat: no-repeat; background-position: center; height:100px;
        background-image:url('${doc.data().picture}');">
        <div style="margin-left: 84%; width:16%; border-radius: 4px; margin-bottom:5px; background-color: rgb(241, 137, 40);">
            <ons-icon size="15px" style="color: rgb(255, 255, 255);" icon="fa-star"><span
                    style="color:white; padding-left:5px">${doc.data().rating}</span>
            </ons-icon>
        </div>
    </div>
    <ons-row>
        <ons-col style="padding-left: 7px">
            <div style="font-size: 18px; padding-top:7px; font-weight: bold;">${doc.data().name}</div>
            <div style="font-size: 15px">Distance : ${doc.data().distance} km / ${doc.data().time} min<span style="padding-left:18px; font-size: 17px;
             color: rgb(17, 180, 58)">${doc.data().status}</span></div>
        </ons-col>
        <ons-col width=18%>
            <div onclick="gomenu('${doc.id}');" class="btncard">Go<ons-icon size="13px"
                    style="padding-left:1px" icon="fa-chevron-right"></ons-icon>
            </div>
        </ons-col>
    </ons-row>
</ons-card>`;

        $("#listrestaurant").append(item);
      });
    });

    console.log("restaurantlistPage");
    $("#backbtn").click(function () {
      console.log("click backbtn RT")
      $("#content")[0].load("foodcategory.html");
    });
    $("#gobtn").click(function () {
      console.log("click gobtn")
      $("#content")[0].load("restaurantmenu.html");
    });
  }

  if (page.id === 'restaurantmenuPage') {

    var valueid = localStorage.getItem("curr_restid");

    var docRef = db.collection("restaurant").doc(valueid);

    docRef.get().then(function (doc) {
      var name = doc.data().name;
      var distance = doc.data().distance;
      var time = doc.data().time;
      var rating = doc.data().rating;
      var picture = doc.data().picture;
      var status = doc.data().status;
      var menu = doc.data().menu;

      $("#name").text(name)
      $("#distance").text(distance)
      $("#time").text(time)
      $("#rating").text(rating)
      $("#picture").css("background-image", "url('" + picture + "')");
      $("#status").text(status)
      $("#listmenu").empty()
      menu.forEach(element => {
        var item = `<ons-list-item style="background-color: rgb(230, 230, 230, 0.93);">
        <div class="left">${element.name}</div>
        <div class="right"><span id="amountmenu"></span><span>${element.price}฿&nbsp&nbsp</span><ons-button style="background-color:black" onclick="addorder(${element.price},'${element.name}')">
        <ons-icon icon="fa-plus"></ons-icon></ons-button></div>
        </ons-list-item>`
        $("#listmenu").append(item);
        console.log("name:", element.name, ",price:", element.price);
      });

    }).catch(function (error) {
      console.log("Error getting cached document:", error);
    });

    console.log("restaurantlistPage");
    $("#backbtn").click(function () {
      localStorage.clear();
      console.log("Clear!!!!!!!!");
      console.log("click backbtn RM")
      $("#content")[0].load("foodcategory.html");
    });
    $("#orderbtn").click(function () {
      console.log("click orderbtn")
      $("#content")[0].load("orderconfirmation.html");
    });
  }
  if (page.id === 'orderconfirmationPage') {
    console.log("orderconfirmationPage");

    var order = JSON.parse(localStorage.getItem("order"));

    if (order !== null) {
      $("#order").empty();
      order.forEach(element => {
        var valueid = localStorage.getItem("curr_restid");

        var docRef = db.collection("restaurant").doc(valueid);

        docRef.get().then(function (doc) {
          var name = doc.data().name;
          $("#restaurantname").text(name + " Restaurant");
        });
        var item = `<ons-row >
        <ons-col>
        <div style="text-align:left; padding-left:28px" class="order">
        ${element.amount}
        </div>
        </ons-col>
        <ons-col width="60%">
        <div class="order">
        ${element.name}
        </div>
        </ons-col>
        <ons-col>
        <div style="text-align:right; padding-right:13px" class="order">
        ${element.price * element.amount}
        </div>
        </ons-col>
        </ons-row>`


        $("#order").append(item);
      });
      $("#total").text(JSON.parse(localStorage.getItem("total")));
    }

    var user = firebase.auth().currentUser;

    if (user) {
      $("#creditcard").click(function () {
        console.log("pay as credit");
        localStorage.clear();
        console.log("Clear!!!!!!!!");
        $("#content")[0].load("foodcategory.html");
      });
    } else {
      $("#content")[0].load("login.html");
    }

    $("#backbtn").click(function () {
      console.log("click backbtn OC")
      $("#content")[0].load("restaurantmenu.html");
    });
  }

  if (page.id === 'menuPage') {
    console.log("menuPage");

    $("#login").click(function () {
      $("#content")[0].load("login.html");
      $("#sidemenu")[0].close();
    });

    $("#logout").click(function () {
      firebase.auth().signOut().then(function () {
        localStorage.clear();
        console.log("Clear!!!!!!!!");
        $("#content")[0].load("foodcategory.html");
        $("#sidemenu")[0].close();
      }).catch(function (error) {
        console.log(error.message);
      });
    });

    $("#home").click(function () {
      $("#content")[0].load("foodcategory.html");
      $("#sidemenu")[0].close();
    });
  }

  if (page.id === 'loginPage') {
    console.log("loginPage");

    $("#signinbtn").click(function () {
      var username = $("#username").val();
      var password = $("#password").val();
      firebase.auth().signInWithEmailAndPassword(username, password).then(function () {
        $("#content")[0].load("foodcategory.html");
        $("#sidemenu")[0].close();
      }).catch(function (error) {
        console.log(error.message);
      });
    });
    $("#createaccountbtn").click(function () {
      console.log("click create account btn");
      $("#content")[0].load("register.html");
    });
    $("#backhomebtn").click(function () {
      $("#content")[0].load("foodcategory.html");
    });
  }
  if (page.id === 'registerPage') {
    $("#backhomebtn").click(function () {
      $("#content")[0].load("foodcategory.html");
    });
  }
  $("#registerbtn").click(function () {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var fullname = document.getElementById('fullname').value;
    var phonenumber = document.getElementById("phonenumber");
    var RE = /^[\d\.\-]+$/;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (error) {
      $("#content")[0].load("foodcategory.html");

    }).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode === 'auth/weak-password') {
        alert('The password is too weak');
      }
      if (fullname.val == null) {
        alert("You have entered your name");
        return false;
      }
      else {
        alert(errorMessage);
      }
      if (!RE.test(phonenumber.value)) {
        alert("You have entered an invalid phone number");
        return false;
      }
      else {
        alert(errorMessage);
      }
      console.log(error);
    });
  });

});

function gomenu(id) {
  localStorage.setItem("curr_restid", id);
  $("#content")[0].load("restaurantmenu.html");
}
function setcategory(type) {
  localStorage.setItem("curr_type", type);
  console.log("curr_type", localStorage.getItem("curr_type"));

  $("#content")[0].load("restaurantlist.html");
}
function addorder(price, name) {
  var user = firebase.auth().currentUser;

  if (user) {
    var myitems = [];
    if (localStorage.getItem("order") !== null) {
      myitems = JSON.parse(localStorage.getItem("order"));
    }
    var item = {
      price: price,
      name: name,
      amount: 1
    };

    console.log("myitem >", item);
    console.log("myitems>", myitems);
    console.log("myitems in localStorage >", localStorage.getItem("order"));

    var isExist = false
    myitems.forEach(element => {
      if (element.name === item.name) {
        element.amount++;
        isExist = true;
        console.log("got cha! name:", element.name, " amount:", element.amount);
      }
    });
    if (!isExist)
      myitems.push(item);

    var total = 0;
    var amountmenu = 0;
    var menuname;
    myitems.forEach(element => {
      amountmenu = element.amount;
      total += element.price * element.amount;
      menuname = element.name;
      console.log(element.name, " ==", element.price);
    });
    localStorage.setItem("order", JSON.stringify(myitems));

    localStorage.setItem("total", total);
    console.log("Total :", total);
    console.log("Amount :", amountmenu);
    console.log("Menu name:", menuname, "Amount:", amountmenu);

    $("#total").text(total);
  } else {
    $("#content")[0].load("login.html");
  }
}