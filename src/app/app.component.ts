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
    // templateUrl: './app-test.component.html',
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

	exampleText: string = "How now brown cow?\\sSAMANTHAMINK\\nBODYOFWORK";

	// For testing
	href: string = "https://www.ucdavis.edu/sites/default/files/styles/panopoly_image_full/public/home-site/blogs/one-health/blog-posts/2018/cow-field-one-health-uc-davis.jpg?itok=lrz5mpyq";
	// End For testing

	slideshow: boolean;
	showSlideshow: boolean;
	slideshowAnimate: boolean;
	slideshowAnimateTimeout: any;

	selectedFont: string;

	test: boolean;

	desc: string;

	imageIndex: number;
	imageUrls: string[];

	hMargin: number;
	wMargin: number;

	showBackground: boolean;

	constructor(private dragulaService: DragulaService, private ngZone: NgZone) {
	}

	ngOnInit() {
		this.hMargin = 100;
		this.wMargin = 100;
		// this.test = true;

		this.imageUrls = [];
		
		this.imageUrls.push('https://i.imgur.com/NloZest.jpg');
		this.imageUrls.push('https://i.imgur.com/8KgWsBu.jpg');
		this.imageUrls.push('https://i.imgur.com/RlHH0i2.jpg');
		this.imageUrls.push('https://i.imgur.com/4B3KsX2.jpg');
		
		this.imageUrls.push('https://i.imgur.com/NloZest.jpg');
		this.imageUrls.push('https://i.imgur.com/8KgWsBu.jpg');
		this.imageUrls.push('https://i.ytimg.com/vi/4eoM26ZmHd0/maxresdefault.jpg');
		this.imageUrls.push('https://i.ytimg.com/vi/eq7Adzo4QAE/maxresdefault.jpg');
		this.imageUrls.push('https://i.ibb.co/5hD9d3W/IMG-5066.jpg');
		this.imageUrls.push(this.href);

		this.imageIndex = 0;

		this.desc = `Lorem ipsum dolor amet coloring book helvetica blue bottle, taxidermy aesthetic four loko gluten-free messenger bag direct trade photo booth. Four loko taxidermy disrupt raw denim mixtape pabst, selvage fashion axe meditation cardigan. Keytar hammock 90's, adaptogen deep v green juice mixtape plaid cronut live-edge farm-to-table. Copper mug gentrify tote bag, enamel pin taxidermy pug air plant ennui mumblecore flannel keytar kickstarter. Lyft marfa photo booth tofu.

		Four dollar toast VHS jianbing biodiesel irony lyft tousled hashtag bespoke. Try-hard skateboard tilde drinking vinegar cloud bread copper mug twee mlkshk yr quinoa pinterest man bun. Activated charcoal heirloom health goth portland artisan jianbing subway tile DIY. Banh mi sustainable mumblecore echo park offal disrupt vape williamsburg butcher poutine next level direct trade kitsch craft beer semiotics. Tacos single-origin coffee leggings PBR&B selfies swag banjo dreamcatcher twee hashtag artisan umami.
		
		Put a bird on it health goth palo santo twee plaid helvetica. Forage offal sriracha blue bottle hammock edison bulb post-ironic raclette fanny pack succulents copper mug skateboard. Keffiyeh lo-fi gastropub art party pour-over messenger bag wayfarers waistcoat live-edge cred pok pok fingerstache. Plaid try-hard kickstarter cray food truck chillwave affogato hoodie prism artisan tumblr skateboard fam yuccie. Chia bushwick meditation, vaporware shabby chic live-edge you probably haven't heard of them. Chicharrones cardigan disrupt succulents. Tousled gastropub yr shaman, waistcoat chicharrones meh iPhone.
		
		Subway tile portland raw denim, authentic thundercats gochujang pitchfork intelligentsia. Cloud bread vaporware paleo blog biodiesel, 8-bit wolf letterpress mustache YOLO jean shorts. Hella succulents banh mi roof party pop-up kickstarter 90's, affogato austin cold-pressed gastropub. Lumbersexual la croix seitan, church-key meditation occupy blue bottle drinking vinegar four loko subway tile skateboard. Readymade roof party offal, man bun brooklyn jean shorts la croix unicorn.`;
		
		(window as any).app = this;
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
	}

	nextImage() {
		this.imageIndex += 1;
		if (this.imageIndex > this.imageUrls.length - 1) {
			this.imageIndex = 0;
		}
	}

	backImage() {
		this.imageIndex -= 1;
		if (this.imageIndex < 0) {
			this.imageIndex = this.imageUrls.length - 1;
		}
	}

	toggleSlideshow(event?: Event) {
		console.log('toggleSlideshow');
		if (this.mode === 'light') {
			this.toggleMode();
		}

		this.slideshow = !this.slideshow;
		if (this.slideshow) {
			this.imageIndex = 0;
			this.slideshowAnimate = true;
			clearTimeout(this.slideshowAnimateTimeout);
			this.slideshowAnimateTimeout = setTimeout(() => {
				this.slideshowAnimate = false;
				this.showSlideshow = true;
			}, 200);
		} else {
			this.showSlideshow = false;
			setTimeout(() => {
					this.recalcEvertyhing();
			}, 1);
			this.slideshowAnimate = true;
			clearTimeout(this.slideshowAnimateTimeout);
			this.slideshowAnimateTimeout = setTimeout(() => {
				this.slideshowAnimate = false;
			}, 600);
		}

		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	titleFunc(event: MouseEvent) {
		if (this.slideshow) {
			this.toggleSlideshow();
			event.preventDefault();
			event.stopPropagation();
		}
	}

	centerImageFunc(event: MouseEvent) {
		if (this.slideshow) {
			this.toggleSlideshow();
		} else {
			this.toggleMode();
		}
		
		event.preventDefault();
		event.stopPropagation();
	}

	ngAfterViewInit() {
		setTimeout(() => {
			if (!this.backgroundImageHolder || !this.backgroundImageHolder.nativeElement) {
				return;
			}

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

			this.maxUrls = 99;

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
				// this.toggleMode();
			}, 10000);
		});
	}

	toggleMode() {
		clearTimeout(this.modeTimeout);
		clearTimeout(this.toggleModeTimeout);

		if (this.mode === 'light') {
			if (this.slideshow) {
				this.toggleSlideshow();
			}

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
				margin = 50;//70;//this.urlFontSize * 9;
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

	toggleAdvancedProject(index: number) {
		this.urls[index].advanced = !this.urls[index].advanced;
	}

	setAdvanceEdit(index: number) {
		this.setActiveManagementOption('advancedEdit');
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
