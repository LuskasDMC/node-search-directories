import axios from 'axios';
import fs from 'fs'
import readline from 'readline'

const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var successURL = []

reader.question("What's the URL? ", function(URL) {
    reader.question("Wordlist path? " ,(wordlist) => {
        const file = fs.readFileSync(wordlist, {encoding:'utf8'})
        const pathsList = file.split('\n')
        
        pathsList.forEach(async path => {
            try {
                const response 
                    = await axios.get(`${URL}${path}`,{validateStatus: (status) => status < 600 && status > 199})
        
                console.log(`${URL}${path} -> `, response.status)          
                if (response.status >= 200 || response.status <= 300) {
                    successURL.push(`${URL}${path}\n`)
                } 
            } catch(err) {
                console.error(err.response)
            }
        })

        reader.close();
    })
});
reader.addListener('close', () => fs.writeFileSync('./output.txt', successURL.join('')))

