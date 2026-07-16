import proxy from  "express-http-proxy";

const proxyWithHeader = (serviceUrl) =>
{
   return proxy(serviceUrl,{
    proxyReqOptDecorator : (proxyReqOpts,req) => {

      if(req.user)
      {
               proxyReqOpts : headers["x-user-id"] = req.user.userId;

      }

    }
   });

}

export default proxyWithHeader;