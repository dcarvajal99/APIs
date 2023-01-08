const inputCLP =  document.getElementById("inputCLP")
const selector =  document.getElementById("selector")
const buscar =  document.getElementById("buscar")

async function getAPI(){
    const res = await fetch("https://mindicador.cl/api/")
    const monedas = await res.json()     
    
    const nombre = monedas.map((moneda) => {
        return moneda.nombre
    });

    console.log(nombre)


}


async function Monedas(){
    const monedas = await getAPI()
    let template ="";
    monedas.forEach((moneda) => {
        template += `
        <option value="${moneda.nombre}">${moneda.nombre}</option>
        `;  
    })
    selector.innerHTML = template;
}
Monedas()