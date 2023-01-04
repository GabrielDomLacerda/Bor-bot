const fs = require('fs');
const path = require('path')

module.exports = {
    importFeatures: async (dirName, action) => {
        const fullPath = path.join(__dirname, dirName);
        const files = fs.readdirSync(fullPath).filter((file) => file.endsWith('js'));
        
        files.forEach((file) => {
            const pathToFile = path.join(fullPath, file)
            const feature = require(pathToFile)
            action(feature, pathToFile)
        });
    }
}