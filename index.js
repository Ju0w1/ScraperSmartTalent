import puppeteer from "puppeteer";
import insertData from './cargarTrabajo.js'
import desconectar from "./db/finalizoConexion.js";

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
            let day,month,year

            const primerCampo = campos[1]?.querySelector('a')
            const segundoCampo = campos[2]
            const tercerCampo = campos[4]
            
            var fechaFin = tercerCampo?.innerText.replace(/\./g, '/') || null

            if (fechaFin){
                [day, month, year] = fechaFin.split('/')
                fechaFin = `${year}-${month}-${day}`
            }else{
                fechaFin = '1900-01-01'
            }

            const actual_date = new Date().toLocaleString('en-CA', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                // hour: '2-digit',
                // minute: '2-digit',
                // second: '2-digit',
                // hour12: false
            })
            // Retorno el objeto
            return {
                id: fila.rowIndex,
                link: primerCampo?.href || '',
                job_name: primerCampo?.textContent || '',
                company: segundoCampo?.innerText || '',
                end_date: fechaFin,
                actual_date
            }
        }) 

    })
    // borro el primer registro ya que es basura.
    result.shift()

    result.forEach(row => {
        insertData(row.id,row.link,row.job_name,row.company,row.end_date,row.actual_date)
    })

    desconectar()

    await browser.close()
}

accessLink()