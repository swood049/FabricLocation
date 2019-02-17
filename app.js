var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");


//So we want to create RESTful routes
//First step will need to be to set up mongoose, and the mongoose schema.
//setting up mongoose and EJS
mongoose.connect('mongodb://localhost/data');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', "ejs");
app.use(methodOverride("_method"));

//Now for the SCHEMA SETUP
var fabricSchema = mongoose.Schema({
    name:{type:String, default: "lorem Title Ipsem dolor" },
    price:{type:Number, default:0 },
    image: {type:String, default: "https://cdn.pixabay.com/photo/2018/10/28/16/11/landscape-3779159__340.jpg"},
    description: {type:String, default: "lorem ipsem dolor contisous ifem gloriams soladini glorificamous gynous exim alofe hidos"},
    quantity: {type:Number, default: 0},
    meta:{
        rank: {type:Number, default: 0},
        favorite: {type:Number, default: 0},
        tags:[{type:String, default: "Fabric"}],
        categories : [{type:String, default:"All"}]
    },
    date: {type: Date, default: Date.now},
    hidden: {type:Boolean, default:true}
});

var FabricItem = mongoose.model("FabricItem", fabricSchema);

//testing the database connection... It works!!!
/*FabricItem.create({
    name:"test item",
    description: "this item is for testing purposes",
    quantity:2
})*/
//Now for the RESTful routes for Fabric. There are 7 of them.
// 1. Index, the RESTful Route. HTTP Verb: GET
// lists all of the different options of the fabrics
app.get("/", function(req, res){
    res.redirect("/FabricStore");
});
app.get("/FabricStore", function(req, res){
    FabricItem.find({}, function(err, FabricItems){
        if(err){
            console.log("There was an error");
            console.log(err);
        }else{
            res.render("index", {FabricItems:FabricItems});
        }
    });
});

// 2. New, the RESTful Route. HTTP Verb: GET 
//show form for user to make changes to database.
app.get("/FabricStore/new",function(req, res){
   res.render("new"); 
});

// 3. Create, the RESTful Route. HTTP Verb: POST
app.post("/FabricStore", function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var quantity = req.body.quantity;
    var meta = {
        tags:[req.body.tagOne, req.body.tagTwo, req.body.tagThree],
        categories: [req.body.categoryOne, req.body.categoryTwo, req.body.categoryThree]
    }
    var newFabric = {
        name: name,
        price: price,
        image:image, 
        description:description, 
        quantity:quantity,
        meta:meta
    }

    //actually creating the fabric instance
    FabricItem.create(newFabric, function(err, fabrics){
        if(err){
            console.log(err);
        }else{
            res.redirect("/FabricStore");
        }
    });

});

// 4. Show, the RESTful Route. HTTP Verb: GET
//this displays more information about the specific product, and allows the person to purchase the product
app.get("/FabricStore/:_id", function(req, res){
    FabricItem.findById(req.params._id, function(err, foundItem){
        if(err){
            console.log(err);
        }else{
            res.render("productview", {foundItem:foundItem})
        }
    })
})
// 5. Edit, the RESTful Route. HTTP Verb: GET
//to display the current settings of a specific product, and then offering forums to change things

app.get("/FabricStore/:_id/edit", function(req,res){
   FabricItem.findById(req.params._id, function(err, foundItem){
      if(err){
          console.log(err);
      } else{
          res.render("productedit", {foundItem:foundItem});
      }
   }); 
});

// 6. Update, the RESTful Route. HTTP Verb: PUT
// at the edit page, someone will submit a form with the ability to change the product details
app.put("/FabricStore/:_id", function(req, res){
    FabricItem.findByIdAndUpdate(req.params._id, req.body.image, function(err, updatedItem){
        if(err){
            console.log(err);
            res.redirect("/FabricStore")
        }else{
            res.redirect("/FabricStore/"+req.params._id);
            
        }
    })
});

// 7. Destroy, the RESTful Route. HTTP Verb: DELETE
app.delete("/FabricStore/:_id", function(req, res){
    //delete the item
    FabricItem.findByIdAndRemove(req.params._id, function(err){
        if(err){
            console.log(err);
            res.redirect("/FabricStore");
        }else{
            res.redirect("/FabricStore");
        }
    })
    
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Congrats! the Quilted Twins Clone Website started!!!");
});