import { useState } from 'react'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
const api_key = import.meta.env.VITE_SOME_KEY
console.log(api_key);

function App() {
  const [search, setSearch] = useState("")
  const [looked, setLooked] = useState("")
  const [names, setNames] = useState([])
  const [countries, setCountries] = useState([])
  const [infoCountry, setInfoCountry] = useState({can: "ada"})
  const [weather, setWeather] = useState({})

  let someKey = 0;

  const incKey = ()=> {
    someKey++;
  }

  //VERY HELPFUL, WHENEVER infocountry changes it runs and updates
  useEffect(() => {
    if (infoCountry.hasOwnProperty('name')) {
      getWeatherInfo();
    }
  }, [infoCountry]);

  const changeState = event=> {
    event.preventDefault()
    // console.log(search)
    getCountries(search)
  }

  const changeSearch = (event)=> {
    // console.log(event.target.value)
    setSearch(event.target.value)
  }

  const setTheInfoCountry = (country)=> {
    // console.log(country);
    setInfoCountry(country)
  }

  const getCountries = (search)=> {
    setInfoCountry({can:"ada"})
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
    .then(res => {
      const filteredCountries = res.data.filter(curr=> curr.name.common.toLowerCase().includes(search)) 
      // console.log(res.data);
      console.log(filteredCountries)
      setCountries(filteredCountries)
      // console.log(names)
    })
  }

  const getWeatherInfo = ()=> {
    console.log("woewea");
    const newUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${infoCountry.latlng[0]}&lon=${infoCountry.latlng[1]}&appid=${api_key}`
    axios.get(newUrl)
    .then(res => {
      setWeather(res.data);
      console.log(res.data);
    })
  }

  return (
    <div className="appStyle">
    <form className="searchForm" onSubmit={changeState}>
      <p>Find Country Data</p>
      <input type="text" onChange={changeSearch} value={search}/>
    </form>
    {countries.length < 10 ? Object.keys(countries).map(key=> {
    incKey()
    return <Name key={someKey} country={countries[key]} setCountry={setTheInfoCountry}/>}) : "Too many matches, specify another filter"
    }
    {infoCountry.hasOwnProperty('name') ? <CountryInfo country={infoCountry}/> : console.log(infoCountry)}
    {Object.keys(weather).length === 0 ? "" : <Weather weather={weather}/>}
    </div>
  )
}

const Name = ({country,setCountry})=> {
  return (
  <div className='countryBlock'>
  {country.name.common}
  <button onClick={()=>setCountry(country)}>Show</button>
  </div>
  )
}

const CountryInfo = ({country})=> {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <ul>
        {Object.keys(country.languages).map(key=> <li key={uuidv4()}>{country.languages[key]}</li>)}
      </ul>
      <img src={country.flags.png} alt="" />
    </div>
  )
}

const Weather = ({weather})=> {
  const code = weather.weather[0].icon
  const url = `https://openweathermap.org/img/wn/${code}@2x.png`
  return (
    <div>
      <h1>Weather in {}</h1>
      <p>
      temperature {weather.main.temp}
      </p>
      <img src={url} alt="" />
      <p>
      wind {weather.wind.speed} m/s
      </p>
    </div>
  )
}

export default App

//iterate over returned req, checking how many match the name, if > 10 -> handle
// .then the weather call