// src/app/services/flowbite.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { initFlowbite } from 'flowbite';

@Injectable({
  providedIn: 'root'
})
export class FlowbiteService {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  loadFlowbite() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Attempting to load Flowbite...');
      import('flowbite')
        .then((module) => {
          console.log('Flowbite JS loaded successfully:', module);
          initFlowbite();
          console.log('Flowbite initialized');
        })
        .catch((error) => {
          console.error('Error loading Flowbite JS:', error);
        });
    } else {
      console.warn('Flowbite not loaded: Not running in a browser environment.');
    }
  }
}