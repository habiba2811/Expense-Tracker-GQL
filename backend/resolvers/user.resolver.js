import {users} from '../dummyData/data.js';
import User from '../models/user.model.js';
import bcrybt from 'bcryptjs';


const userResolver ={
    Mutation:{
        signUp: async (_,{input},context) =>{
            try {
                const {username,name,password,gender} = input;   
                if(!username || !name || !password || !gender){
                    throw new Error ("All fields are required");
                }
              const exisitngUser = await User.findOne({username});
              if (exisitngUser){
                throw new Error ("User already exists");
              }
              const salt = await bcrybt.genSalt(10);
              const hashedPassword = await bcrybt.hash(password, salt);

              const boyProfilePic =`https://avatar.iran.liara.run/public/boy?username=${username}`;
              const girlProfilePic =`https://avatar.iran.liara.run/public/girl?username=${username}`;

              const newUser =new User({
                username,
                name,
                password:hashedPassword,
                gender,
                profilePicture: gender === "girl"? girlProfilePic: boyProfilePic,
              })
              await newUser.save();
              await context.login(newUser);
              return newUser;

            } catch (err) {
                console.error("Error in signup: ",err);
                throw new Error (err.message || "Internal server error")
            }
        },
        login: async(_,{input},context) => {
            try {
                const  {username,password} = input;
                const {user} = await context.authentication("graphql-local",{username,password})

                await context.login(user);
                return user
            } catch (err) {
                console.error("Error in login: ",err);
                throw new Error (err.message || "Internal server error")
            }

        },
        logout: async(_,__,context) => {
            try {
                await context.logout();
                req.session.destroy((err) => {
                    if (err) throw err;
                })
                res.clearCookie("connect.sid");
                return {message:"looged out successfully" };

            } catch (err) {
                console.error("Error in logout: ",err);
                throw new Error (err.message || "Internal server error")
            }
        }

    },
    Query:{
        authUser: async(_,__,context)  =>{
            try {
                const user = await context.getUser();
                return user;
            } catch (err) {
                console.error("Error in authUser: ",err);
                throw new Error (err.message || "Internal server error")
            }
        },  
        user: async(_,{userId}) =>{
           try {
              const user = await User.findById(userId);
              return user;
           } catch (err) {
            console.error("Error in user query: ",err);
                throw new Error (err.message || "error getting user")
           }
           
        }
    },

    //TODO => ADD USER/TRANSATION RELATION
};

export default userResolver;