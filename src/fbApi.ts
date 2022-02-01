const parser = require("node-html-parser")
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const https = require('https')

interface Birthday {
    name: string,
    age: string,
    occupation: string,
    link: string
}

async function getBirthdays (url: string): Promise<Birthday[]> {
    return new Promise<Birthday[]>(resolve => {
        https.get(url, (res) => {
            let rawData = ""
            res.on("data", (chunk) => rawData += chunk)
            res.on("end", () => {
                let data = parser.parse(rawData)
                let g = data.querySelectorAll('.info')
                var v: Birthday[] = []
                let xx = 15
                for (let i = 0; i < g.length && i < xx; i++) {
                    let dv = g[i].querySelector('.name').childNodes[0].rawText
                    if (!dv) continue
                    dv = dv.replace(/\n/gi, "")
                    let [name, age] = dv.split(', ')
                    if (!g[i].querySelector('.title')) {
                        xx++
                        continue
                    }
                    let occ = g[i].querySelector('.title').childNodes[0].rawText
                    if (!occ || !dv || !name) continue
                    let z: Birthday = {
                        name: name,
                        age: age,
                        occupation: occ.replace('&amp;', '&'),
                        link: g[i].parentNode.rawAttrs.split(' ')[0].replace(/("|=)/g, '').replace('href', '')
                    }
                    v.push(z)
                }
                resolve(v)
            })
        })
    })
}

export function famousBirthdays (date = new Date()): Promise<Birthday[]> {
    if (!(date instanceof Date)) throw new Error("Expected Date but found " + typeof date)
    return new Promise(async function (resolve) {
        let day: string
        if (date.toString().split(' ')[2].toString()[0] == "0") {
            day = date.toString().split(' ')[2].toString()[1]
        } else {
            day = date.toString().split(' ')[2]
        }
        var response = await getBirthdays(
            `https://www.famousbirthdays.com/${monthNames[date.getMonth()].toLowerCase()}${day}.html`
        )
        resolve(response)
    })
}