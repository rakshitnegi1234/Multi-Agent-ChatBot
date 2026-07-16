import api from "../../Utils/axios";

const getCurrentUser = async () =>
{
   try{
    const {data} = await api.get("/api/v1/youridentity");
    
    return data; 
    
   }catch(err){

     return null;
   }
}

export default getCurrentUser;