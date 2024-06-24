const express = require("express");
const User = require("../models/user.js");
const { authenticateToken } = require("./userAuth.js");
const router = express.Router();

//put book to cart

router.put("/add-to-cart",authenticateToken, async(req,res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isBookinCart = userData.cart.includes(bookid);
        if(isBookinCart){
            return res.json({
                status: "success",
                message: "book already added to cart",
            });
        }
        await User.findByIdAndUpdate(id, {
            $push: { cart: bookid },
        });

        return res.json({
            status: "success",
            message: "book added to cart successfully",
        });

    } catch (error) {
        return res.status(500).json({message: "an error occurred"});
    }
});


//remove book 
router.put("/remove-from-cart/:bookid",authenticateToken, async(req,res) => {
    try {
        const { bookid } = req.params;
        const { id } = req.headers;
        await User.findByIdAndUpdate(id, {
            $pull: { cart: bookid },
        });

        return res.json({
            status: "success",
            message: "book removed from cart",
        });

    } catch (error) {
        return res.status(500).json({message: "an error occurred"});
    }
});

//get cart of particular user
router.get("/get-user-cart",authenticateToken, async(req,res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate("cart");
        const cart = userData.cart.reverse();
        
        return res.json({
            status: "success",
            data: cart,
        });

    } catch (error) {
        return res.status(500).json({message: "an error occurred"});
    }
});



module.exports = router;