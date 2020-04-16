import { Injectable } from '@angular/core';

import { Project, DBProject } from './app.component';

import * as firebase from "firebase/app";

@Injectable()
export class AppService {
    projects: Project[];
	footerUrls: Project[];

	mode: 'dark' | 'light' | '';

    constructor() {
        this.projects = [];
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
			// console.log(app);

			const projects = app.projects;
			const footerUrls = app.footers;

			this.projects = [];
			this.footerUrls = [];

			if (projects && projects.length) {
				for (var i = 0; i < projects.length; i++) {
					const url: DBProject = projects[i];

					this.projects.push({
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
