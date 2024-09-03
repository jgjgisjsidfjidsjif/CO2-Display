window.onload = getData();
setInterval(() => getData(), 10000);


async function getData(){ //This retrives data from the WAQI API for Pakuranga.
    const api = 'https://api.waqi.info/feed/@9305/?token=[REDACTED]';
    try {
        const response = await fetch(api);
        if (!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        parseData(data);
    }catch (error){
        console.error(error.message);
    }
}

function parseData(data){
    if (data.status === "ok") {
        const { aqi, dominentpol, iaqi, city} = data.data;
        const { t, h, p, pm10,} = iaqi;
        document.getElementById('status').innerHTML = `
        <h2><strong>Current Status:</strong> ${getAqiCategory(aqi)}</h2>
    `;
        document.getElementById('currentIndex').innerHTML = `
            <p><strong>Air Quality Index in ${city.name}:</strong> ${aqi} </p>
        `;
        document.getElementById('dominantPollutant').innerHTML = `
        <p><strong>Dominant Pollutant:</strong> ${dominentpol.toUpperCase()}</p>
    `;
    document.getElementById('footer').innerHTML = `
    <p><strong>Last updated at:</strong> ${Date()}. Feel free to interact with this display! </p>
`;
    /*document.getElementById('waqiData').innerHTML = `
    <p><strong>Air Quality Index in ${city.name}:</strong> ${aqi} </p>
    <p><strong>Dominant Pollutant:</strong> ${dominentpol.toUpperCase()}</p>
    <p><strong>Current Temperature:</strong> ${t ? t.v : 'N/A'}°C</p>
    <p><strong>Current Humidity:</strong> ${h ? h.v : 'N/A'}%</p>
    <p><strong>Current Pressure:</strong> ${p ? p.v : 'N/A'} hPa</p>
    <p><strong>Current PM10:</strong> ${pm10 ? pm10.v : 'N/A'} µg/m³</p>
    <p><strong>Last updated at:</strong> ${Date()}</p>
`;*/
    } else {
        document.getElementById('status').innerText = 'No data available.';
    }
    
}

function getAqiCategory(aqi) {
    let category;
    let color;

    if (aqi <= 50) {
        category = 'Good';
        color = '#0fe600';
    } else if (aqi <= 100) {
        category = 'Moderate';
        color = '#77ff2e';
    } else if (aqi <= 150) {
        category = 'Unhealthy for Sensitive Groups';
        color = '#e5ff00';
    } else if (aqi <= 200) {
        category = 'Unhealthy';
        color = '#ffc800';
    } else if (aqi <= 300) {
        category = 'Very Unhealthy';
        color = '#ff3700';
    } else {
        category = 'Hazardous';
        color = '#d90000';
    }

    // Change the background color of all divs with the class "data"
    const dataDivs = document.querySelectorAll('.data');
    dataDivs.forEach(div => {
        div.style.backgroundColor = color;
    });

    return category;
}

 ////Token: f3dd92ec3861361466172655ca608938c634dddc


/*
function getAqiCategory(aqi) {

    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
}
*/

/*function drawChart() {
    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(drawChart);
  // Define the chart to be drawn.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Element');
  data.addColumn('number', 'Percentage');
  data.addRows([
    ['Nitrogen', 0.78],
    ['Oxygen', 0.21],
    ['Other', 0.01]
  ]);

   // Instantiate and draw the chart.
   var chart = new google.visualization.PieChart(document.getElementById('graphs'));
  chart.draw(data, null);
}


window.onload = drawChart();*/

