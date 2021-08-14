import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor{
  color:string; 
  markers?:mapboxgl.Marker;
  centro?:[number,number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [`
    .mapa-container{
      height:100%;
      width:100%;
    }
    .list-group{
      position:fixed;
      top:20px;
      right:20px;
      z-index:99;
    }
    li{
      cursor:pointer;
    }
    
  `]
})
export class MarcadoresComponent implements AfterViewInit {
  @ViewChild('mapa') divMapa!:ElementRef;
  mapa!: mapboxgl.Map; 
  lvlZoom:number =  15;
  center:[number, number] = [ -99.14665795883748,19.50419971321819];

  //ARREGLO DE MARCADORES
  marcadores: MarcadorColor[]= []; 

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom:this.lvlZoom
    });

    this.leerLocalStorage(); 
    const markerHTML: HTMLElement = document.createElement('div');
    markerHTML.innerHTML = 'Hola mundo'; 
    
    
    /*
    const marker = new mapboxgl.Marker({
      //element:markerHTML
    })
      .setLngLat(this.center)
      .addTo(this.mapa); 
    */
  }
  irMarcador(marcador:MarcadorColor){
    //const {lng, lat} = marcador.markers.getLngLat(); 
    //const centroMarcador:[number, number] = [Number(lng),Number(lat)];  
    this.mapa.flyTo({
      center: marcador.markers?.getLngLat()
    }); 
  }
  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker({
      draggable:true,
      color
    })
      .setLngLat(this.center)
      .addTo(this.mapa);
      this.marcadores.push({color, markers:nuevoMarcador})
    this.guardarMarcadoresLocal(); 
    nuevoMarcador.on('dragend',()=>{
      this.guardarMarcadoresLocal(); 
    })
  }
  guardarMarcadoresLocal(){
    const lngLatArr:MarcadorColor[] = []; 
    
    this.marcadores.forEach(m =>{
      const color = m.color; 
      const {lng, lat}  = m.markers!.getLngLat();
      lngLatArr.push({
        color, 
        centro:[lng, lat]
      })
    })
    localStorage.setItem('marcadores',JSON.stringify(lngLatArr));
  }
  leerLocalStorage(){
    if(!localStorage.getItem('marcadores')){
      return;
    }
    const lnglatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);

    lnglatArr.forEach(m=>{
      const newMarker = new mapboxgl.Marker({
        color:m.color,
        draggable:true
      }).setLngLat(m.centro!)
        .addTo(this.mapa)
      this.marcadores.push({
        markers:newMarker,
        color:m.color
      });
      newMarker.on('dragend',()=>{
        this.guardarMarcadoresLocal(); 
      })
    });
  
  }
  borrarMarcador(i:number){
    this.marcadores[i].markers?.remove(); 
    this.marcadores.splice(i,1); 
    this.guardarMarcadoresLocal();
  }
}
