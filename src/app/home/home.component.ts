import { Component, HostListener, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Location } from '@angular/common';

import "materialize-css";

import firebase from "firebase/app";

import { AppService } from '../services/app.service';

import { Project, TagElement } from '../app.component';

import { AnalyticsService } from '../services/analytics.service';

export type Mode = 'dark' | 'light' | '' | undefined;

@Component({
    selector: 'moo-home',
    templateUrl: './home.template.html',
    styleUrls: ['./home.style.scss']
})
export class HomeComponent {
	@ViewChild('managementWrapper') private managementWrapper?: ElementRef<HTMLDivElement>;
	
	@ViewChild("linksContainer") private linksContainer?: ElementRef<HTMLDivElement>;

	@ViewChild("centerButton") private centerButton?: ElementRef<HTMLDivElement>;

	public mode?: Mode;
	public modeTimeout?: number;

	public showOthers: boolean;

	public projectFontSize: number = 9.33;

	public projectRows: Project[][];

	public projectsMaxWidth: number = 0;
	public maxProjects: number = 99;

	public h: number = 0;
	public w: number = 0;

	public showPoem: boolean;

	public loading: boolean;
	public saving: boolean;

	public email: string;
	public password: string;

	public showLogin: boolean;
	public loggedIn: boolean;

	public dragging: boolean;// This variable is no longer maintained on this Component but is used in template

	public showManagement: boolean;

	public toggleModeTimeout?: number;

	public activeManagementOption: 'projects' | 'advancedEdit' | 'footer' | 'tips' | 'analytics' = 'projects';

	public authPending: boolean;

	public isInvalidUrl: (text: string) => string | undefined;
	public isEmptyProject: (text: string) => string | undefined;
	public isEmptyFooter: (text: string) => string | undefined;

	public exampleText: string = "How now brown cow?\\sSAMANTHAMINK\\nBODYOFWORK";

	public slideshow: boolean;
	public showSlideshow: boolean;
	public slideshowAnimate: boolean;
	public slideshowAnimateTimeout?: number;

	public assetIndex: number;

	public activeProject?: Project;

	public started: boolean;

	public managementWrapperScrollTop: number | null;
	public advancedEditProject?: Project;
	public advancedEditImageUrl: string;

	private _keyDownFunc?: (event: KeyboardEvent) => void;

	constructor(private location: Location, private ngZone: NgZone, 
		public appService: AppService, private analyticsService: AnalyticsService) {
		this.projectRows = [[]];

		this.showPoem = false;

		this.loading = false;
		this.saving = false;

		this.email = "";
		this.password = "";

		this.showLogin = false;
		this.loggedIn = false;

		this.dragging = false;
		
		this.showManagement = false;

		this.authPending = false;

		this.isEmptyProject = (text: string) => {
			return undefined;
		};

		this.isEmptyFooter = (text: string) => {
			return undefined;
		};

		this.isInvalidUrl = (text: string) => {
			return undefined;
		};

		this.showOthers = false;

		this.slideshow = false;
		this.showSlideshow = false;
		this.slideshowAnimate = false;

		this.assetIndex = 0;

		this.started = false;

		this.managementWrapperScrollTop = null;
		this.advancedEditImageUrl = "";
	}

	private _ripple(x: number, y: number, color: 'black' | 'white'): void {
		const W = (window as any).Waves;

		if (!W || !W.ripple) {
			return;
		}

		if (this.centerButton) {
			W.ripple(this.centerButton.nativeElement, {
				wait: 200,
				position: {
					x: x,
					y: y
				},
				className: "minor-effect " + color
			});
		}
	}

	public doRipple(): void {
		// const W = (window as any).Waves;

		const width = this.centerButton && this.centerButton.nativeElement && this.centerButton.nativeElement.clientWidth;

		if (width) {
			const x = width * Math.random();
			const y = width * Math.random();

			this._ripple(x, y, 'white');
			// setTimeout(() => {
			// 	const x = width * 1 / 3 + 2 * width * Math.random() / 3;
			// 	const y = width * 1 / 3 + 2 * width * Math.random() / 3;

			// 	this._ripple(x, y);
			// }, 100);
			setTimeout(() => {
				// const x = width * 2 / 3 + 1 * width * Math.random() / 3;
				// const y = width * 2 / 3 + 1 * width * Math.random() / 3;

				this._ripple(12, 12, 'white');
			}, 200);
			// setTimeout(() => {
			// 	this._ripple((x + 12) % 24, (y + 12) % 24);
			// }, 450);
		}
	}

