import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [`
    
    .mapa-container{
      height:100%;
      width:100%;
    }
    .row{
      background-color:white;
      border-radius:5px;
      bottom:50px;
      left:50px;
      padding:10px;
      position:fixed;
      width:400px;
      z-index:999;
    }
`]
})
export class ZoomRangeComponent implements OnInit, AfterViewInit, OnDestroy{
  
  @ViewChild('mapa') divMapa!:ElementRef;
  mapa!: mapboxgl.Map; 
  lvlZoom:number =  12;
  center:[number, number] = [ -99.14665795883748,19.50419971321819];
  constructor() { } 
  ngOnDestroy(): void {
    this.mapa.off('zoom', ()=>{});
    this.mapa.off('zoomend', ()=>{});
    this.mapa.off('move', ()=>{});
  }


  ngOnInit(): void { 
    
  }
  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom:this.lvlZoom
    });

    this.mapa.on('zoom', (e)=>{
      const zoomActual = this.mapa.getZoom();
      this.lvlZoom = zoomActual;
    });
    this.mapa.on('zoomend', (e)=>{
      if(this.mapa.getZoom()>18){
        this.mapa.zoomTo(18)
      }
    });
    this.mapa.on('move', (e)=>{
      const target = e.target;
      const {lng, lat} = target.getCenter();
      this.center=[lng,lat]; 
      
    });
  }
  ZoomOut(){
    this.mapa.zoomOut(); 
    console.log()
    this.lvlZoom= this.mapa.getZoom(); 
    //this.mapa.setZoom(this.mapa.getZoom()-1); 
  }

  ZoomIn(){
    this.mapa.zoomIn();
    this.lvlZoom= this.mapa.getZoom()+1; 
  }
  zoomCambio(zoomInput:string){
    this.mapa.zoomTo(Number(zoomInput)); 
  }

}
