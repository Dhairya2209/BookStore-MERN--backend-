const express = require("express");
const User = require("../models/user.js");
const { authenticateToken } = require("./userAuth.js");
const router = express.Router();

//add book to favourite
router.put("/add-book-to-favourite", authenticateToken, async(req,res) => {
    try {
        const {bookid , id} = req.headers;
        const userData= await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);
        if(isBookFavourite){
            return res.status(200).json({message: "book already added to favourite"});
        }
        await User.findByIdAndUpdate(id,{ $push: { favourites: bookid}});
        res.status(200).json({message: "book added to favourite"});
    } catch (error) {
        res.status(500).json({message: "internal server error"});
    }
});


//delte from favourites
router.put("/remove-book-from-favourite", authenticateToken, async(req,res) => {
    try {
        const {bookid , id} = req.headers;
        const userData= await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);
        if(isBookFavourite){
            await User.findByIdAndUpdate(id,{ $pull: { favourites: bookid}});        
        }
        
        return res.status(200).json({message: "book removed from favourite"});
    } catch (error) {
        res.status(500).json({message: "internal server error"});
    }
});


//get favourite vooks of a particular user
router.get("/get-favourite-books",authenticateToken, async (req,res) => {
    try{
        const {id} = req.headers;
        const userData= await User.findById(id).populate("favourites");
        const favouriteBooks = userData.favourites;
        return res.json({
            status: "Success",
            data: favouriteBooks,
        });
    } catch(error){
        res.status(500).json({ message: "An error occured" });
    }
});




module.exports=  router;