	public clickMe(): void {
		if (this.started) {
			return;
		}

		if (!(window as any).Waves || !(window as any).Waves.ripple) {
			return;
		}

		this.doRipple();

		setTimeout(() => {
			this.clickMe();
		}, 2000);
	}

	public ngOnInit(): void {
		this.appService.first = true;

		// // Hide the current url being /home
		// setTimeout(() => {
		// 	this.location.replaceState('/');
		// }, 1);

		const mode = this.appService.mode;//'dark';

		if (mode === 'dark') {
			this.setMode('dark');
			this.showOthers = true;
		} else if (mode === 'light') {
			this.setMode('light');
		} else {
			this.setMode('');
		}

		// this.test = true;

		this.projectRows = [[]];

		// this.hMargin = 100;
		// this.wMargin = 100;

		this.assetIndex = 0;

		// const drake = dragula([document.querySelector('#drakeTest')], {
		// 	// moves: function (el, source, handle, sibling) {
		// 	// 	console.log("moo");
		// 	// 	// return true; // elements are always draggable by default
		// 	// 	return false; // elements are always draggable by default
		// 	// },
		// 	moves: function (el, source, handle, sibling) {
		// 		console.log("moves");
		// 		return false; // elements are always draggable by default
		// 	},
		// 	invalid: function(el, handle) {
		// 		console.log("invalid");
		// 		return true;
		// 	},
		// 	ignoreInputTextSelection: false
		// });
		// console.log(drake);
		// setTimeout(() => {
		// console.log(drake.dragging);

		// }, 5000);

		this.isEmptyProject = (text: string) => {
			if (!text) {
				return "Project name is blank";
			}

			return undefined;
		};

		this.isEmptyFooter = (text: string) => {
			if (!text) {
				return "Footer item is blank";
			}

			return undefined;
		};

		this.isInvalidUrl = (text: string) => {
			let firstCheckPassed = false;

			const invalidMessage = "Invalid url";

			if (!text) {
				return undefined;
			}

			if (!firstCheckPassed && text.indexOf('https:') === 0) {
				firstCheckPassed = true;
			}
			
			if (!firstCheckPassed && text.indexOf('http:') === 0) {
				firstCheckPassed = true;
			}
			
			if (!firstCheckPassed && text.indexOf('mailto:') === 0) {
				firstCheckPassed = true;
			}
			
			if (!firstCheckPassed && text.indexOf('tel:') === 0) {
				firstCheckPassed = true;
			}

			if (!firstCheckPassed) {
				return invalidMessage;
			}

			try {
				new URL(text);
			} catch (error) {
				return invalidMessage;
			}

			return undefined;
		};

		this.authHandler();
	}

	// Slideshow stuff
	public nextAsset(): void {
		if (!this.activeProject) {
			this.assetIndex = 0;
			return;
		}

		this.assetIndex += 1;
		if (this.assetIndex > this.activeProject.assets.length - 1) {
			this.assetIndex = 0;
		}

		this.analyticsService.addProjectView({
			project: this.activeProject.text,
			resourceUrl: this.activeProject?.assets[this.assetIndex]?.url,
			resourceType: this.activeProject?.assets[this.assetIndex]?.type,
			index: this.assetIndex,
		});
	}

	public backAsset(): void {
		if (!this.activeProject) {
			this.assetIndex = 0;
			return;
		}

		this.assetIndex -= 1;
		if (this.assetIndex < 0) {
			this.assetIndex = this.activeProject.assets.length - 1;
		}

		this.analyticsService.addProjectView({
			project: this.activeProject.text,
			resourceUrl: this.activeProject?.assets[this.assetIndex]?.url,
			resourceType: this.activeProject?.assets[this.assetIndex]?.type,
			index: this.assetIndex,
		});
	}

