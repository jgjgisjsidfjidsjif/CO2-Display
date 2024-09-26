//This little tidbit of code will activate the script and set it to automatically activate every 10 seconds.
window.onload = getData();
setInterval(() => getData(), 10000);


let aqiChart;
let pm10Chart;


async function getData() { //This retrives data from the WAQI API for Pakuranga.
    const api = 'https://api.waqi.info/feed/@9305/?token=[REDACTED]';
    try {
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        //This is where the magic happens. This if else statement determines which page the user is on, and determines which function should be used.
        if (document.getElementById('extendedStatistics')){
            parseData(data);
            console.log("This is the index page.");
        }
        else{
            parseExtended(data);
            console.log("This is NOT!!! the index page.");
        };
         
    } catch (error) {
        console.error(error.message);
    }
}

//This function is called if the user is on the homepage. This function sets up and updates divs with the correct information.
function parseData(data) {
    if (data.status === "ok") {
        const { aqi, dominentpol, iaqi, city } = data.data;
        const { t, h, p, pm10, } = iaqi;
        document.getElementById('status').innerHTML = `
        <h2><strong>Current Status:</strong> ${getAqiCategory(aqi)}</h2>
    `;
        document.getElementById('currentIndex').innerHTML = `
            <p><strong>Air Quality Index in ${city.name}:</strong> ${aqi} </p>
        `;
        document.getElementById('dominantPollutant').innerHTML = `
        <p><strong>Dominant Pollutant:</strong> ${dominentpol.toUpperCase()}</p>
        <br>
        <p><strong>PM10:</strong> ${pm10 ? pm10.v : 'N/A'} µg/m³</p>

    `;
        document.getElementById('footer').innerHTML = `
    <p><strong>Last updated at:</strong> ${Date()}. All Data is from the World Air Quality Index Project. </p>
    `;
    } else {
        document.getElementById('status').innerText = 'No data available.';
    }

}

//This function should be used if the user is on the extended data page. This function will setup graphs and the status bar, and update them with data.
function parseExtended(data) {
    if (data.status === "ok") {
        const { aqi, dominentpol, iaqi, city } = data.data;
        const { t, h, p, pm10, } = iaqi;   
        
        document.getElementById('status').innerHTML = `
        <h2><strong>Current Status:</strong> ${getAqiCategory(aqi)}</h2>
        `;
        document.getElementById('footer').innerHTML = `
        <p><strong>Last updated at:</strong> ${Date()}. All Data is from the World Air Quality Index Project. </p>
        `;
        

    // If the AQI chart isn't made, create the chart
    if (!aqiChart) {
        aqiChart = Highcharts.chart('aqiGraph', {
            chart: {
                type: 'histogram',
                height: 100 +'%',  
            },
            title: {
                text: 'AQI'
            },
            xAxis: {
                title: {
                    text: 'Times Updated'
                }
            },
            yAxis: {
                title: {
                    text: 'AQI'
                }
            },
            series: [{
                type: 'histogram',
            }]
        });
        //Update the chart with some Data
        aqiChart.series[0].update({name:"Air Quality Index"}, false);
    }
    // If the PM10 chart isn't made, create the chart
    if (!pm10Chart) {
        pm10Chart = Highcharts.chart('pm10Graph', {
            chart: {
                type: 'histogram',
                height: 100 +'%',  
            },
            title: {
                text: 'PM10'
            },
            xAxis: {
                title: {
                    text: 'Times Updated'
                }
            },
            yAxis: {
                title: {
                    text: 'PM10 µg/m³'
                }
            },
            series: [{
                type: 'histogram',
            }]
        });
        //Update the chart with some Data
        pm10Chart.series[0].update({name:"PM10 µg/m³"}, false);
    }

    pm10Chart.series[0].addPoint(pm10 ? pm10.v : 'N/A');

    aqiChart.series[0].addPoint(aqi);
    
    } else {
        document.getElementById('status').innerText = 'No data available.';
    }

}

// This function determines the colouring of the interface.
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



