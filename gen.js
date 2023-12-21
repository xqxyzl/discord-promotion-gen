
    const fetch = require('node-fetch'); //npm i node-fetch@1.1.0
    const fs = require('fs');

    const baseUrl = "https://discord.com/billing/partner-promotions/1180231712274387115/";
    const outputFile = 'code.txt';

    let codes = 0;
    const pause40 = 10 * 1000;
    const pause100 = 30 * 1000;
    const pause429 = 60 * 1000;

    let interval;

    function req() {
       if (codes === 40) {
          clearInterval(interval);
          console.log("40 codes générés. Pause de 10 secondes... - ex#1337");
          setTimeout(() => {
             console.log("Reprise de la génération de codes... - ex#1337");
             interval = setInterval(req, 1000);
             codes = 0;
          }, pause40);
          return;
       }

       if (codes >= 100) {
          clearInterval(interval);
          console.log("100 codes générés. Pause de 30 secondes... - ex#1337");
          setTimeout(() => {
             console.log("Reprise de la génération de codes... - ex#1337");
             interval = setInterval(req, 1000);
             codes = 0;
          }, pause100);
          return;
       }

       fetch("https://api.discord.gx.games/v1/direct-fulfillment", {
             method: "POST",
             headers: {
                "accept": "*/*",
                "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json",
                "sec-ch-ua": "\"Opera GX\";v=\"105\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "Referer": "https://www.opera.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
             },
             body: JSON.stringify({
                partnerUserId: "05500ab64b9b7e718118bfc3701d23cdaa1c89d1af879e4a1e86810b6dc414bf"
             })
          })
          .then(response => {
             if (response.status === 429) {
                throw new Error("Limitation - Statut : 429 - ex#1337");
             }
             if (!response.ok) {
                throw new Error(`Erreur HTTP ! Statut : ${response.status} - ex#1337`);
             }
             return response.json();
          })
          .then(data => {
             const link = `${baseUrl}${data.token}`;
             fs.appendFileSync(outputFile, link + '\n');
             console.log(`[+] - ${baseUrl}${data.token}`);
             codes++;
          })
          .catch(error => {
             console.error("Erreur :", error);
             clearInterval(interval);
             if (error.message === "Limitation - Statut : 429 - ex#1337") {
                setTimeout(() => {
                   console.log("Reprise de la génération de codes... - ex#1337");
                   interval = setInterval(req, 1000);
                }, pause429);
             }
          });
    }

    interval = setInterval(req, 1000);