	public toggleSlideshow(event?: Event, activeProject?: Project): void {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		this.activeProject = activeProject;

		// console.log('toggleSlideshow');
		if (this.mode === 'light') {
			this.toggleMode();
		}

		this.slideshow = !this.slideshow;

		if (this.slideshow) {
			this.bindKeyDownListeners();

			this.assetIndex = 0;

			if (activeProject) {
				this.analyticsService.addProjectView({
					project: activeProject.text,
					resourceUrl: activeProject?.assets[0]?.url,
					resourceType: activeProject?.assets[0]?.type,
					index: 0,
				});
			}

			this.slideshowAnimate = true;
			clearTimeout(this.slideshowAnimateTimeout);
			this.slideshowAnimateTimeout = window.setTimeout(() => {
				this.slideshowAnimate = false;
				this.showSlideshow = true;
			}, 500);
		} else {
			if (this._keyDownFunc) {
				document.removeEventListener('keydown', this._keyDownFunc);
			}
			
			this.showSlideshow = false;
			setTimeout(() => {
					this.recalcEvertyhing();
			}, 1);
			this.slideshowAnimate = true;
			clearTimeout(this.slideshowAnimateTimeout);
			this.slideshowAnimateTimeout = window.setTimeout(() => {
				this.slideshowAnimate = false;
			}, 1000);
		}
	}
	// END Slideshow stuff

	public titleFunc(event: MouseEvent) {
		if (this.slideshow) {
			this.toggleSlideshow();
			event.preventDefault();
			event.stopPropagation();
		}
	}

	public centerImageFunc(event: MouseEvent) {		
		if (this.slideshow) {
			this.toggleSlideshow();
		} else {
			this.toggleMode();
		}
		
		event.preventDefault();
		event.stopPropagation();
	}

	public ngAfterViewInit(): void {
		// if (this.mode !== 'dark') {
		// 	setTimeout(() => {
		// 		this.clickMe();
		// 	}, 2000);	
		// }
		
		setTimeout(() => {
			this.showPoem = false;

			this.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
			this.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

			if (this.mode === 'light') {
				this.showOthers = false;
			} else if (this.mode === 'dark') {
				this.showOthers = true;
			} else {
				this.showOthers = false;

				this.modeTimeout = window.setTimeout(() => {
					this.setMode('light');
					this.showOthers = false;
				}, 1000);
	
				this.toggleModeTimeout = window.setTimeout(() => {
					this.toggleMode();
				}, 10000);
			}

			setTimeout(() => {
				// this.getLinksContainerWidth();
	        	this.alignUrls();
	        	setTimeout(() => {
		       		this.recalcEvertyhing();
		    	}, 1);
			}, 1);
		},0);
	}

	public setMode(mode: 'dark' | 'light' | ''): void {
		this.mode = mode;
		document.body.className = mode;
		this.appService.mode = mode;
	}

	public toggleMode() {
		clearTimeout(this.modeTimeout);
		clearTimeout(this.toggleModeTimeout);

		this.started = true;

		if (this.mode === 'light') {
			if (this.slideshow) {
				this.toggleSlideshow();
			}

			this.setMode('');
			this.modeTimeout = window.setTimeout(() => {
				this.setMode('dark');
				setTimeout(() => {
		       		this.recalcEvertyhing();
				}, 1);
				
				this.modeTimeout = window.setTimeout(() => {
					if (this.mode === 'dark') {
						this.showOthers = true;
						setTimeout(() => {
				       		this.recalcEvertyhing();
				    	}, 1);
					}
				}, 2000);
			}, 500);
		} else {
			this.setMode('');
			this.showPoem = true;

			this.analyticsService.addPoemAnalytic();

			this.modeTimeout = window.setTimeout(() => {
				this.setMode('light');
				this.showOthers = false;
			}, 1000);
		}
	}

	private _getLinksContainerWidth() {
		if (this.linksContainer && this.linksContainer.nativeElement) {
			this.projectFontSize = parseFloat(window.getComputedStyle(this.linksContainer.nativeElement).fontSize) || 9.33;
			this.projectsMaxWidth = this.linksContainer.nativeElement.getBoundingClientRect().width;
		}
	}

