import Conversation from "../Models/conversation.model.js";
import Message from "../Models/message.model.js";

 
// IN MONGO DB FIND() RETUNRS AN ARRAY  and FINDONE REUTNS AN OBJECT

export const createConversation = async (req, res) =>
{

   try{
     const userId= req.headers["x-user-id"];
     console.log(userId);

     const conversation = await Conversation.create({
      userId:userId
     });
     return res.status(200).json(conversation);
   }catch(err)
   {
     return res.status(500).json({"Message" : `${err}`});
     
   }

};

export const getConversations = async (req, res) =>
{

   try{
     const userId= req.headers["x-user-id"];
     console.log(userId);

     const conversations = await Conversation.find({
      userId:userId
     }).sort({updatedAt:-1});  

     return res.status(200).json(conversations);
   }catch(err)
   {
     return res.status(500).json({"Message" : `${err}`});
     
   }

};

export const saveMessage = async (req,res) =>
{
   try{
     const {conversationId, role, content } = req.body;
   
      const  message = await Message.create({
        conversationId,
        role,
        content
      });

      return res.status(200).json(message);

   }catch(err){

   return res.status(500).json({"message" : `${err}`});

   }
};

export const getMessage = async (req,res) =>
{
   try{
  
   
       const  message = await Message.find({
        conversationId: req.params.conversationId
      });

      return res.status(200).json(message);

   }catch(err){

   return res.status(500).json({"message" : `${err}`});

   }
}

export const updateConversation = async (req, res) =>
{

   try{
     const {id,title} = req.body;


     const conversation = await Conversation.findByIdAndUpdate(id,{title
     });  

     return res.status(200).json(conversation);

   }catch(err)
   {
     return res.status(500).json({"Message" : `${err}`});
     
   }

};
