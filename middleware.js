const jwt = require('jsonwebtoken');
const keyFile = require('./secret.key');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(" ")[1];
    
    if (!token) {
        return res.status(403).json({ error: 'Token is missing' });
    }
    
    jwt.verify(token, keyFile.securekey, (err, decodedUser) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        if (decodedUser.userRole === 'employee') {
            //Employees can perform any action, no need for additional checks
            return next(); // Proceed to the next middleware or route handler
        }if(decodedUser.userRole==='driver'){
            // drivers can access their cars and their data only
            if (req.baseUrl === '/api/persons' || req.baseUrl === '/api/drivers'){
                if(req.method === 'POST'){
                    return res.status(403).json({ error: 'Access denied for this route' });
                } else if(req.method === 'GET'){
                    if(req.params.id && decodedUser.id==req.params.id){
                        return next();
                    } else if(req.params.name && decodedUser.username==req.params.name){
                        return next();
                    } else if(req.params.idcard && decodedUser.idCard==req.params.idcard){
                        return next();
                    } else if(req.params.dl && decodedUser.licence==req.params.dl){
                        return next();
                    } else {
                        return res.status(403).json({ error: 'Access denied for this route' });
                    }
                } else if(req.method === 'PUT' || req.method === 'DELETE'){
                    if(req.params.id && decodedUser.id==req.params.id){
                        return next();
                    }
                }
            } else if(req.baseUrl === '/api/cars'){
                if(req.method === 'POST'){
                    if(decodedUser.licence==req.body.ownerDL){
                        return next();
                    }
                } else if(req.method === 'GET'){
                    if(req.params.dl && decodedUser.licence==req.params.dl){
                        return next();
                    }
                }
            }
        }
        return res.status(403).json({ error: 'Access denied for this route' });
    });
};

module.exports = verifyToken;