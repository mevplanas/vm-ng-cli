import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { MAP_CONFIG } from '../config/map.config';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  // in production we use express and ejs templates,
  // how ever routing is based on Angular routing
  // so we add basic meta tags when routes changes
  // default title
  title = this.config.defaultTitle;

  constructor(private titleService: Title, private metaService: Meta, @Inject(MAP_CONFIG) private config) { }

  setMetaData() {
    const snapshotUrl = window.location.pathname.slice(1);
    const themes: any = this.config.themes;
    for (const theme in themes) {
      // if hasOwnProperty and if not custom theme
      if (themes.hasOwnProperty(theme)) {
        const themeId = themes[theme].id; // get unique theme id
        if (themeId === snapshotUrl) {
          let newTitle = themes[theme].name;
          const description = themes[theme].description;
          newTitle ? (newTitle = newTitle + ' / ' + this.title) : (newTitle = this.title);
          const newMeta = description ? description : newTitle;
          const metadDefinition = { name: 'description', content: newMeta };
          this.metaService.updateTag(metadDefinition);
          this.titleService.setTitle(newTitle);
        }
      }
    }
  }

}