	public alignUrls(): void {
		this._getLinksContainerWidth();

		let y = 0;

		let width = this.projectsMaxWidth;

		let i = 0;
		let count = 0;

		let topWidth = 0;

		this.projectRows = [];

		this.projectRows.push([]);

		let margin = 0;

		while (i < this.appService.projects.length) {
			// console.log(width);

			if (y === 0) {
				margin = 50;//70;//this.urlFontSize * 9;
			} else {
				margin = (this.projectsMaxWidth - topWidth) / (this.projectRows[0].length - 1);
			}

			const project = this.appService.projects[i];

			// console.log(url.width);

			if ((y > 0 || count < this.maxProjects) && project.width < width) {
				project.margin = margin;
				this.projectRows[y].push(project);
				width -= project.width + margin;

				if (y === 0) {
					topWidth += project.width;
				} else {
					project.marginRight = topWidth;
				}

				i += 1;
				count += 1;
			} else {
				if (width === this.projectsMaxWidth) {
					project.margin = margin;
					this.projectRows[y].push(project);

					if (y === 0) {
						topWidth += project.width
					} else {
						project.marginRight = topWidth;
					}

					i += 1;
					count += 1;
				}

				width = this.projectsMaxWidth;
				this.projectRows.push([]);
				y += 1;
				count = 0;
			}

			if (i > 99) {
				console.error("oops", i);
				M.toast({html: "Unexpected error: loop issue"});
				break;
			}
		}
	}

	// ptToPx(pt: number) {
    // 	return pt * 96 / 72;
    // }

    // pxToPt(px: number) {
    // 	return px * 72 / 96;
    // }

    public getActive(el: HTMLElement) {
    	el.classList.add("active");
    }

    public getNotActive(el: HTMLElement) {
    	el.classList.remove("active");
    }

    public recalcEvertyhing() {
    	if (this.loading) {
    		return;
    	}

    	// this.getLinksContainerWidth();
        this.alignUrls();

        this.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		this.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }

    public firebasePasswordLogin() {
	    if (this.authPending) {
			M.toast({html: 'Please wait', displayLength: 1250});
			return;
		}

	    if (!this.email) {
			M.toast({html: 'Please type your email', displayLength: 1250});
			return;
	    }

	    if (!this.password) {
			M.toast({html: 'Please type your password', displayLength: 1250});
			return;
		}
		
		this.authPending = true;

	    return firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(userCredential => {
			this.authPending = false;

			if (userCredential) {
				this.password = "";
				this.loggedIn = true;
				M.toast({html: 'Signed in', displayLength: 1250});
			} else {
				this.loggedIn = false;
				throw "Unexpected missing userCredential";
			}
		}).catch(error => {
			console.error(error);

			var errorMessage: string = "";

			if (error) {
				if (error.code) {
					if (error.code === 'auth/invalid-email') {
						errorMessage = "It appears your email is invalid";
					} else if (error.code === 'auth/user-disabled') {
						errorMessage = "It appears your account has been disabled";
					} else if (error.code === 'auth/user-not-found') {
						errorMessage = "It appears your email has not been registered";
					} else if (error.code === 'auth/wrong-password') {
						errorMessage = "Incorrect password";
					}
				}
			}

			errorMessage = errorMessage || 'Unknown error';

			M.toast({html: errorMessage, displayLength: 1250});
	    }).then(() => {
			this.authPending = false;
		})
	}

	public firebaseRequestPasswordReset() {
		if (this.authPending) {
			M.toast({html: 'Please wait', displayLength: 1250});
			return;
		}

		this.authPending = true;

		var emailAddress = this.email || "";

		let url = window.location.protocol + "//" + window.location.hostname;

		if (url === 'http://localhost') {
			url += ":" + window.location.port;
		}

		if (!emailAddress) {
			M.toast({ html: 'Email is blank. Please enter an email first.', displayLength: 1250 });
			return;
		}

		return firebase.auth().sendPasswordResetEmail(emailAddress, {url: url}).then(() => {
			M.toast({html: 'Password reset sent. Please check your email', displayLength: 1250});
		}).catch(error => {
			console.error(error);

			let errorMessage = "";

			if (error) {
				errorMessage = error.message;
			}

			errorMessage = errorMessage || 'Unknown error';

			M.toast({html: errorMessage, displayLength: 1250});
		}).then(() => {
			this.authPending = false;			
		});
	}

	public authHandler() {
		firebase.auth().onAuthStateChanged(user => {
          this.ngZone.run(() => {
          	if (user) {
          		this.loggedIn = true;
          	} else {
          		this.loggedIn = false;
          	}
          });
      	});
	}

