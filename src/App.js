import React,{useState,useEffect} from 'react';
import {FormControl,Select,MenuItem,Card,CardContent} from '@material-ui/core';
import InfoBox from './components/infoBox/InfoBox';
import Map from './components/map/Map';
import './App.css';

function App() {
  const [countries,setCount] = useState([]);
  const [country,setCountry] = useState('WordWide');
  useEffect(()=>{
    const getCountiesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=> response.json())
      .then((data)=>{
        const countriesItens = data.map((country)=>(
          {
            name:country.country,
            value:country.countryInfo.iso2
          }
        ))
        setCount(countriesItens);
      })
    }
    getCountiesData();
  },[]);
  //https://disease.sh/v3/covid-19/countries
  const onCountryChange= async(event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
  }
  return (
    <div className="App">
     <div className="app__left">
      <div className="app_header">
        <h1>COVID19 TRACKER</h1>
        <FormControl className='app__dropdown'>
          <Select
          variant='outlined'
          value={country}
          onChange={onCountryChange}
          >
            <MenuItem value='WordWide'>WordWide</MenuItem>
            {countries.map(country => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))
          }
          </Select>
      </FormControl>
      </div>
      <div className="app__stats">
          <InfoBox 
          title='Coranavirus Cases'
          total={1020}/>
          <InfoBox 
          title='Recovered'
          total={1401}/>
          <InfoBox 
          title='Deaths'
          total={300}/>
      </div>
      <Map/>
     </div>
     <Card className="app__right">
       <CardContent>
          <h3>Live Cases by Country</h3>
          {/*Table */}
          <h2>WorldWide new cases</h2>
          {/*Graph */}
       </CardContent>
     </Card>
    </div>
  );
}

export default App;
