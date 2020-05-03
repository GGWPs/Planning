import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Map, MapboxGeoJSONFeature, MapLayerMouseEvent} from "mapbox-gl";
import {UserService} from "../user.service";
import {Admin} from "../admin/Admin";

@Component({
  selector: 'app-adminmap',
  templateUrl: './adminmap.component.html',
  styleUrls: ['./adminmap.component.css']
})
export class AdminmapComponent implements OnInit {
  lists;

  labelLayerId: string;
  points: GeoJSON.FeatureCollection<GeoJSON.Point>;
  selectedPoint: MapboxGeoJSONFeature | null;
  cursorStyle: string;

  onLoad(mapInstance: Map) {
    // tslint:disable-next-line:no-non-null-assertion
    // const layers = mapInstance.getStyle().layers!;

    // for (let i = 0; i < layers.length; i++) {
    //   if (layers[i].type === 'symbol' && (<SymbolLayout>layers[i].layout)['text-field']) {
    //     this.labelLayerId = layers[i].id;
    //     break;
    //   }
    // }
  }

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.points = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            // tslint:disable-next-line:max-line-length
            description:
              '<strong>Make it Mount Pleasant' +
              '</strong><p><a href="http://www.mtpleasantdc.com/makeitmtpleasant" target="_blank" title="Opens in a new window"' +
              '>Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities.' +
              ' 12:00-6:00 p.m.</p>',
            icon: 'theatre'
          },
          geometry: {
            type: 'Point',
            coordinates: [-77.038659, 38.931567]
          }
        },
        {
          type: 'Feature',
          properties: {
            // tslint:disable-next-line:max-line-length
            description:
              '<strong>Mad Men Season Five Finale Watch Party</strong><p>Head to Lounge 201 (201 Massachusetts Avenue NE) Sunday for a <a href="http://madmens5finale.eventbrite.com/" target="_blank" title="Opens in a new window">Mad Men Season Five Finale Watch Party</a>, complete with 60s costume contest, Mad Men trivia, and retro food and drink. 8:00-11:00 p.m. $10 general admission, $20 admission and two hour open bar.</p>',
            icon: 'theatre'
          },
          geometry: {
            type: 'Point',
            coordinates: [9.404954, 52.520008]
          }
        },
        {
          type: 'Feature',
          properties: {
            // tslint:disable-next-line:max-line-length
            description:
              '<strong>Big Backyard Beach Bash and Wine Fest</strong><p>EatBar (2761 Washington Boulevard Arlington VA) is throwing a <a href="http://tallulaeatbar.ticketleap.com/2012beachblanket/" target="_blank" title="Opens in a new window">Big Backyard Beach Bash and Wine Fest</a> on Saturday, serving up conch fritters, fish tacos and crab sliders, and Red Apron hot dogs. 12:00-3:00 p.m. $25.grill hot dogs.</p>',
            icon: 'bar'
          },
          geometry: {
            type: 'Point',
            coordinates: [9.404954, 52.820008]
          }
        },
        {
          type: 'Feature',
          properties: {
            // tslint:disable-next-line:max-line-length
            description:
              '<strong>Ballston Arts & Crafts Market</strong><p>The <a href="http://ballstonarts-craftsmarket.blogspot.com/" target="_blank" title="Opens in a new window">Ballston Arts & Crafts Market</a> sets up shop next to the Ballston metro this Saturday for the first of five dates this summer. Nearly 35 artists and crafters will be on hand selling their wares. 10:00-4:00 p.m.</p>',
            icon: 'art-gallery'
          },
          geometry: {
            type: 'Point',
            coordinates: [-77.111561, 38.882342]
          }
        }
      ]
    };
  }

  makeUser() {
    const features = [];

    features.push({
      type: 'Feature',
      properties: {
        // tslint:disable-next-line:max-line-length
        description:
          '<strong>Make it Mount Pleasant' +
          '</strong><p><a href="http://www.mtpleasantdc.com/makeitmtpleasant" target="_blank" title="Opens in a new window"' +
          '>Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities.' +
          ' 12:00-6:00 p.m.</p>',
        icon: 'theatre'
      },
      geometry: {
        type: 'Point',
        coordinates: [-77.038659, 38.931567]
      }
    });
  }

  onClick(evt: MapLayerMouseEvent) {
    this.selectedPoint = evt.features![0];
  }

  async ngOnInit() {
    await this.getLists();

  }



  getLists() {
    return new Promise(resolve => {
      this.userService.getLists()
        .subscribe(lists => {
          this.lists = lists;
          resolve();
        });
    });
  }

  filterList(val: any) {

  }

}
