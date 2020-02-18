document.addEventListener('DOMContentLoaded', function () {

    let currentWeather = document.querySelector('.current_weather')
    let weatherCity = document.querySelector('.weather_city')
    let weatherTime = document.querySelector('.weather_time')
    let weatherIcon = document.querySelector('#weather_icon')
    let weatherTemp = document.querySelector('.weather_temp')
    let weatherFeels = document.querySelector('.weather_feels')
    let weatherWindDirection = document.querySelector('.weather_wind__direction')
    let weatherWindSpeed = document.querySelector('.weather_wind__speed')
    let forecast = document.querySelector('.forecast')
    let container = document.querySelector('.container')
    let dt;


    currentWeather.style.background = `url('img/Spin.gif') center center no-repeat`

    ymaps.ready(function () {
        let location = ymaps.geolocation.get({
            provider: 'browser'
        });
        location.then(
            function (result) {

                let myPlacemark,
                myMap = new ymaps.Map("first_map", {
                    center: [result.geoObjects.position[0], result.geoObjects.position[1]],
                    zoom: 15
                });
                myMap.geoObjects
                    .add(new ymaps.Placemark([result.geoObjects.position[0], result.geoObjects.position[1]], {
                        preset: 'islands#icon',
                        iconColor: '#0095b6'
                    }))
                getWeather(result.geoObjects);
                myMap.events.add('click',function(e){
                    result = e.get('coords');
                    clearDivs();
                    getWeather(result)
                    if(myPlacemark){
                        myPlacemark.geometry.setCoordinates(result);
                    }
                    else{
                        myPlacemark = createPlacemark(result);
                        myMap.geoObjects.add(myPlacemark);
                    }
                })
                function createPlacemark(result) {
                    return new ymaps.Placemark(result,{
                        preset: 'islands#violetDotIconWithCaption',
                        draggable: true
                    });
                }
                
            }
        );


    });

    function getWeather(position) {
        let lat;
        let lon;
        if(position[0]!= undefined){
           lat = position[0];
           lon = position[1];
        }
        else{
            lat = position.position[0];
            lon = position.position[1];
        }

        
        let xhr = new XMLHttpRequest();
        let xhrCurrent = new XMLHttpRequest();
        const API_KEY = '84d6ecb8cce7742b9bed2b6595991fb7';
        xhr.open('GET', `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        xhr.responseType = 'json';
        xhrCurrent.open('GET', `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
        xhrCurrent.responseType = 'json';
        xhr.onload = function () {
            if (xhr.status != 200) {
                alert('Ошибка: ' + xhr.status);
                container.style.backgroundImage = `url('img/bg.jpg')`
                return;
            } else {
                let response = xhr.response;
                dt = new Date(response.list[0].dt * 1000)
                for (let i = 0; i < Object.keys(response.list).length; i += 8) {
                    dt = new Date(response.list[i].dt * 1000)
                    forecast.appendChild(setSecondWeather(dt, response.list[i].weather[0].icon, Math.round(response.list[i].main['temp'])))
                }
            }
        }
        xhrCurrent.onload = function () {
            if (xhrCurrent.status != 200) {
                alert('Ошибка: ' + xhrCurrent.status);
                container.style.backgroundImage = `url('img/bg.jpg')`
                return;
            } else {
                currentWeather.style.background = `rgba(240, 248, 255,0.5)`
                let response = xhrCurrent.response;
                dt = new Date(response.dt * 1000)
                container.style.backgroundImage = `url('img/${response.weather[0]['main']}.gif')`;

                setMainWeather(response.name, response.sys['country'], dt.toLocaleTimeString().slice(0, 5), response.weather[0].icon, Math.round(response.main['temp']), Math.round(response.main['feels_like']), response.wind['deg'], Math.round(response.wind['speed']))
            }
        }
        xhrCurrent.onerror = function () {
            alert('Error')
        };
        xhr.onerror = function () {
            alert('Error')
        };
        xhr.send();
        xhrCurrent.send();
    }

    function setMainWeather(city, country, time, icon, temp, feels, direction, speed) {
        switch (true) {
            case (direction >=337.6 && direction <=22.5):
                weatherWindDirection.innerHTML = `<i class="far fa-compass"></i> North`;
                break;
            case (direction >=22.6 && direction <=67.5):
                weatherWindDirection.innerHTML = `<i class="far fa-compass"></i> North-East`;
                break;
            case (direction >=67.6 && direction <=112.5):
                weatherWindDirection.innerHTML = `<i class="far fa-compass"></i> East`;
                break;
            case (direction >=112.6 && direction <=157.5):
                weatherWindDirection.innerHTML = `<i class="far fa-compass"></i> South-East`;
                break;
            case (direction >=157.6 && direction <=202.5):
                weatherWindDirection.innerHTML = `<i class="far fa-compass"></i> South`;
                break;
            case (direction >=202.6 && direction <=247.5):
                weatherWindDirection.innerHTML = `<i class="far fa-compass"></i> South-West`;
                break;
            case (direction >=247.6 && direction <=292.5):
                weatherWindDirection.innerHTML = `<i class="far fa-compass"></i> West`;
                break;
            case (direction >=292.6 && direction <=337.5):
                weatherWindDirection.innerHTML = `<i class="far fa-compass"></i> North-West`;
                break;
            default:
                weatherWindDirection.innerHTML = `<i class="far fa-compass"></i> Unknown`;
                break;
        }
        weatherCity.textContent = `${city}, ${country}`;
        weatherTime.innerHTML = `<i class="far fa-clock"></i> ${time}`;
        weatherIcon.setAttribute(`src`, `http://openweathermap.org/img/wn/${icon}@2x.png`);
        weatherTemp.textContent = `${temp} ℃`;
        weatherFeels.textContent = `Feels like ${feels} ℃`;
        weatherWindSpeed.innerHTML = `<i class="fas fa-wind"></i> ${speed} m/s`;

    }

    function setSecondWeather(date, icon, temp) {
        let dayDiv = document.createElement('div')
        let dateDiv = document.createElement('div')
        let iconDiv = document.createElement('div')
        let tempDiv = document.createElement('div')
        let iconImg = document.createElement('img');
        dateDiv.innerHTML = `${date.toLocaleDateString().slice(0,5)}</br>${date.toLocaleTimeString().slice(0,5)}`;
        iconImg.setAttribute(`src`, `http://openweathermap.org/img/wn/${icon}@2x.png`);
        iconDiv.append(iconImg);
        tempDiv.innerHTML = `${temp} ℃`;
        dayDiv.append(dateDiv, iconDiv, tempDiv)
        return dayDiv
    }

    function clearDivs(){
        weatherCity.innerHTML ='';
        weatherTime.innerHTML ='';
        weatherIcon.innerHTML ='';
        weatherTemp.innerHTML ='';
        weatherFeels.innerHTML ='';
        weatherWindDirection.innerHTML ='';
        weatherWindSpeed.innerHTML ='';
        forecast.innerHTML ='';
    }

})
