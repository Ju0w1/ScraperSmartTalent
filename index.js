import puppeteer from "puppeteer";

async function accessLink(){

    const browser = await puppeteer.launch({
        headless: true
    })
    const page = await browser.newPage()

    // Acceder a la web para obtener el link a Oportunidades Laborales
    await page.goto('https://www.smarttalent.uy/')

    // Obtener link
    const hrefElement = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const link = links.find(a => a.textContent.includes('Oportunidades Laborales'));
        return link ? link.href : null;
    });

    // Acceder a oportunidades laborales
    await page.goto(hrefElement)
    
    const result = await page.evaluate(()=>{
        // Busco todos los table rows
        return Array.from (
            document.querySelectorAll('tr')
        ).map(fila => { // A partir de cada fila obtengo los campos que deseo mostrar
            const campos = Array.from(fila.querySelectorAll('td'))
            const primerCampo = campos[1]?.querySelector('a')
            const segundoCampo = campos[2]
            const tercerCampo = campos[4]
            const fechaActual = new Date().toLocaleString('es-UY', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })
            // Retorno el objeto
            return {
                id: fila.rowIndex,
                link: primerCampo?.href || '',
                titulo: primerCampo?.textContent || '',
                empresa: segundoCampo?.innerText || '',
                fechaFin: tercerCampo?.innerText.replace(/\./g, '/') || '',
                fechaActual
            }
        }) 

    })
    console.log(result)
    await browser.close()
}

accessLink()