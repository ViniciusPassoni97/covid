import React,{useState,useEffect} from 'react';
import {FormControl,Select,MenuItem,Card,CardContent} from '@material-ui/core';
import InfoBox from './components/infoBox/InfoBox';
import Map from './components/map/Map';
import Table from './components/table/Table';
import {sortDate,prettyPrintStat} from './utils/utils';
import LineGraph from './components/lineGraph/LineGraph';
import './App.css';
import 'leaflet/dist/leaflet.css';

function App() {
  const [countries,setCount] = useState([]);
  const [country,setCountry] = useState('WordWide');
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,setTableDate] = useState([]);
  const [mapCenter,setMapCenter] = useState({
    lat:34.80746,lng:-40.4796
  });
  const [mapCountries,setMapCountries] = useState([]);
  const [mapZoom,setMapZoom] = useState(3);
  const [casesType,setCasesType] = useState('cases');
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
        setMapCountries(data);
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
        console.log(countryCode,date,date.countryInfo.lat,date.countryInfo.long);
        setCountry(countryCode);
        setCountryInfo(date);
        setMapCenter([date.countryInfo.lat,date.countryInfo.long]);
        setMapZoom(4);
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
            isRed 
            active={casesType === 'cases'}
            onClick={e => setCasesType('cases')}
            title='Coranavirus Cases'
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}/>
          <InfoBox 
            isRed
            active={casesType === 'recovered'}
            onClick={e => setCasesType('recovered')}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            title='Recovered'
            total={prettyPrintStat(countryInfo.recovered)}/>
          <InfoBox 
            isRed
            active={casesType === 'deaths'}
            onClick={e => setCasesType('deaths')}
            title='Deaths'
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}/>
      </div>
      <Map
      casesType={casesType}
      countries={mapCountries} 
      center={mapCenter} 
      zoom={mapZoom}
      />
     </div>
     <Card className="app__right">
       <CardContent>
          <h3>Live Cases by Country</h3>
          <Table 
          countries={tableData}/>
          <h2>WorldWide new {casesType}</h2>
          <LineGraph casesType={casesType}/>
       </CardContent>
     </Card>
    </div>
  );
}

export default App;
