import { Component, HostListener, ViewChild, ElementRef, NgZone } from '@angular/core';

import { Subscription }	from 'rxjs';

import { DragulaService } from 'ng2-dragula';

// var dragula as any;


import * as firebase from "firebase/app";
import { from } from 'rxjs';

import * as dragula from 'dragula';

declare var M;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
	Urls = "URLS";
	Footers = "FOOTERS";
	
	@ViewChild("backgroundImageHolder") backgroundImageHolder: ElementRef;
	@ViewChild("linksContainer") linksContainer: ElementRef;

	mode: string;
	modeTimeout: any;

	showOthers: boolean;

	topUrls: any;
	bottomUrls: any;

	urls: any[];

	urlFontSize: number;

	urlRows: any[];
	urlsMaxWidth: number;
	maxUrls: number;

	h: number;
	w: number;

	footerUrls: any[];

	showPoem: boolean;

	lightIconEncoded: string;
	darkIconEncoded: string;

	dataLoading: boolean;
	backgroundImageLoading: boolean;
	loading: boolean;
	saving: boolean;

	header1: string;
	header2: string;

	email: string;
	password: string;

	showLogin: boolean;
	loggedIn: boolean;

	dragging: boolean;

	showManagement: boolean;

	toggleModeTimeout: any;

	activeManagementOption: string = 'projects';

	authPending: boolean;

	isInvalidUrl: (text: string) => string;
	isEmptyProject: (text: string) => string;
	isEmptyFooter: (text: string) => string;

	// subs = new Subscription();

	exampleText: string = "How now brown cow?\\sSAMANTHAMINK\\nBODYOFWORK";

	constructor(private dragulaService: DragulaService, private ngZone: NgZone) {
  	}

	ngOnInit() {
		(window as any).firebase = firebase;
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
		};

		this.isEmptyFooter = (text: string) => {
			if (!text) {
				return "Footer item is blank";
			}
		};

		this.isInvalidUrl = (text: string) => {
			let firstCheckPassed = false;

			const invalidMessage = "Invalid url";

			if (!text) {
				return;
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
		};

		this.authHandler();
		
		this.dataLoading = true;
		this.backgroundImageLoading = true;
		this.loading = true;

		this.header1 = "";
		this.header2 = "";

		this.urls = [];
		this.footerUrls = [];

		this.lightIconEncoded = `data:image/jpeg;base64,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`;
		this.darkIconEncoded = `data:image/jpeg;base64,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`;
	}

	ngAfterViewInit() {
		setTimeout(() => {
			// console.log(window.getComputedStyle(this.backgroundImageHolder.nativeElement)['background-image']);
            var src = window.getComputedStyle(this.backgroundImageHolder.nativeElement)['background-image'];
            
			if (!src) {
				this.backgroundImageLoading = false;
				this.loading = this.backgroundImageLoading || this.dataLoading;
			}
			var url = src.match(/\((.*?)\)/)[1].replace(/('|")/g,'');

			if (!url) {
				this.backgroundImageLoading = false;
				this.loading = this.backgroundImageLoading || this.dataLoading;
			}

			var img = new Image();

			img.onload = () => {
			    this.backgroundImageLoading = false;
				this.loading = this.backgroundImageLoading || this.dataLoading;
			};

			setTimeout(() => {
				this.backgroundImageLoading = false;
				this.loading = this.backgroundImageLoading || this.dataLoading;
			}, 3 * 1000);

			img.src = url;
			// if (img.complete) {img.onload();}
		}, 1);
		
		var promises = [];

		this.header1 = 'SAMANTHAMINK';
		this.header2 = 'BODYOFWORK';

		// promises.push(firebase.database().ref('prod/header1').once('value').then(header1Snapshot => {
		// 	if (header1Snapshot.exists()) {
		// 		this.header1 = header1Snapshot.val();
		// 	} else {
        //         console.error("no header1 found");
		// 	}
		// }));

		// promises.push(firebase.database().ref('prod/header2').once('value').then(header2Snapshot => {
		// 	if (header2Snapshot.exists()) {
		// 		this.header2 = header2Snapshot.val();
		// 	} else {
		// 		console.error("no header2 found");
		// 	}
		// }));

		promises.push(firebase.database().ref('prod').once('value').then(appSnapshot => {
			if (!appSnapshot.exists()) {
				console.error("Unexpected error. AppSnapshot missing");
				// M.toast({html: "Unexpected error", displayLength: 1250});
				return;
			}

			const app =  appSnapshot.val();
			console.log(app);

			var urls = app.projects;
			var footerUrls = app.footers;

			this.urls = [];
			this.footerUrls = [];

			if (urls && urls.length) {
				for (var i = 0; i < urls.length; i++) {
					this.urls.push({width: 0, text: urls[i].text, href: urls[i].href});
				}
			}

			if (footerUrls && footerUrls.length) {
				for (var i = 0; i < footerUrls.length; i++) {
					this.footerUrls.push({width: 0, text: footerUrls[i].text, href: footerUrls[i].href});
				}
			}
		}));

		Promise.all(promises).then(() => {
			this.showPoem = false;

			this.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
			this.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

			this.mode = '';
			this.modeTimeout = setTimeout(() => {
                this.mode = 'light';
                this.showOthers = false;
			}, 1000);

			this.maxUrls = 6;

			this.urlRows = [[]];

			// this.loading = false;
			this.dataLoading = false;
			this.loading = this.backgroundImageLoading || this.dataLoading;

			setTimeout(() => {
				this.getLinksContainerWidth();
	        	this.alignUrls();
	        	setTimeout(() => {
		       		this.recalcEvertyhing();
		    	}, 1);
			}, 1);

			this.toggleModeTimeout = setTimeout(() => {
				this.toggleMode();
			}, 10000);
		});
	}

	toggleMode() {
		clearTimeout(this.modeTimeout);
		clearTimeout(this.toggleModeTimeout);

		if (this.mode === 'light') {
			this.mode = '';
			this.modeTimeout = setTimeout(() => {
				this.mode = 'dark';
				setTimeout(() => {
		       		this.recalcEvertyhing();
				}, 1);
				
				this.modeTimeout = setTimeout(() => {
					if (this.mode === 'dark') {
						this.showOthers = true;
						setTimeout(() => {
				       		this.recalcEvertyhing();
				    	}, 1);
					}
				}, 2000);
			}, 500);
		} else {
			this.mode = '';
			this.showPoem = true;

			this.modeTimeout = setTimeout(() => {
				this.mode = 'light';
				this.showOthers = false;
			}, 1000);
		}
	}

	getLinksContainerWidth() {
		if (this.linksContainer && this.linksContainer.nativeElement) {
			this.urlFontSize = parseFloat(window.getComputedStyle(this.linksContainer.nativeElement).fontSize) || 9.33;
			this.urlsMaxWidth = this.linksContainer.nativeElement.getBoundingClientRect().width;
		}
	}

	alignUrls() {
		var y = 0;

		var width = this.urlsMaxWidth;

		var i = 0;
		var count = 0;

		var topWidth = 0;

		this.urlRows = [];

		this.urlRows.push([]);

		var margin = 0;

		while (i < this.urls.length) {
			// console.log(width);

			if (y === 0) {
				margin = this.urlFontSize * 2;
			} else {
				margin = (this.urlsMaxWidth - topWidth) / (this.urlRows[0].length - 1);
			}

			var url = this.urls[i];

			// console.log(url.width);

			if ((y > 0 || count < this.maxUrls) && url.width < width) {
				url.margin = margin;
				this.urlRows[y].push(url);
				width -= url.width + margin;

				if (y === 0) {
					topWidth += url.width;
				} else {
					url.marginRight = topWidth;
				}

				i += 1;
				count += 1;
			} else {
				if (width === this.urlsMaxWidth) {
					url.margin = margin;
					this.urlRows[y].push(url);

					if (y === 0) {
						topWidth += url.width
					} else {
						url.marginRight = topWidth;
					}

					i += 1;
					count += 1;
				}

				width = this.urlsMaxWidth;
				this.urlRows.push([]);
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

	ptToPx(pt: number) {
    	return pt * 96 / 72;
    }

    pxToPt(px: number) {
    	return px * 72 / 96;
    }

    getActive(el: any) {
    	el.classList.add("active");
    }

    getNotActive(el: any) {
    	el.classList.remove("active");
    }

    recalcEvertyhing() {
    	if (this.loading) {
    		return;
    	}

    	this.getLinksContainerWidth();
        this.alignUrls();

        this.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		this.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }

    firebasePasswordLogin() {
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

	firebaseRequestPasswordReset() {
		if (this.authPending) {
			M.toast({html: 'Please wait', displayLength: 1250});
			return;
		}

		this.authPending = true;

		var emailAddress = this.email;//"mark.thompson@smpl.company";
		// var emailAddress = "sam@samanthamink.com";

		let url = window.location.protocol + "//" + window.location.hostname;

		if (url === 'http://localhost') {
			url += ":" + window.location.port;
		}

		console.log(url);

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

	authHandler() {
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

	logUserOut() {
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

	setActiveManagementOption(option) {
		this.activeManagementOption = option;
	}

	insertProject(index: number) {
		this.urls.splice(index + 1, 0, [{width: 0, text: "", href: ""}]);
		M.toast({html: `New project added, #${index + 2}`, displayLength: 1250});

	}

	removeProject(index: number) {
		const url = this.urls[index];

		const urlIsEmpty = !url.text || !url.href;

		if (urlIsEmpty || confirm(`Are you sure you want to remove the project "${url.text}"?`)) {
			console.log(this.urls[index]);
			this.urls.splice(index, 1);

			if (url.text) {
				M.toast({html: `Project ${url.text} was removed`, displayLength: 1250});
			} else if (url.href) {
				M.toast({html: `Project #${index + 1} was removed`, displayLength: 1250});
			}

		}
	}

	toggleShowManagement() {
		clearTimeout(this.toggleModeTimeout);
		this.showManagement = !this.showManagement;

		setTimeout(() => {
			this.getLinksContainerWidth();
			this.alignUrls();
			setTimeout(() => {
				   this.recalcEvertyhing();
			}, 1);
		}, 1);
	}

	save() {
		if (this.saving) {
			M.toast({html: 'Please wait', displayLength: 1250});
			return;
		}

		if (!confirm(`Are you sure you want to save? You can hide/show to preview your changes before saving.`)) {
			return;
		}

		let warningMessage = "";
		let warningCount = 0;

		for (let i = 0; i < this.urls.length; i++) {
			const url = this.urls[i];

			if (this.isEmptyProject(url.text)) {
				warningMessage = warningMessage || `Project #${i + 1} appears to have no name.`;
				warningCount += 1;
			}

			if (this.isInvalidUrl(url.href)) {
				warningMessage = warningMessage || `Project #${i + 1}, "${url.text}" appears to have an invalid url.`;
				warningCount += 1;
			}
		}

		for (let i = 0; i < this.footerUrls.length; i++) {
			const url = this.footerUrls[i];

			if (this.isEmptyProject(url.text)) {
				warningMessage = warningMessage || `Footer item #${i + 1} appears to have no name.`;
				warningCount += 1;
			}

			if (this.isInvalidUrl(url.href)) {
				warningMessage = warningMessage || `Footer item #${i + 1}, "${url.text}" appears to have an invalid url.`;
				warningCount += 1;
			}
		}

		console.log(warningCount);

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

		const projects = [];
		const footers = [];

		const app = {
			projects: projects,
			footers: footers
		};

		if (this.urls && this.urls.length) {
			for (var i = 0; i < this.urls.length; i++) {
				projects.push({text: this.urls[i].text, href: this.urls[i].href});
			}
		}

		if (this.footerUrls && this.footerUrls.length) {
			for (var i = 0; i < this.footerUrls.length; i++) {
				footers.push({text: this.footerUrls[i].text, href: this.footerUrls[i].href});
			}
		}

		return firebase.database().ref('prod').set(app).then(() => {
			return firebase.database().ref(`timestamps/${Date.now()}`).set(app);
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
    onResize() {
    	// '{
    	setTimeout(() => {
       		this.recalcEvertyhing();
       	}, 1);
    }

    @HostListener('window:orientationchange')
    onOrientationChange() {
    	// '{
    	setTimeout(() => {
       		this.recalcEvertyhing();
    	}, 1);
    }

    // Class stuff
    hasClass(el: any, name: string) {
        return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
    }

    addClass(el: any, name: string) {
        if (!this.hasClass(el, name)) {
            el.className = el.className ? [el.className, name].join(' ') : name;
        }
    }

    removeClass(el: any, name: string) {
        if (this.hasClass(el, name)) {
            el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
        }
    }
    // End Class stuff


 //    @HostListener('touchmove', ['$event'])
	// private onTouchMoveEvent(event:Event): void {
	// 	event.preventDefault();
	// }

	ngOnDestroy() {
		// destroy all the subscriptions at once
		// this.subs.unsubscribe();
	}
}
