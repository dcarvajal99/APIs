/* const valorPesos =  document.getElementById("inputCLP") */
const divisaSeleccionada =  document.getElementById("selector")
const buscar =  document.getElementById("buscar")
const filtrocoincidencias = ["dolar","uf","euro","utm","bitcoin"]
const link = "https://mindicador.cl/api"
const resultado = document.getElementById("resultado")

/* Convertir las primera letra en mayuscula */
const primeraLetraMayusc = (str) => str.charAt(0).toUpperCase() + str.slice(1)

/* funcion que realiza la peticion a la API de mindicador.cl */
async function getAPI(){
    try {
    /* peticion a la API de mindicador.cl, el parametro await permite esperar una respuesta desde la API */
    const res = await fetch(link)
    const dataMonedas = await res.json()     
    
    /* Una vez que obtenemos los resultados de la API se realiza un filtro solamente con los datos que necesitaremos */
    const currencyList = filtrocoincidencias.map((currency) => {
        return{
            code: dataMonedas[currency].codigo,
            value: dataMonedas[currency].valor
        } 
    })

    /* Insertar el nombre de las monedas que obtuvimos atravez de la varible global llamada filtrocoincidencias que nosotros especificamos */
    currencyList.forEach((currency) => {
    const option = document.createElement('option')
    option.value = currency.value
    option.text = primeraLetraMayusc(currency.code)
    divisaSeleccionada.appendChild(option)    
    })

    console.log(currencyList) 
    } catch (error) {
        console.log("Error al obtener el valor de las monedas")
        document.getElementById('bg').innerHTML = `<h1>Error al obtener el valor de las monedas, reintente
        </h1>`
        
    }
    
}

const calcularResultados = (amount, currency) => {
    const resultadoDivisa = (amount / currency).toFixed(2)
    let redondear = parseFloat(resultadoDivisa).toFixed(4)
    let esNum = new Intl.NumberFormat('es-CL')
    redondear = esNum.format(redondear)
    resultado.innerHTML = `$ ${redondear}.-`
}


/* dibujar grafico  */
const dibujarGrafico = async () => {
    try{
    const currency = divisaSeleccionada.options[
        divisaSeleccionada.selectedIndex
        ].text.toLowerCase()
    console.log(currency)
    const resGrafico = await fetch(`${link}/${currency}`)
    const dataGrafico = await resGrafico.json()

    const serieParaGrafico = dataGrafico.serie.slice(0, 10).reverse()
    
    /* dibujar grafico */
    
    const data = {
    labels: serieParaGrafico.map((item) => item.fecha.substring(0,10)),
    datasets: [{
        data: serieParaGrafico.map((item) => item.valor),
        label: currency,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
    }]
    };
    const config = {
        type: 'line',
        data: data,
    };
    const chartDOM = document.getElementById("chart")
    chartDOM.classList.remove('d-none')
    new Chart(chartDOM, config)
    } catch (error) {
        alert("Error al obtener los datos para graficar las monedas")
        console.log(error)
    } 
} 

document.querySelector("#button").addEventListener('click', () => {
    const valorPesos =  document.getElementById("inputCLP").value
    console.log(valorPesos)
    if (valorPesos === ''){
        alert('Debes ingresar un monto')
        return
    }
    
    calcularResultados(valorPesos,divisaSeleccionada.value)
    dibujarGrafico()
})


getAPI()

