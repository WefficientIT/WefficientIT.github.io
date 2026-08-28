(
    function changeDate() {
        dateActuelle = new Date();
        year = dateActuelle.getFullYear();
        month = dateActuelle.getMonth() +1;     // +1 car janvier=0
        nextMonth = (month+1)%12
        nextMonth = nextMonth == 0 ? 1:nextMonth
        nextMonth = nextMonth.toString().length == 2 ? nextMonth.toString():"0"+nextMonth.toString();
        month = month.toString().length == 2 ? month.toString():"0"+month.toString();
        day = dateActuelle.getDate();
        day = day.toString().length == 2 ? day.toString():"0"+day.toString();

        document.getElementById("doc-title-band__num").innerHTML = "WefficientIT-devis-"+year+month+day;
        document.getElementById("dateEmission").innerHTML = day+"/"+month+"/"+year;
        document.getElementById("dateValidite").innerHTML = day+"/"+nextMonth+"/"+year;
    }
)();

function remplirDevis(solution, modules) {
    dataSol = data.get(solution);
    let montant = 0;

    document.getElementById("objet").innerHTML = dataTitle[solution];

    table = document.getElementById("tableDevis");
    for (let i=0; i<modules.length; i++) {
        if (dataSol.has(modules[i])) {
            price = dataSol.get(modules[i])["price"];
            montant += price
            // affichage
            table.innerHTML += `
          <td>
            <strong>${dataSol.get(modules[i])["name"]}</strong>
            <div class="td-desc">${dataSol.get(modules[i])["description"]}</div>
          </td>
          <td><div class="td-desc">${dataSol.get(modules[i])["forfait"]}</div></td>
          <td class="td-qty">1</td>
          <td class="td-pu">${price},00 €</td>
          <td class="td-total" data-total>${price},00 €</td>`;
        }
    };

    table.innerHTML += `<tr>
          <td>
            <strong>Documentation complète</strong>
            <div class="td-desc">Documentation utilisateur, administrateur et technique. Schéma d'architecture. Livrée en Markdown et PDF.</div>
          </td>
          <td><div class="td-desc">Inclus au forfait</div></td>
          <td class="td-qty">1</td>
          <td class="td-pu">0,00 €</td>
          <td class="td-total" data-total>0,00 €</td>
        </tr>`;
}


(
    function getDevisFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        solution = urlParams.get("solution");
        modules = urlParams.get("modules").split(",");
        remplirDevis(solution,modules);
    }
)();