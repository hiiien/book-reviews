import express from "express";
import * as User from "../models/usersModel.js"

export const deleteUser = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        if(!user_id){
            res.status(500).json({message: "User ID could not be found in request"});
        }
        const success = User.DeleteUser(user_id);
        if(!success){
            res.status(500).json({message: "Error deleting User at this time try again later"});
        }
        res.status(200).json({message: "User successfully deleted"});
    } catch (error) {
        
    }
}