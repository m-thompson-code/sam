import { Injectable } from '@angular/core';

// import { environment } from '@environment';

import firebase from 'firebase/app';
import { AppService } from './app.service';

@Injectable({
    providedIn: 'root',
})
export class AnalyticsService {
    public sandbox: boolean = true;
    constructor(private appService: AppService) {
        // console.log(firebase);

        if (this.appService.env === 'prod') {
            // firebase.analytics().setAnalyticsCollectionEnabled(false);
            this.sandbox = false;
        }

        // // Toggle this value to allow analaytics on dev
        // this.sandbox = false;
    }
    
    public addPageView(routeData: {url: string}): void {
        try {
            const url = routeData.url || "sam_unknown_url";

            if (this.sandbox) {
                console.log(routeData);
                return;
            }

            firebase.analytics().logEvent('page_view', {
                page_path: url,
                // 'page_name': pageName,
            });
        }catch(error) {
            console.error(error);
        }
    }
        
    public addProjectView(projectData: {project: string, resourceUrl?: string, resourceType?: string, index?: number, href?: string}): void {
        try {
            if (this.sandbox) {
                console.log(projectData);
                return;
            }
    
            firebase.analytics().logEvent('project_view', {
                project: projectData?.project || '(unknown_project)',
                resource_url: projectData?.resourceUrl || '(no_resource_url)',
                resource_type: projectData?.resourceType || '(no_resource_type)',
                index: (projectData?.index || projectData?.index === 0) ? projectData?.index : -1,
                href: projectData?.href || '(no_href)',
            });
        }catch(error) {
            console.error(error);
        }
    }
            
    public addFooterView(footerData: {text: string, href?: string}): void {
        try {
            if (this.sandbox) {
                console.log(footerData);
                return;
            }
    
            firebase.analytics().logEvent('footer_view', {
                text: footerData?.text || '(unknown_footer)',
                href: footerData?.href || '(no_href)',
            });
        }catch(error) {
            console.error(error);
        }
    }

    public addTagElementView(tagElementData: {text: string, href?: string}): void {
        try {
            if (this.sandbox) {
                console.log(tagElementData);
                return;
            }
    
            firebase.analytics().logEvent('tag_element_view', {
                text: tagElementData?.text || '(unknown_tag)',
                href: tagElementData?.href || '(no_href)',
            });
        }catch(error) {
            console.error(error);
        }
    }

    public addPoemAnalytic(): void {
        try {
            if (this.sandbox) {
                console.log('addPoemAnalytic');
                return;
            }
    
            firebase.analytics().logEvent('poem_view');
        }catch(error) {
            console.error(error);
        }
    }
}
