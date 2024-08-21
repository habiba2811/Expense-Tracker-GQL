import Transaction from "../models/transaction.model.js"
import User from "../models/user.model.js";
const transactionResolver ={
    Query :{ 
     transactions: async (_,__,context) =>{
        try {
            if(!context.getUser()){
                throw new Error("Unathourized");        
            }
            const userId = await context.getUser()._id;
            const transactions = await Transaction.find({userId});
            return transactions;
            
        } catch (err) {
            console.error("Error getting Transactions:",err);
            throw new Error("Error getting Transactions");
      }
    },
    transaction : async(_,{transactionId},) =>{
        try {
            const transaction = await Transaction.findById(transactionId);
            return transaction
        } catch (err) {
            console.error("Error getting Transaction:",err);
            throw new Error("Error getting Transaction");
            
        }
    
    },
       categoryStatistics: async(_,__,context)=>{
        if(!context.getUser()) throw new Error("Unathorized")
            const userId = context.getUser()._id;
            const transactions = await Transaction.find({userId})
            const categoryMap ={};

            transactions.forEach((transaction) => {
                if(!categoryMap[transaction.category]){
                    categoryMap[transaction.category] =0;
                }
                categoryMap[transaction.category] += transaction.amount;
            })
            return Object.entries(categoryMap).map(([category,totalAmount]) =>({category,totalAmount}))
    }
},
    Mutation:{
        createTransaction: async(_,{input},context) =>{
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id
                })
                await newTransaction.save();
                return newTransaction
            } catch (err) {
                console.error("Error creating Transaction:",err);
                throw new Error("Error creating Transaction");
            }

        },
        updateTransaction: async(_,{input}) =>{
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId,input,{new:true});
                return updatedTransaction;
            } catch (error) {
                console.error("Error updating Transaction:",err);
                throw new Error("Error updating Transaction");
            }
        },
        deleteTransaction: async(_,{transactionId}) =>{
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            } catch (error) {
                console.error("Error deleting Transaction:",err);
                throw new Error("Error deleting Transaction");
            }
        },

    },
   Transaction:{
    user:async(parent) => {
      const userId=  parent.userId
      try {
         const user = await User.findById(userId);
         return user;
      } catch (err) {
        console.error("Error getting user:",err)
        throw new Error("Error getting user")
        
      }
    }
   }
}
export default transactionResolver;