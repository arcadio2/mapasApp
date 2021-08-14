import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styles: [`
    #mapa{
      height:100%;
      width:100%;
    }
  `]
})
export class FullscreenComponent implements OnInit {

  constructor() { }
  ngOnInit(): void {
  
    let map = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [ -99.14665795883748,19.50419971321819],
      zoom:17
    });
  }
  
  

}
