import { Injectable } from '@angular/core';

import { Project, DBProject } from './app.component';

import * as firebase from "firebase/app";

@Injectable()
export class AppService {
    urls: Project[];
	footerUrls: Project[];

    constructor() {
        this.urls = [];
        this.footerUrls = [];
    }

    loadProjects() {
        return firebase.database().ref('prod').once('value').then(snapshot => {
			if (!snapshot.exists()) {
				console.error("Unexpected error. snapshot missing");
				throw {
                    message: "Unexpected missing snapshot value"
                };
			}

			const app =  snapshot.val();
			console.log(app);

			var urls = app.projects;
			var footerUrls = app.footers;

			this.urls = [];
			this.footerUrls = [];

			if (urls && urls.length) {
				for (var i = 0; i < urls.length; i++) {
					const url: DBProject = urls[i];

					this.urls.push({
						width: 0, 
						text: url.text, 
						href: url.href,
						imageUrls: url.imageUrls || [],
						useSlideshow: url.useSlideshow || false,
						desc: url.desc || "",
						tags: url.tags || [],

						// In app attributes
						margin: 0,
						marginRight: 0,
					});
				}
			}

			if (footerUrls && footerUrls.length) {
				for (var i = 0; i < footerUrls.length; i++) {
					const footerUrl: DBProject = footerUrls[i];

					this.footerUrls.push({
						width: 0, 
						text: footerUrl.text, 
						href: footerUrl.href,
						imageUrls: footerUrl.imageUrls || [],
						useSlideshow: footerUrl.useSlideshow || false,
						desc: footerUrl.desc || "",
						tags: footerUrl.tags || [],

						// In app attributes
						margin: 0,
						marginRight: 0,
					});
				}
			}
		});
    }
}
