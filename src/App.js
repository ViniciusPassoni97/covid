import React,{useState,useEffect} from 'react';
import {FormControl,Select,MenuItem,Card,CardContent} from '@material-ui/core';
import InfoBox from './components/infoBox/InfoBox';
import Map from './components/map/Map';
import Table from './components/table/Table';
import {sortDate} from './utils/utils';
import LineGraph from './components/lineGraph/LineGraph';
import './App.css';

function App() {
  const [countries,setCount] = useState([]);
  const [country,setCountry] = useState('WordWide');
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,setTableDate] = useState([]);
  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response=>response.json())
    .then(data=>{
      setCountryInfo(data);
    })
  },[])
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
        const sortedData = sortDate(data);
        setTableDate(sortedData);
        setCount(countriesItens);
      })
    }
    getCountiesData();
  },[]);
  //https://disease.sh/v3/covid-19/countries
  const onCountryChange= async(event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    //https://disease.sh/v3/covid-19/countries/[country]
    //https://disease.sh/v3/covid-19/all
    const url = countryCode === 'WordWide' ? 'https://disease.sh/v3/covid-19/all':
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url).then(response=>response.json())
    .then(date=>{
      
        setCountry(countryCode);
        setCountryInfo(date);
    })
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
          cases={countryInfo.todayCases}
          total={countryInfo.cases}/>
          <InfoBox 
          cases={countryInfo.recovered}
          title='Recovered'
          total={countryInfo.todayRecovered}/>
          <InfoBox 
          cases={countryInfo.deaths}
          title='Deaths'
          total={countryInfo.todayDeaths}/>
      </div>
      <Map/>
     </div>
     <Card className="app__right">
       <CardContent>
          <h3>Live Cases by Country</h3>
          <Table 
          countries={tableData}/>
          <h2>WorldWide new cases</h2>
          <LineGraph />
          {/*Graph */}
       </CardContent>
     </Card>
    </div>
  );
}

export default App;
