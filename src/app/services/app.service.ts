import { Injectable } from '@angular/core';

import { Project, DBProject } from '../app.component';

import firebase from "firebase/app";
import { Mode } from '../home/home.component';

export interface BackwardsCompatibleDBProject extends DBProject {
	imageUrls?: string[];// No longer a thing since we are now supporting videos and images
}

@Injectable()
export class AppService {
    public projects: Project[];
	public footerUrls: Project[];

	public mode: Mode;

	public first?: boolean;// Used on HomeComponent (at least HomeComponent)
	public id: number;

	public env: "dev" | "prod";

    constructor() {
        this.projects = [];
		this.footerUrls = [];
		
		this.id = 0;

		this.env = "dev";// Will get updated once updatedEnv gets called
		this.updateEnv();
	}

	public updateEnv(): void {
		this.env = 'dev';

		if (location.hostname === 'samanthamink.com' || location.hostname === 'www.samanthamink.com' || location.hostname === 'samanthamink.web.app' || location.hostname === 'samanthamink.firebaseapp.com') {
			this.env = 'prod';
		}
	}
	
	public getID(): string {
		this.id += 1;
		return `${this.id}-${Date.now()}`;
	}

    public loadProjects(): Promise<void> {
		return firebase.database().ref(this.env).once('value').then(snapshot => {
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
					const url: BackwardsCompatibleDBProject = projects[i];

					const project = {
						width: 0, 
						text: url.text, 
						href: url.href,
						assets: url.assets || [],
						useSlideshow: url.useSlideshow || false,
						desc: url.desc || "",
						tags: url.tags || [],

						// In app attributes
						margin: 0,
						marginRight: 0,
					};

					if (url.imageUrls) {
						for (const imageUrl of url.imageUrls) {
							project.assets.push({
								type: 'image',
								url: imageUrl,
							});
						}
					}

					this.projects.push(project);
				}
			}

			if (footerUrls && footerUrls.length) {
				for (var i = 0; i < footerUrls.length; i++) {
					const footerUrl: BackwardsCompatibleDBProject = footerUrls[i];

					this.footerUrls.push({
						width: 0, 
						text: footerUrl.text, 
						href: footerUrl.href,
						assets: footerUrl.assets || [],
						useSlideshow: footerUrl.useSlideshow || false,
						desc: footerUrl.desc || "",
						tags: footerUrl.tags || [],

						// In app attributes
						margin: 0,
						marginRight: 0,
					});

					if (footerUrl.imageUrls) {
						for (const imageUrl of footerUrl.imageUrls) {
							footerUrls.assets.push({
								type: 'image',
								footerUrl: imageUrl,
							});
						}
					}
				}
			}
		});
    }
}
