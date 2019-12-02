import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeNameService {
  currentThemeName: string;

  constructor() { }

  setCurrentThemeName(name: string): string {
    this.currentThemeName = name;
    return this.currentThemeName;
  }

}
