import React from 'react'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet/dist/leaflet';
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw/dist/leaflet.draw'
import { useEffect, useState } from 'react';
import logo from './assets/Khageswara-1.png'




function Map() {
  const [data, setData]= useState('')
  const [title,setTitle]=useState('')
  const [description,setDescription]=useState('')

  const handleSubmit= async (e)=>{
    const mission = {title,data,description}

    const response =await fetch('http://localhost:4000/mission',{
      method: 'POST',
      body: JSON.stringify(mission),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    const json= await response.json()

    if (!response.ok){
      console.log(json.error)
    }
    if(response.ok){
      console.log("u made a mission :",json)
    }

  }
  var dataa=""
  useEffect(() => {
  
    const map = L.map('mapid', {
      center: [-7.770905, 110.377637],
      zoom: 18
    })

    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
    ).addTo(map);

    const drawnItems = new L.FeatureGroup()
    map.addLayer(drawnItems);
    const drawControl = new L.Control.Draw({
      polygon: {
        showArea: true
      },
      edit: {
        featureGroup: drawnItems
      }
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function (event) {
      drawnItems.addLayer(event.layer);
      dataa = JSON.stringify(drawnItems.toGeoJSON());
      setData(dataa);
      console.log(dataa);
    });
    map.on(L.Draw.Event.EDITED, function (event) {
      dataa = JSON.stringify(drawnItems.toGeoJSON());
      setData(dataa);
      console.log(dataa);
    });
    map.on(L.Draw.Event.DELETED, function (event) {
      dataa = JSON.stringify(drawnItems.toGeoJSON());
      setData(dataa);
      console.log(dataa);
    });

    return () => {
      map.off()
      map.remove()
    }
  },[])

  return (
    <>
      <div>
        <div className='GCS__Navbar'>
            <div className='GCS__Navbar-links_logo'>
              <img src={logo} alt="logo" />
            </div>
            <div>
              <h1 className='author'>Created by Inam and Jethro</h1>
            </div>
        </div>
        <div className='wrapping'>
        <div className='map-container' >
          <div id='mapid' style={{ height: '80vh', width:'150vh' }}></div>
        </div>
        <div className='missionbar'>
          <h3>Build your mission</h3>
          <div className='buttons'>
            <input type={'text'} onChange={(e)=>{setTitle(e.target.value)}}></input>
              <button onClick={handleSubmit} className> SAVE </button>
              <button onClick={handleSubmit}> DELETE </button>
          </div>
          
        </div>
      </div>
      </div>

    </>
  )
}

export default Map