	public logUserOut() {
		if (this.authPending) {
			M.toast({html: 'Please wait', displayLength: 1250});
			return;
		}

		this.authPending = true;

		if (this.showManagement) {
			this.toggleShowManagement();		
		}

		return firebase.auth().signOut().then(() => {
			M.toast({html: 'Signed out', displayLength: 1250});

			this.authPending = false;

			// console.log('signed out');
			this.loggedIn = false;
			this.showLogin = false;
		}, error => {
		  	console.error(error);
			M.toast({html: 'Unknown error', displayLength: 1250});
			this.authPending = false;
		});
	}

	public setActiveManagementOption(option: 'projects' | 'advancedEdit' | 'footer' | 'tips' | 'analytics'): void {
		this.activeManagementOption = option;

		setTimeout(() => {
			if (this.managementWrapperScrollTop || this.managementWrapperScrollTop === 0) {
				// console.log(this.managementWrapperScrollTop);
				if (this.managementWrapper) {
					this.managementWrapper.nativeElement.scrollTop = this.managementWrapperScrollTop;
				}

				this.managementWrapperScrollTop = null;
			}
		}, 1);
	}

	public getNewProject(): Project {
		return {
			text: "",
			href: "",
			useSlideshow: false,
			desc: "",
			assets: [],
			tags: [],

			width: 0,
			margin: 0,
			marginRight: 0,
		}
	}

	public insertProject(index: number) {
		this.appService.projects.splice(index + 1, 0, this.getNewProject());
		M.toast({html: `New project added, #${index + 2}`, displayLength: 1250});
	}

	public removeProject(index: number) {
		const project = this.appService.projects[index];

		const projectIsEmpty = !project.text || !project.href;// TODO: update to handle advance

		if (projectIsEmpty || confirm(`Are you sure you want to remove the project "${project.text}"?`)) {
			// console.log(this.appService.projects[index]);
			this.appService.projects.splice(index, 1);

			if (project.text) {
				M.toast({html: `Project ${project.text} was removed`, displayLength: 1250});
			} else if (project.href) {
				M.toast({html: `Project #${index + 1} was removed`, displayLength: 1250});
			}
		}
	}

	public swapProjects(i: number, j: number) {
		if (j < 0 || j > this.appService.projects.length - 1) {
			return;
		}
		
		const first = this.appService.projects[i];
		const second = this.appService.projects[j];

		this.appService.projects[i] = second;
		this.appService.projects[j] = first;
	}

	public toggleAdvancedProject(index: number) {
		this.appService.projects[index].useSlideshow = !this.appService.projects[index].useSlideshow;
	}

	public setAdvanceEdit(index: number): void {
		let managementWrapperScrollTop = 0;

		if (this.managementWrapper) {
			// console.log(this.managementWrapper.nativeElement.scrollTop);
			managementWrapperScrollTop = this.managementWrapper.nativeElement.scrollTop;
		}

		this.advancedEditProject = this.appService.projects[index];

		this.setActiveManagementOption('advancedEdit');

		setTimeout(() => {
			this.managementWrapperScrollTop = managementWrapperScrollTop;
		}, 2);
	}

	public removeAdvancedEditImage(index: number): void {
		if (!this.advancedEditProject) {
			return;
		}

		this.advancedEditProject.assets.splice(index, 1);

		if (this.activeProject === this.advancedEditProject) {
			this.assetIndex = this.assetIndex || 0;

			if (this.assetIndex > this.activeProject.assets.length - 1) {
				this.assetIndex -= 1;
			}
		}
	}

	public swapAdvancedEditImages(i: number, j: number) {
		if (!this.advancedEditProject) {
			return;
		}

		const firstUrl = this.advancedEditProject.assets[i];
		const secondUrl = this.advancedEditProject.assets[j];

		this.advancedEditProject.assets[i] = secondUrl;
		this.advancedEditProject.assets[j] = firstUrl;
	}

	public toggleShowManagement(): void {
		// if (this.showSlideshow) {
		// 	this.toggleSlideshow();
		// }

		clearTimeout(this.toggleModeTimeout);
		this.showManagement = !this.showManagement;

		setTimeout(() => {
			// this.getLinksContainerWidth();
			this.alignUrls();
			setTimeout(() => {
				   this.recalcEvertyhing();
			}, 1);
		}, 1);
	}

