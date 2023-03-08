const admin = require ("../config/firebasa-config");

class Middleware {
    async decodeTokens(req,res,next){          
        try{
            const token = req.headers.authorization.split(' ')[1];
            const decodeValue =admin.auth().verifyIdToken(token);
            if (decodeValue){
                return next();
            }
            return res.json({message :"Sin Autorización"})
        }catch(e){
            return res.json({message :"Internal Error: " + e})
        }
    }
}

module.exports =new Middleware();