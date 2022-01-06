const core = require("@actions/core");
const https = require("https");

const instance = core.getInput('zoftoken-instance');
const service = core.getInput('service');
const id = core.getInput('id');
const auth = core.getInput('auth-key');

const url = `${instance}/status?id=${id}&service=${service}&authKey=${auth}`;

try {
    https.get(url, (res) => {
    
        switch (res.statusCode) {
            case 400: core.setFailed("Invalid parameters received by the ZofToken instance."); break;
            case 403: core.setFailed("Invalid authentication key for the service/id combination."); break;
            case 404: core.setFailed("Token or service not found."); break;
            case 500: core.setFailed("Internal (possibly transient) error in the ZofToken instance."); break;
            default: {
                
                let body = "";
        
                res.on('data', (data) => { body += data; });
        
                res.on('end', () => {
    
                    try {
                        const response = JSON.parse(body);
                        
                        switch (response.status) {
                            case 0: core.setFailed("Token is not enrolled."); break;
                            case 2: core.setFailed("Token is closed."); break;
                            case 3: core.setFailed("Token is under duress."); break;
                            case 4: core.setFailed("Token is blocked."); break;
                            case 1: console.log("Token is open - check succeeded."); break;
                            default: core.setFailed("Error processing the server response (possibly not connected to a ZofToken instance)."); break;
                        }
                    } 
                    catch {
                        core.setFailed("Error processing the server response (possibly not connected to a ZofToken instance).");
                    }
                });
            }
        }
    }).on("error", (e) => {
        core.setFailed(`Network error: ${e.message}`);
    });
}
catch (e) {
    core.setFailed(e.message);
}