	public save() {
		if (this.saving) {
			M.toast({html: 'Please wait', displayLength: 1250});
			return;
		}

		if (!confirm(`Are you sure you want to save? You can hide/show to preview your changes before saving.`)) {
			return;
		}

		let warningMessage = "";
		let warningCount = 0;

		for (let i = 0; i < this.appService.projects.length; i++) {
			const project = this.appService.projects[i];

			if (this.isEmptyProject(project.text)) {
				warningMessage = warningMessage || `Project #${i + 1} appears to have no name.`;
				warningCount += 1;
			}

			if (this.isInvalidUrl(project.href)) {
				warningMessage = warningMessage || `Project #${i + 1}, "${project.text}" appears to have an invalid url.`;
				warningCount += 1;
			}
		}

		for (let i = 0; i < this.appService.footerUrls.length; i++) {
			const footerUrl = this.appService.footerUrls[i];

			if (this.isEmptyProject(footerUrl.text)) {
				warningMessage = warningMessage || `Footer item #${i + 1} appears to have no name.`;
				warningCount += 1;
			}

			if (this.isInvalidUrl(footerUrl.href)) {
				warningMessage = warningMessage || `Footer item #${i + 1}, "${footerUrl.text}" appears to have an invalid url.`;
				warningCount += 1;
			}
		}

		// console.log(warningCount);

		if (warningCount > 1) {
			const otherWarningsCount = warningCount - 1;

			if (otherWarningsCount === 1) {
				warningMessage += ` And there is ${otherWarningsCount} other issue.`;
			} else {
				warningMessage += ` And there are ${otherWarningsCount} other issues.`;
			}
		}

		if (warningCount) {
			if (!confirm(warningMessage + ` Are you sure you want to continue?`)) {
				return;
			}
		}

		this.saving = true;

		const app = {
			projects: this.appService.projects || [],
			footers: this.appService.footerUrls || [],
		};

		let branch = 'dev';

		if (location.hostname === 'samanthamink.com' || location.hostname === 'www.samanthamink.com') {
			branch = 'prod';
		}

		return firebase.database().ref(branch).set(app).then(() => {
			// return firebase.database().ref(`timestamps/${Date.now()}`).set(app);
		}).then(() => {
			this.saving = false;
			M.toast({html: 'Saved!', displayLength: 1250});
		}).catch(error => {
			console.error(error);

			let errorMessage = 'Unknown error';

			if (error && error.message) {
				errorMessage = error.message;
			}

			errorMessage = errorMessage || 'Unknown error';
			M.toast({html: errorMessage, displayLength: 1250});

			this.saving = false;
		});
	}

	// https://scotch.io/tutorials/responsive-equal-height-with-angular-directive
	@HostListener('window:resize')
    public onResize() {
    	// '{
    	setTimeout(() => {
       		this.recalcEvertyhing();
       	}, 1);
    }

    @HostListener('window:orientationchange')
    public onOrientationChange() {
    	// '{
    	setTimeout(() => {
       		this.recalcEvertyhing();
    	}, 1);
    }

    // Class stuff
    public hasClass(el: HTMLElement, name: string) {
        return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
    }

    public addClass(el: HTMLElement, name: string) {
        if (!this.hasClass(el, name)) {
            el.className = el.className ? [el.className, name].join(' ') : name;
        }
    }

    public removeClass(el: HTMLElement, name: string) {
        if (this.hasClass(el, name)) {
            el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
        }
    }
	// End Class stuff

	public addAsset(): void {
		this.advancedEditImageUrl = (this.advancedEditImageUrl || "").trim();

		// If url is valid
		if (this.advancedEditImageUrl.startsWith('https://imgur.com/')) {
			this.advancedEditImageUrl = this.advancedEditImageUrl.replace('https://imgur.com/', 'https://i.imgur.com/') + '.jpg';
		}

		if (!this.advancedEditImageUrl.startsWith('https://i.imgur.com/')) {
			M.toast({ html: 'url is invalid. Url should start with `https://i.imgur.com/`', displayLength: 5000 });
			return;
		}

		if (!this.advancedEditProject) {
			console.error("Unexpected missing advancedEditProject");
			return;
		}

		// => convert to proper url
		// add image to project
		this.advancedEditProject.assets = this.advancedEditProject.assets || [];

		let type: 'image' | 'video' = 'image';

		if (this.advancedEditImageUrl.endsWith('.mp4')) {
			type = 'video';
		}

		this.advancedEditProject.assets.push({
			url: this.advancedEditImageUrl,
			type: type,
		});

		this.advancedEditImageUrl = "";
	}

