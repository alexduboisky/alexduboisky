document.addEventListener('DOMContentLoaded', function () {

    let weatherCity = document.querySelector('.weather_city')
    let weatherTime = document.querySelector('.weather_time')
    let weatherIcon = document.querySelector('#weather_icon')
    let weatherTemp = document.querySelector('.weather_temp')
    let weatherFeels = document.querySelector('.weather_feels')
    let weatherWindDirection = document.querySelector('.weather_wind__direction')
    let weatherWindSpeed = document.querySelector('.weather_wind__speed')
    let forecast = document.querySelector('.forecast')
    let container = document.querySelector('.container')
    let dt

    let xhr = new XMLHttpRequest();
    const API_KEY = '84d6ecb8cce7742b9bed2b6595991fb7';
    xhr.open('GET', 'https://api.openweathermap.org/data/2.5/forecast?q=Minsk&units=metric&appid=' + API_KEY);
    xhr.responseType = 'json';

    xhr.onload = function () {
        if (xhr.status != 200) {
            alert('Ошибка: ' + xhr.status);
            container.style.backgroundImage = `url('img/bg.jpg')`
            return;
        } else {
            let response = xhr.response;
            dt = new Date(response.list[0].dt * 1000)

            switch (true) {
                case (response.list[0].weather[0]['main'] == 'Snow'):
                    container.style.backgroundImage = `url('img/snow.gif')`
                    break;
                case (response.list[0].weather[0]['main'] == 'Drizzle'):
                    container.style.backgroundImage = `url('img/drizzle.gif')`
                    break;
                case (response.list[0].weather[0]['main'] == 'Rain'):
                    container.style.backgroundImage = `url('img/rain.gif')`
                    break;
                case (response.list[0].weather[0]['main'] == 'Mist'):
                    container.style.backgroundImage = `url('img/mist.gif')`
                    break;
                case (response.list[0].weather[0]['main'] == 'Clouds'):
                    container.style.backgroundImage = `url('img/bg_gif.gif')`
                    break;
                case (response.list[0].weather[0]['main'] == 'Thunderstorm'):
                    container.style.backgroundImage = `url('img/thunderstorm.gif)`
                    break;
                default:
                    container.style.backgroundImage = `url('img/bg.jpg')`
                    break;
            }

            setMainWeather(response.city['name'], response.city['country'], dt.toLocaleTimeString().slice(0, 5), response.list[0].weather[0].icon, Math.round(response.list[0].main['temp']), Math.round(response.list[0].main['feels_like']), response.list[0].wind['deg'], Math.round(response.list[0].wind['speed']))
            for (let i = 0; i < Object.keys(response.list).length; i += 8) {
                dt = new Date(response.list[i].dt * 1000)
                forecast.appendChild(setSecondWeather(dt, response.list[i].weather[0].icon, Math.round(response.list[i].main['temp'])))
            }
        }
    };

    function setMainWeather(city, country, time, icon, temp, feels, direction, speed) {
        switch (true) {
            case (direction == 0):
                weatherWindDirection.innerHTML = `<i class="far fa-compass"></i> North`;
                break;
            case (direction > 0 && direction < 90):
                weatherWindDirection.innerHTML = `<i class="far fa-compass"></i> North-East`;
                break;
            case (direction == 90):
                weatherWindDirection.innerHTML = `<i class="far fa-compass"></i> East`;
                break;
            case (direction > 91 && direction < 180):
                weatherWindDirection.innerHTML = `<i class="far fa-compass"></i> South-East`;
                break;
            case (direction == 180):
                weatherWindDirection.innerHTML = `<i class="far fa-compass"></i> South`;
                break;
            case (direction > 180 && direction < 270):
                weatherWindDirection.innerHTML = `<i class="far fa-compass"></i> South-West`;
                break;
            case (direction == 270):
                weatherWindDirection.innerHTML = `<i class="far fa-compass"></i> West`;
                break;
            case (direction > 271 && direction < 360):
                weatherWindDirection.innerHTML = `<i class="far fa-compass"></i> North-West`;
                break;
            default:
                console.log('unknown')
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
    xhr.onerror = function () {
        alert('Error')
    };
    xhr.send();
})