	public addTagSection(): void {
		if (!this.advancedEditProject) {
			return;
		}

		this.advancedEditProject.tags.unshift({
			text: "",
			elements: [
				{
					text: "",
					href: "",
				},
			],
		});

		M.toast({ html: `New Tag Section added`, displayLength: 1250 });
	}

	public insertTagSection(i: number): void {
		if (!this.advancedEditProject) {
			return;
		}

		this.advancedEditProject.tags.splice(i + 1, 0, {
			text: "",
			elements: [
				{
					text: "",
					href: "",
				},
			],
		});

		M.toast({ html: `New Tag Section added`, displayLength: 1250 });
	}

	public removeTagSection(i: number): void {
		if (!this.advancedEditProject) {
			return;
		}

		this.advancedEditProject.tags.splice(i, 1);

		M.toast({ html: `Tag Section removed`, displayLength: 1250 });
	}

	public swapTagSections(i: number, j: number): void {
		if (!this.advancedEditProject) {
			return;
		}

		if (j < 0 || j > this.advancedEditProject.tags.length - 1) {
			return;
		}

		const first = this.advancedEditProject.tags[i];
		const second = this.advancedEditProject.tags[j];

		this.advancedEditProject.tags[i] = second;
		this.advancedEditProject.tags[j] = first;
	}

	public insertTag(elements: TagElement[], i: number): void {
		elements.splice(i + 1, 0, {
			text: "",
			href: "",
		},);

		M.toast({ html: `New Tag added`, displayLength: 1250 });
	}

	public removeTag(elements: TagElement[], i: number): void {
		if (!this.advancedEditProject) {
			return;
		}

		if (this.advancedEditProject.tags.length <= 1) {
			M.toast({ html: `You must have at least one Tag per Tag Section`, displayLength: 1250 });
			return;
		}

		elements.splice(i, 1);

		M.toast({ html: `Tag removed`, displayLength: 1250 });
	}

	public swapTags(elements: TagElement[], i: number, j: number): void {
		if (j < 0 || j > elements.length - 1) {
			return;
		}

		const first = elements[i];
		const second = elements[j];

		elements[i] = second;
		elements[j] = first;
	}
	
	public canDeactivate(): boolean {
		if (this.showSlideshow) {
			this.toggleSlideshow();
			setTimeout(() => {
				this.location.replaceState('/');
			}, 1);
			return false;
		}

		if (this.showManagement) {
			if (this.activeManagementOption === 'advancedEdit') {
				this.setActiveManagementOption('projects');
				setTimeout(() => {
					this.location.replaceState('/');
				}, 1);
				return false
			}

			this.toggleShowManagement();
			setTimeout(() => {
				this.location.replaceState('/');
			}, 1);
			return false;
		}

		if (this.showLogin) {
			this.showLogin = false;
			setTimeout(() => {
				this.location.replaceState('/');
			}, 1);
			return false;
		}

		return true;
	}

	private bindKeyDownListeners(): void {
        this._keyDownFunc = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                this.backAsset();
            } else if (event.key === 'ArrowRight') {
                this.nextAsset();
            } else if (event.key === 'Escape') {
                this.toggleSlideshow();
            }
        }
		
		document.addEventListener('keydown', this._keyDownFunc);
	}
	
	public addBasicProjectAnalytic(project: Project): void {
		this.analyticsService.addProjectView({
			project: project.text,
			href: project.href,
		});
	}

	public addBasicFooterAnalytic(footerElement: Project): void {
		this.analyticsService.addFooterView({
			text: footerElement.text,
			href: footerElement.href,
		});
	}

	public addTagAnalytic(tagElement: TagElement): void {
		this.analyticsService.addTagElementView({
			text: tagElement.text,
			href: tagElement.href,
		});
	}

	public ngOnDestroy() {
		// destroy all the subscriptions at once
		// this.subs.unsubscribe();

		if (this._keyDownFunc) {
            document.removeEventListener('keydown', this._keyDownFunc);
        }
	}
}
