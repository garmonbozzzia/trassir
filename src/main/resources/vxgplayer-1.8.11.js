window.vxgplayer = function(id, options){
	window.vxgplayer.version="1.8.11"; //version is updated by 'npm run build'
	window.vxgplayer.players = window.vxgplayer.players || {};

	if(!document.getElementById(id)){
		console.error(" Player with " + id + " did not found");
		return undefined;
	}

	if(!window.vxgplayer.players[id]){

		if(typeof chrome == "undefined"){
			vxgplayer.showAvailableInChrome(id);
			return undefined;
		}

		if(!vxgplayer.browserSupportsPluginPnacl()){
			console.log("Not installed vxg_media_player");
			vxgplayer.showNotInstalled(id);

			var fs = window.RequestFileSystem || window.webkitRequestFileSystem;
			if (fs) {
				fs(window.TEMPORARY,100,function(){},function(){ vxgplayer.showNotInstalledInIncognitoMode(id); });
			}
			return undefined;
		}

		// magic run app
		var fs = window.RequestFileSystem || window.webkitRequestFileSystem;
		if (!fs) {
  			//console.log("RequestFileSystem failed");
			window.location.href = "http://www.videoexpertsgroup.com/player_start/";
		} else {
  			fs(window.TEMPORARY, 1, function(){
			    //console.log("not in incognito mode");
			    if(!vxgplayer.isFrame()){
					//console.log("Start Chrome App");
					window.location.href = "http://www.videoexpertsgroup.com/player_start/";
				}
  			},
  			function(){
				console.log("Not installed vxg_media_player");
  			});
		}

		// check web socket server
		if(window.location.protocol != "https:" && !vxgplayer.isFrame()){
			vxgplayer.checkWebSocket().done(function(result){
				//console.log('websocket: success');
			}).fail(function(err){
				// check incognito mode
				fs(window.TEMPORARY,1,function(){ vxgplayer.showWebSocketFailed(id); },function(){ vxgplayer.showNotStartedInIncognitoMode(id); });
			});
		}

		if(window.location.protocol != "https:" && vxgplayer.isFrame()){
			vxgplayer.checkWebSocket().done(function(result){
				//console.log('websocket: success');
			}).fail(function(err){
				vxgplayer.showNotStartedInIFrame(id);
			});
		}

		//window.location.href = "http://videoexpertsgroup.com/player_start/";
		window.vxgplayer.players[id] = new function(id, options){
			var self = this;
			self.id = id;
			self.player = document.getElementById(id);
			options = options || {};
			//console.log(options);
			var nmf_path = "media_player.nmf";
			var nmf_src = "pnacl/Release/media_player.nmf";
			var url = "";
			self.playerWidth=options.width || 640;
			self.playerHeight=options.height || 480;

			nmf_path = self.player.getAttribute('nmf-path') || options.nmf_path || nmf_path;
			nmf_src = self.player.getAttribute('nmf-src') || options.nmf_src || nmf_src;
			url = self.player.getAttribute('url') || options.url || "";
			self.playerWidth = parseInt(self.player.getAttribute('width'),10) || self.playerWidth;
			self.playerHeight = parseInt(self.player.getAttribute('height'),10) || self.playerHeight;
			self.player.style.width = self.playerWidth + 'px';
			self.player.style.height = self.playerHeight + 'px';

			var autostart_parameter = self.player.hasAttribute('autostart') ? '1' : '0';
			var audio_parameter = (self.player.hasAttribute('audio') && parseInt(self.player.getAttribute('audio', 10)) == 0) ? '0' : '1';
			var mute_parameter = (self.player.hasAttribute('mute') && parseInt(self.player.getAttribute('mute', 10)) == 1) ? '1' : '0';
			var html = ''
				+ '<div class="vxgplayer-loader" style="display: inline-block"></div>'
				+ '<div class="vxgplayer-screenshot-loading" style="display: none">'
				+ '		<div class="vxgplayer-screenshot-loading">'
				+ '     </div>'
				+ '</div>'
				+ '<div class="vxgplayer-error" style="display: none">'
				+ '	<div class="vxgplayer-error-text" style="display: none"></div>'
				+ '</div>'
				+ '<div class="vxgplayer-controls-zoom-position">'
				+ '		<div class="vxgplayer-zoom-position-cursor"></div>'
				+ '</div>'
				+ '<div class="vxgplayer-controls-zoom">'
				+ '	<div class="vxgplayer-zoom-up"></div>'
				+ '	<div class="vxgplayer-zoom-progress zoom10x"></div>'
				+ '	<div class="vxgplayer-zoom-down"></div>'
				+ '</div>'
				+ '<div class="vxgplayer-controls">'
				+ '	<div class="vxgplayer-volume-mute"></div>'
				+ '	<div class="vxgplayer-volume-down"></div>'
				+ '	<div class="vxgplayer-volume-progress vol7"></div>'
				+ '	<div class="vxgplayer-volume-up"></div>'
				+ '	<div class="vxgplayer-play"></div>'
				+ '	<div class="vxgplayer-stop" style="display: none"></div>'
				+'	<div class="vxgplayer-fullscreen"></div>'
				+'	<div class="vxgplayer-takescreenshot"></div>'
				+'	<div class="vxgplayer-scale"></div>'
				+ '</div>'
				+ '<embed class="vxgplayer-module" style="transform: scale(1); z-index: -1;" autostart_parameter="' + autostart_parameter + '"mute_parameter="' + mute_parameter + '"audio_parameter="' + audio_parameter + '" name="nacl_module" id="' + id + '_nacl_module" path="' + nmf_path + '" src="' + nmf_src + '" url="' + url + '" type="application/x-pnacl">';

			self.player.innerHTML = html;

			var el_controls = self.player.getElementsByClassName('vxgplayer-controls')[0];
			var el_controls_zoom = self.player.getElementsByClassName('vxgplayer-controls-zoom')[0];
			var el_controls_zoom_position = self.player.getElementsByClassName('vxgplayer-controls-zoom-position')[0];
			var el_play = self.player.getElementsByClassName('vxgplayer-play')[0];
			var el_stop = self.player.getElementsByClassName('vxgplayer-stop')[0];
			var el_volumeMute = self.player.getElementsByClassName('vxgplayer-volume-mute')[0];
			var el_volumeDown = self.player.getElementsByClassName('vxgplayer-volume-down')[0];
			var el_volumeProgress = self.player.getElementsByClassName('vxgplayer-volume-progress')[0];
			var el_volumeUp = self.player.getElementsByClassName('vxgplayer-volume-up')[0];
			var el_fullscreen = self.player.getElementsByClassName('vxgplayer-fullscreen')[0];
			var el_takescreenshot = self.player.getElementsByClassName('vxgplayer-takescreenshot')[0];
			var el_screenshot_loading = self.player.getElementsByClassName('vxgplayer-screenshot-loading')[0];
			var el_scale = self.player.getElementsByClassName('vxgplayer-scale')[0];
			var el_zoomUp = self.player.getElementsByClassName('vxgplayer-zoom-up')[0];
			var el_zoomDown = self.player.getElementsByClassName('vxgplayer-zoom-down')[0];
			var el_zoomProgress = self.player.getElementsByClassName('vxgplayer-zoom-progress')[0];
			var el_zoomPositionCursor = self.player.getElementsByClassName('vxgplayer-zoom-position-cursor')[0];
			var el_loader = self.player.getElementsByClassName('vxgplayer-loader')[0];
			var el_error = self.player.getElementsByClassName('vxgplayer-error')[0];
			var el_error_text = self.player.getElementsByClassName('vxgplayer-error-text')[0];
			var el_btnstart = document.getElementById(id + '_btnstart');
			self.module = document.getElementById(id + '_nacl_module');
			self.module.command = function(){
				var cmd = [];
				for(var i = 0; i < arguments.length; i++){
					cmd.push(arguments[i]);
				}
				if(id != self.id || self.id + '_nacl_module' != self.module.id){
					console.error("Mixed player id");
				}
				
				if(self.module.debug){
					console.log('Player: ' + self.id + ' cmd=[' + cmd.join('] '));
				}
				self.module.postMessage(cmd);
				// self.module.postMessage(arguments);
			}

			// Request the offsetTop property to force a relayout. As of Apr 10, 2014    
			// this is needed if the module is being loaded on a Chrome App's    
			// background page (see crbug.com/350445).    
			self.module.offsetTop;
			
			self.module.versionapp = "unknown";
			self.module.url = url || "";
			self.module.debug = options.debug || self.player.hasAttribute('debug') || false;
			self.module.autostart = self.player.hasAttribute('autostart');
			self.module.is_opened = false;
			self.module.latency = 10000;
			self.module.controls = true;
			self.module.avsync = options.avsync || false;
			self.module.volume = options.volume || 0.7;
			self.module.vxgReadyState = 0;
			self.module.autohide = options.autohide || 2000;
			self.module.lastErrorCode = -1;
			self.module.lastErrorDecoder = 0;
			self.module.autoreconnect = options.autoreconnect || 0;
			self.module.connection_timeout = options.connection_timeout || 0;
			self.module.connection_udp = options.connection_udp || 0;
			self.module.isCustomDigitalZoom = options.custom_digital_zoom || false;

			self.options = options;
			self.currentZoom = 10;
			self.module.snapshotFile = "";

			if(self.module.debug){
				console.log("Player " + self.id + " - init new player");
			}

			self.set_controls_opacity = function(val){
				el_controls.style.opacity = val;
				el_controls_zoom.style.opacity = val;
				el_controls_zoom_position.style.opacity = val;
			}
			
			self.set_controls_display = function(val){
				el_controls.style.display = val;
				if(self.module.isCustomDigitalZoom == true){
					el_controls_zoom.style.display = "none";
					el_controls_zoom_position.style.display = "none";
				}else{
					el_controls_zoom.style.display = val;
					el_controls_zoom_position.style.display = self.currentZoom == 10 ? "none" : "";
				}
			}
			if(self.module.isCustomDigitalZoom == false){
				el_controls_zoom_position.style.display = self.currentZoom == 10 ? "none" : "";
			}

			if(self.player.hasAttribute('custom-digital-zoom')){
				self.module.isCustomDigitalZoom = true;
				el_controls_zoom.style.display = "none";
				el_controls_zoom_position.style.display = "none";
			}

			if(!self.player.hasAttribute('controls')){
				self.module.controls = false;
				self.set_controls_display("none");
			}
			
			if(options.controls && options.controls == true){
				self.module.controls = true;
				self.set_controls_display("");
			}

			self.module.avsync = self.player.hasAttribute('avsync');
			self.module.aspectRatio = (self.player.hasAttribute('aspect-ratio') || self.player.hasAttribute('aspect-ratio-mode'))?1:0;

			if(self.player.hasAttribute('volume')){
				self.module.volume = parseFloat(self.player.getAttribute('volume'));
				self.module.volume = Math.ceil(self.module.volume*10)/10;
				//self.module.command('setvolume', self.module.volume.toFixed(1));
			}else if(options.volume){
				console.warn("TODO volume");
			}

			self.module.mute = options.mute || self.module.volume == 0 || mute_parameter == '1';
			if(self.module.mute){
				el_volumeDown.style.display='none';
				el_volumeProgress.style.display='none';
				el_volumeUp.style.display='none';
			}
			
			if(self.player.hasAttribute('autohide')){
				self.module.autohide = parseInt(self.player.getAttribute('autohide'),10)*1000;
			}else if(options.autohide){
				self.module.autohide = options.autohide*1000;
			}
			
/* moved to loadSettings
			if(self.player.hasAttribute('useragent-prefix')){
				self.module.command('setuseragent', self.player.getAttribute('useragent-prefix') + ' ' + navigator.userAgent)
			}else if(options.useragent_prefix){
				self.module.command('setuseragent', options.useragent_prefix + ' ' + navigator.userAgent)
			}
			self.module.command('setversion', window.vxgplayer.version);
			//self.module.autoreconnect = 0;
			if(self.player.hasAttribute('auto-reconnect') || options.autoreconnect){
				self.module.autoreconnect = 1;
				self.module.command('setautoreconnect', '1');	
			}
			self.module.avsync = self.player.hasAttribute('avsync');
			self.module.aspectRatio = (self.player.hasAttribute('aspect-ratio') || self.player.hasAttribute('aspect-ratio-mode'))?1:0;

			if(self.player.hasAttribute('aspect-ratio-mode')){
				self.module.aspectRatio = parseInt(self.player.getAttribute('aspect-ratio-mode'), 10);
			}else if(options.aspect_ratio_mode){
				self.module.aspectRatio = options.aspect_ratio_mode;
			}
			self.module.aspectRatioMode = (self.module.aspectRatio !=0) ? self.module.aspectRatio:1;
			self.module.command('setaspectratio', self.module.aspectRatio.toString());
			self.module.command('setavsync', self.module.avsync ? '1' : '0');
			if(self.player.hasAttribute('latency')){
				self.module.latency = parseInt(self.player.getAttribute('latency'), 10);
				self.module.command('setlatency', self.module.latency.toString());
			}else if(options.latency){
				self.module.latency = options.latency;
				self.module.command('setlatency', self.module.latency.toString());
			}
			
			if(self.player.hasAttribute('volume')){
				self.module.volume = parseFloat(self.player.getAttribute('volume'));
				self.module.volume = Math.ceil(self.module.volume*10)/10;
				self.module.command('setvolume', self.module.volume.toFixed(1));
			}else if(options.volume){
				console.warn("TODO volume");
			}

			self.module.mute = options.mute || self.module.volume == 0;
			if(self.module.mute){
				el_volumeDown.style.display='none';
				el_volumeProgress.style.display='none';
				el_volumeUp.style.display='none';
			}

			if(self.player.hasAttribute('autohide')){
				self.module.autohide = parseInt(self.player.getAttribute('autohide'),10)*1000;
			}else if(options.autohide){
				self.module.autohide = options.autohide*1000;
			}*/
			self.timeout = undefined;
			el_volumeProgress.className = el_volumeProgress.className.replace(/vol\d+/g,'vol' + Math.ceil(self.module.volume*10));

			self.loadSettings = function(){

				if(self.module.debug){
					console.log('Player ' + self.id + ' - loadSettings');
				}

				if(self.player.hasAttribute('useragent-prefix')){
					self.module.command('setuseragent', self.player.getAttribute('useragent-prefix') + ' ' + navigator.userAgent)
				}else if(options.useragent_prefix){
					self.module.command('setuseragent', self.options.useragent_prefix + ' ' + navigator.userAgent)
				}
				self.module.command('setversion', window.vxgplayer.version);
				//self.module.autoreconnect = 0;
				if(self.player.hasAttribute('auto-reconnect') || self.options.autoreconnect){
					self.module.autoreconnect = 1;
					self.module.command('setautoreconnect', '1');	
				}
				if(self.player.hasAttribute('connection-timeout')){
					self.module.connection_timeout = parseInt(self.player.getAttribute('connection-timeout'), 10);
				}
				if(self.options.connection_timeout != 0){
					self.module.command('setconnection_timeout', self.module.connection_timeout.toString());	
				}
				if(self.player.hasAttribute('connection-udp') || self.module.connection_udp){
					self.module.connection_udp = 1;
					self.module.command('setconnection_udp', '1');	
				}

				self.module.avsync = self.player.hasAttribute('avsync');
				self.module.aspectRatio = (self.player.hasAttribute('aspect-ratio') || self.player.hasAttribute('aspect-ratio-mode'))?1:0;

				if(self.player.hasAttribute('aspect-ratio-mode')){
					self.module.aspectRatio = parseInt(self.player.getAttribute('aspect-ratio-mode'), 10);
				}else if(self.options.aspect_ratio_mode){
					self.module.aspectRatio = self.options.aspect_ratio_mode;
				}
				self.module.aspectRatioMode = (self.module.aspectRatio !=0) ? self.module.aspectRatio:1;
				self.module.command('setaspectratio', self.module.aspectRatio.toString());
				self.module.command('setavsync', self.module.avsync ? '1' : '0');
				if(self.player.hasAttribute('latency')){
					self.module.latency = parseInt(self.player.getAttribute('latency'), 10);
					self.module.command('setlatency', self.module.latency.toString());
				}else if(self.options.latency){
					self.module.latency = self.options.latency;
					self.module.command('setlatency', self.module.latency.toString());
				}
			
				if(self.player.hasAttribute('volume')){
					self.module.volume = parseFloat(self.player.getAttribute('volume'));
					self.module.volume = Math.ceil(self.module.volume*10)/10;
					self.module.command('setvolume', self.module.volume.toFixed(1));
				}else if(self.options.volume){
					console.warn("TODO volume");
				}

				self.module.mute = self.options.mute || self.module.volume == 0;
				if(self.module.mute){
					el_volumeDown.style.display='none';
					el_volumeProgress.style.display='none';
					el_volumeUp.style.display='none';
				}

				if(self.player.hasAttribute('autohide')){
					self.module.autohide = parseInt(self.player.getAttribute('autohide'),10)*1000;
				}else if(self.options.autohide){
					self.module.autohide = self.options.autohide*1000;
				}
			}
			
			self.moduleDidLoad = function(){
				if(self.module.debug){
					console.log('Player ' + self.id + ' - moduleDidLoad');
				}

				self.loadSettings();
				
				if(window.location.protocol == "https:"){
					//use Native protocol
					self.connectToApp();
				}else{
					//use Websocket protocol
					self.module.command('startwebsclient', vxgplayer.webserverport)
				}
			}
			self.playerDidLoad = function(){
				if(self.module.debug){
					console.log('Player ' + self.id + " - playerDidLoad");
				}
				el_loader.style.display = "none";
				if(self.onReadyStateCallback){
					self.module.is_opened = false;
					self.onReadyStateCallback();
				}else{
					self.src(self.module.url);
				}
			}

			self.connectToApp = function(){
				if(self.module.debug){
					console.log('Player ' + self.id + ' connectToApp');
				}
				self.module.port = chrome.runtime.connect("hncknjnnbahamgpjoafdebabmoamcnni");
				//self.module.port = chrome.runtime.connect("invalid");
				if(self.module.debug){
					console.log('Player ' + self.id + ' connected port='+self.module.port);
				}
				self.module.port.name = ""+ new Date().getTime();

				self.module.port.onDisconnect.addListener(function(){
					if(self.module.debug)
						console.log('disconnected port.name='+self.module.port.name);
					self.module.command( 'stopnativeclient', '@'+self.module.port.name);

					self.module.port = undefined;
				});

				if(self.module.debug)
					console.log('connected port.name=' + self.module.port.name);

				self.module.port.onMessage.addListener(function(msg) {
					if( msg != undefined && msg.id == undefined && msg[0].charAt(0) == '@'){
						self.module.postMessage(msg);
					}else
					if( msg != undefined && msg.cmd == 'getversionapp'){
						if(0 == msg.data.indexOf("VERSION_APP")){
							self.module.versionapp = msg.data.split(' ')[1];
							if(self.module.debug){
								console.log('Player ' + self.id + ' =VERSION_APP '+self.module.versionapp);
							}

							self.module.command( 'setappversion', self.module.versionapp);
							self.module.command( 'startnativeclient', '@'+self.module.port.name);
							self.playerDidLoad();
						}else{
							console.log('Player ' + self.id + ' Invalid VERSION_APP msg.data='+msg.data);
						}
					}else{
						console.log('Player ' + self.id + 'getversionapp unknown msg='+msg);
					}
				});
				self.module.port.postMessage({id: "" + self.module.port.name, cmd: "getversionapp", data: ""} );

			}

			self.showerror = function(text){
				el_loader.style.display = "none";
				el_error.style.display = "inline-block";
				el_error_text.style.display = "inline-block";
				el_error_text.innerHTML = text;
			}
			
			self.hideerror = function(text){
				el_error.style.display = "none";
				el_error_text.style.display = "none";
			}

			self.readyState = function(){
				return self.module.vxgReadyState;
			}

			self.onReadyStateChange = function(cb){
				self.onReadyStateCallback = cb;
			}
			self.ready = self.onReadyStateChange;

			self.onStateChange = function(cb){
				self.onStateChangeCallback = cb;
			}
			
			self.onBandwidthError = function(cb){
				self.module.handlerBandwidthError = cb;
			}

			self.onError = function(cb){
				self.module.handlerError = cb;
			}

			self.handleMessage = function(msgEvent){
				if(self.module.debug){
					console.log('Player ' + self.id + ' handleMessage: ' + msgEvent.data);
				}
				if(msgEvent == undefined || msgEvent.data == undefined)
					return;
				if(msgEvent.data[0].charAt(0) == '@'){
					//proto native send to app
					if(self.module.port != undefined)
						self.module.port.postMessage(msgEvent.data);
				}else if(0 == msgEvent.data.indexOf("PLAYER_INITED")){
					self.moduleDidLoad();
				}else if(0 == msgEvent.data.indexOf("PLAYER_INIT_ERR")){
					str = "PLAYER_INIT_ERR ";
					err = parseInt(msgEvent.data.split(' ')[1], 10);
					err_type = (err >> 16)&0xffff;
					console.log('err_type='+err_type);
					switch(err_type){
					case 4:	
						str += "Init audio output error ";		
						break;
					case 2:	
						str += "Init video decoder error ";		
						break;
					default:
						str += "Init D3D error ";		
						break;
					}
					str += ""+err.toString();
					vxgplayer.showInitFailed(id, str);
				}else

				// Player source error=60935 WSS status=6
				// Player listener2: Skip picture: 170, frame_duration: 41, latencyms: 0<=frames_buf:0, b: 0, p: 0
				if(0 == msgEvent.data.indexOf("VERSION_APP")){
					self.module.versionapp = msgEvent.data.split(' ')[1];
					if(self.module.debug)
						console.log('=VERSION_APP '+self.module.versionapp);
					self.playerDidLoad();
				}else if(0 == msgEvent.data.indexOf("TAKE_SNAPSHOT")){
					snap_status = msgEvent.data.split(' ')[1];
					if(0 != snap_status.indexOf("ERROR")){
						self.module.snapshotFile = snap_status;
						window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
						window.requestFileSystem(window.TEMPORARY, 1, function(fs) {
							fs.root.getFile(self.module.snapshotFile, {create: false}, function(fileEntry) { // /test is filename
								var pom = document.createElement('a');
								pom.setAttribute('href', fileEntry.toURL());
								pom.setAttribute('download', "snapshot.jpg");
								pom.style.display = 'none';
								document.body.appendChild(pom);
								pom.click();
								document.body.removeChild(pom);
							}, function(e) {
								console.error("[VXGPLAYER] TAKE_SNAPSHOT fs.root.getFile FAILED")
							});
						}, function(e) {
							console.error("[VXGPLAYER] TAKE_SNAPSHOT requestFileSystem window.TEMPORARY FAILED")
						});
					}
				}else if(msgEvent.data == "MEDIA_ERR_URL"){
					self.showerror('Problem with URL');
					self.module.lastErrorCode = 0;
					if(self.module.handlerError)
						self.module.handlerError(self);
				}else if(0 == msgEvent.data.indexOf("MEDIA_ERR_NETWORK")){
					self.showerror('Problem with network');
					self.module.lastErrorCode = 1;
					if(self.module.handlerError)
						self.module.handlerError(self);
				}else if(0 == msgEvent.data.indexOf("MEDIA_ERR_SOURCE")){
					self.showerror('Problem with source');
					self.module.lastErrorCode = 2;
					if(self.module.handlerError)
						self.module.handlerError(self);
				}else if(0 == msgEvent.data.indexOf("MEDIA_ERR_CARRIER")){
					self.showerror('Problem with carrier');
					self.module.lastErrorCode = 3;
					if(self.module.handlerError)
						self.module.handlerError(self);
				}else if(0 == msgEvent.data.indexOf("MEDIA_ERR_AUDIO")){
					self.showerror('Problem with audio');
					self.module.lastErrorCode = 4;
					if(self.module.handlerError)
						self.module.handlerError(self);
				}else if(0 == msgEvent.data.indexOf("MEDIA_ERR_VIDEO")){
					self.showerror('Problem with video');
					self.module.lastErrorCode = 5;
					if(self.module.handlerError)
						self.module.handlerError(self);
				}else if(0 == msgEvent.data.indexOf("MEDIA_ERR_AUTHENTICATION")){
					self.showerror('Problem with authentification');
					self.module.lastErrorCode = 6;
					if(self.module.handlerError)
						self.module.handlerError(self);
				}else if(0 == msgEvent.data.indexOf("MEDIA_ERR_BANDWIDTH")){
					//self.stop();
					self.module.lastErrorCode = 7;
					if(self.module.handlerError)
						self.module.handlerError(self);
					if(self.module.handlerBandwidthError){
						self.module.handlerBandwidthError(self);
					}else{
						//self.showerror('Problem with bandwidth');
					}
				}else if(0 == msgEvent.data.indexOf("MEDIA_ERR_EOF")){
					self.showerror('End of File');
					self.module.lastErrorCode = 8;
					if(self.module.handlerError)
						self.module.handlerError(self);
				}else if(0 == msgEvent.data.indexOf("MEDIA_ERR_DECODER")){
					var arr = msgEvent.data.split(' ');
					self.module.lastErrorDecoder = (arr.length > 1) ? parseInt(arr[1],10) : 0;
					if(self.module.debug)
						console.log('=MEDIA_ERR_DECODER '+self.module.lastErrorDecoder + ' ' + (self.module.lastErrorDecoder == 0)?'Decoder resumed':'');
					if(self.module.lastErrorDecoder == 0){
						self.module.lastErrorCode = -1;
						//self.hideerror();
					}else{
						self.module.lastErrorCode = 9;
						//self.showerror('Decoder error '+self.module.lastErrorDecoder);
					}
					if(self.module.handlerError)
						self.module.handlerError(self);
					
				}else if(0 == msgEvent.data.indexOf("PLAYER_CONNECTING")){
					self.module.vxgReadyState = 1;
					//el_play.style.display = "none";
					// el_stop.style.display = "none";
					// self.hideerror();
					el_loader.style.display = "inline-block";
					el_takescreenshot.style.display = "none";
					if(self.onStateChangeCallback)
						self.onStateChangeCallback(self.module.vxgReadyState);
				}else if(0 == msgEvent.data.indexOf("PLAYER_PLAYING")){
					self.module.vxgReadyState = 2;
					el_play.style.display = "none";
					el_stop.style.display = "inline-block";
					el_takescreenshot.style.display = "inline-block";
					self.hideerror();
					el_loader.style.display = "none";
					if(self.onStateChangeCallback)
						self.onStateChangeCallback(self.module.vxgReadyState);
				}else if(0 == msgEvent.data.indexOf("PLAYER_STOPPING")){
					self.module.vxgReadyState = 3;
					// el_error.style.display = "none";
					// el_loader.style.display = "inline-block";
					el_play.style.display = "none";
					el_stop.style.display = "none";
					el_takescreenshot.style.display = "none";
				}else if(0 == msgEvent.data.indexOf("PLAYER_STOPPED")){
					self.module.vxgReadyState = 0;
					el_play.style.display = "inline-block";
					el_stop.style.display = "none";
					el_takescreenshot.style.display = "none";
					if(self.onStateChangeCallback)
						self.onStateChangeCallback(self.module.vxgReadyState);
				}
			}

			self.handleError = function(){
				el_loader.style.display = "none";
				el_error.style.display = "block";
				console.error("ERROR");
				self.showerror('Unknown error');
			}

			self.handleCrash = function(){
				el_loader.style.display = "none";
				el_error.style.display = "block";
				self.showerror('Crashed');
			}

			self.restartTimeout = function(){
				if(self.module.autohide <= 0){
					self.set_controls_opacity("0");
					return;
				}
				self.set_controls_opacity("0.7");
				clearTimeout(self.timeout);
				self.timeout = setTimeout(function(){
					self.set_controls_opacity("0");
				},self.module.autohide);
			};

			self.player.addEventListener('mousemove', function(){
				self.restartTimeout();
			}, true);

			self.restartTimeout();
			//self.module.addEventListener('load', self.moduleDidLoad, true);
			self.module.addEventListener('message', self.handleMessage, true);
			self.module.addEventListener('error', self.handleError, true);
			self.module.addEventListener('crash', self.handleCrash, true);

			if (typeof window.attachListeners !== 'undefined') {
			  window.attachListeners();
			}

			self.error = function(){
				return self.module.lastErrorCode;
			}
			self.errorDecoder = function(){
				return self.module.lastErrorDecoder;
			}

			self.controls = function(val){
				if(val == undefined){
					return self.module.controls;
				}else{
					if(val == true){
						self.set_controls_display("");
						self.module.controls = true;
					}else if(val == false){
						self.set_controls_display("none");
						self.module.controls = false;
					}
				}
			}

			self.debug = function(val){
				if(val == undefined){
					return self.module.debug;
				}else{
					self.module.debug = val;
				}			
			}

			self.play = function(){
				self.hideerror();

				if(self.module.debug)
					console.log( 'self.play self.module.url='+self.module.url + ' self.module.is_opened='+self.module.is_opened);

				if(self.module.url.length < 1){
					console.log("invalid url");
					return;
				}
				if(!self.module.is_opened){
					self.module.is_opened = true;
					self.module.command('open', self.module.url);
				}

				el_play.style.display = "none";
				el_loader.style.display = "inline-block";
				self.module.command('play', '0');
				self.module.command('setvolume', self.module.volume.toFixed(1));
			};

			self.stop = function(){
				self.module.command('stop', '0');
				el_loader.style.display = "none";
			};

			self.pause = function(){
				self.module.command('pause', '0');
				el_loader.style.display = "none";
			};
			
			self.autohide = function(val){
				if(val){
					self.module.autohide = val*1000;
				}else{
					return self.module.autohide/1000;
				}
			}

			self.autoreconnect = function(val){
				if(val == undefined){
					return self.module.autoreconnect;
				}else{
					self.module.autoreconnect = parseInt(val,10);
					self.module.command('setautoreconnect', self.module.autoreconnect.toString());
				}
			};


			self.latency = function(val){
				if(val){
					self.module.latency = parseInt(val,10);
					self.module.command('setlatency', val.toString());
				}else{
					return self.module.latency;
				}
			};
			self.connection_timeout = function(val){
				if(val){
					self.module.connection_timeout = parseInt(val,10);
					self.module.command('setconnection_timeout', val.toString());
				}else{
					return self.module.connection_timeout;
				}
			};
			self.connection_udp = function(val){
				if(val){
					self.module.connection_udp = parseInt(val,10);
					self.module.command('setconnection_udp', val.toString());
				}else{
					return self.module.connection_udp;
				}
			};

			self.aspectRatio = function(val){
				if(val == undefined){
					return self.module.aspectRatio?true:false;
				}else{
					self.module.aspectRatio = (val)?self.module.aspectRatioMode:0;
					self.module.command('setaspectratio', self.module.aspectRatio.toString());
				}
			}
			self.aspectRatioMode = function(val){
				if(val == undefined){
					return self.module.aspectRatioMode;
				}else{
					self.module.aspectRatioMode = (val > 0)?val:self.module.aspectRatioMode;
					self.module.aspectRatio = val;
					self.module.command('setaspectratio', self.module.aspectRatio.toString());
				}
			}
			
			self.avsync = function(val){
				if(val == undefined){
					return self.module.avsync;
				}else{
					self.module.avsync = val;
					self.module.command('setavsync', self.module.avsync ? '1':'0');
				}
			}

			self.isMute = function(){
				return self.module.mute;
			}

			self.isPlaying = function(){
				return (self.module.vxgReadyState == 2);
			}
			self.versionPLG = function(){
				return window.vxgplayer.version;
			}
			self.versionAPP = function(){
				return self.module.versionapp;
			}
				
			self.mute = function(){
				self.restartTimeout();
				self.module.mute = !self.module.mute;
				if(self.module.mute){
					el_volumeDown.style.display='none';
					el_volumeProgress.style.display='none';
					el_volumeUp.style.display='none';
					el_volumeProgress.className = el_volumeProgress.className.replace(/vol\d+/g,'vol0')
				}else{
					el_volumeDown.style.display='inline-block';
					el_volumeProgress.style.display='inline-block';
					el_volumeUp.style.display='inline-block';
					el_volumeProgress.className = el_volumeProgress.className.replace(/vol\d+/g,'vol' + Math.floor(self.module.volume*10));
				}
				self.module.command('setvolume', self.module.mute? '0': '' + self.module.volume);
			}
			
			self.volume = function(val){
				if(val != undefined){
					val = val > 1 ? 1 : val;
					val = val < 0 ? 0 : val;
					self.module.volume = Math.ceil(val*10)/10;
					self.module.command('setvolume', self.module.volume.toFixed(1));
					el_volumeProgress.className = el_volumeProgress.className.replace(/vol\d+/g,'vol' + Math.ceil(self.module.volume*10));
				}else{
					return self.module.volume;
				}
			}

			self.volup = function(){
				self.restartTimeout();
				if(Math.round(self.module.volume*10) < 10){
					self.module.volume = self.module.volume + 0.1;
					self.module.command('setvolume', self.module.volume.toFixed(1));
					el_volumeProgress.className = el_volumeProgress.className.replace(/vol\d+/g,'vol' + Math.ceil(self.module.volume*10));
				}
			};

			self.voldown = function(){
				self.restartTimeout();
				if(Math.round(self.module.volume*10) > 0){
					self.module.volume = self.module.volume - 0.1;
					self.module.command('setvolume', self.module.volume.toFixed(1));
					el_volumeProgress.className = el_volumeProgress.className.replace(/vol\d+/g,'vol' + Math.floor(self.module.volume*10));
				}
			};

			self.size = function(width, height){
				if(width && height){
					if(Number.isInteger(width) && Number.isInteger(height)){
						var w = parseInt(width,10);
						var h = parseInt(height,10);
						self.playerWidth = self.playerWidth != w ? w : self.playerWidth;
						self.playerHeight = self.playerHeight != h ? h : self.playerHeight;
						self.player.style.width = width + 'px';
						self.player.style.height = height + 'px';
					}else{
						self.player.style.width = width;
						self.player.style.height = height;
					}
				}else{
					return  { width: self.playerWidth, height: self.playerHeight };
				}
			};

			self.changedFullscreen = function(){
				console.log('changedFullscreen');
				if (document.webkitIsFullScreen){
					self.size('100%', '100%');
					console.log('changedFullscreen -> fullscreen');
				}else{
					self.size(self.playerWidth + 'px', self.playerHeight + 'px');
					console.log('changedFullscreen -> NOT fullscreen');
				}
			};

			if (document.addEventListener){
				document.addEventListener('webkitfullscreenchange', self.changedFullscreen, false);
				document.addEventListener('mozfullscreenchange', self.changedFullscreen, false);
				document.addEventListener('fullscreenchange', self.changedFullscreen, false);
				document.addEventListener('MSFullscreenChange', self.changedFullscreen, false);
			}

			self.fullscreen = function(){
				console.log("fullscreen: clicked");
				if(document.webkitIsFullScreen == true){
					document.webkitCancelFullScreen();
				}else{
					if(self.player.requestFullscreen) {
						self.player.requestFullscreen();
					} else if(self.player.webkitRequestFullscreen) {
						self.player.webkitRequestFullscreen();
					} else if(self.player.mozRequestFullscreen) {
						self.player.mozRequestFullScreen();
					}
				}
			};

			self.takescreenshot = function(){
					self.module.command('take_snapshot', '1');
					
					el_screenshot_loading.style.display = "block";
					setTimeout(function(){
						el_screenshot_loading.style.display = "";
					},5000);
			};

			self.src = function(url){
				if(url != undefined){
					self.module.url = url;
					console.log('Player ' + self.id+' src='+self.module.url+' autostart='+self.module.autostart+' is_opened='+self.module.is_opened);
					if(self.module.url.length > 0 && self.module.autostart){
						self.module.is_opened = true;
						self.module.command('open', url);
					}else{
						self.module.is_opened = false;
						//el_play.style.display = "inline-block";
						//el_stop.style.display = "none";
						//el_loader.style.display = 'none';
						self.stop();
					}
				}else{
					return self.module.url;
				}
			}

			self.dispose = function(){
				self.player.innerHTML = "";
				delete window.vxgplayer.players[self.id];
			}

			self.custom_digital_zoom = function(newval){
				if(newval != undefined){
					if(self.module.isCustomDigitalZoom == false && newval == true){
						self.module.isCustomDigitalZoom = true;
						self.setCustomDigitalZoom(100,0,0); // reset
						self.set_controls_display("");
					}else if(self.module.isCustomDigitalZoom == true && newval == false){
						self.module.isCustomDigitalZoom = false;
						self.set_controls_display("");
						self.setNewZoom(10);
					}
				}else{
					return self.module.isCustomDigitalZoom;
				}
			}
				
			self.setCustomDigitalZoom = function(ratio, x, y){
				if (ratio !== parseInt(ratio, 10) || x !== parseInt(x, 10) || y !== parseInt(y, 10)){
					throw "[VXGPLAYER] setDigitalZoom / Some values is not integer";
				}
				if(ratio < 100 || ratio > 500){
					throw "[VXGPLAYER] setDigitalZoom / Parameter Ratio must be 100..500";
				}
				if(self.module.isCustomDigitalZoom != true){
					throw "[VXGPLAYER] setDigitalZoom / Please enable custom digital zoom";
				}
				
				self.module.style.transform = "scale(" + (ratio/100) + ")";
				el_controls_zoom_position.style.display = "none";
				var s = self.size();
				var newx = x - s.width/2;
				var newy = y - s.height/2;
				var neww = s.width*(100/ratio);
				var newh = s.height*(100/ratio);
				var left = Math.floor(-100*(newx + neww/2)/neww);
				var top = Math.floor(-100*(newy + newh/2)/newh);
				self.module.style.left = left + '%';
				self.module.style.top = top + '%';
			}
			
			self.setNewZoom = function(v){
				if(v >= 30){ v = 30; }
				if(v <= 10){ v = 10; }
				
				if(self.currentZoom != v){
					self.currentZoom = v;
					self.module.style.transform = "scale(" + (self.currentZoom/10) + ")";
					el_zoomPositionCursor.style.transform = "scale(" + (10/self.currentZoom) + ")";
					el_zoomProgress.className = el_zoomProgress.className.replace(/zoom\d+x/g,'zoom' + Math.ceil(self.currentZoom) + 'x');
					el_controls_zoom_position.style.display = self.currentZoom == 10 ? "none" : "";
					self.module.style.left = '';
					self.module.style.top = '';
					el_zoomPositionCursor.style.left = '';
					el_zoomPositionCursor.style.top = '';
				}
			}
			
			self.zoomUp = function(){
				self.setNewZoom(self.currentZoom + 5)
			}
			self.zoomDown = function(){
				self.setNewZoom(self.currentZoom - 5);
			}
			self.zoomProgressDownBool = false;
			self.zoomProgressDown = function(e){
				self.zoomProgressDownBool = true;
			}
  
			self.zoomProgressMove = function(e){
				if(self.zoomProgressDownBool == true){
					var y = e.pageY - vxgplayer.getAbsolutePosition(e.currentTarget).y;
					var height = el_zoomProgress.offsetHeight;
					var steps = height/5;
					y = 10*(Math.floor((height-y)/steps)/2 + 1);
					self.setNewZoom(y);				
				}
			}
			self.zoomProgressLeave = function(e){
				self.zoomProgressDownBool = false;
			}
			self.zoomProgressUp = function(e){
				if(self.zoomProgressDownBool == true){
					var y = e.pageY - vxgplayer.getAbsolutePosition(e.currentTarget).y;
					var height = el_zoomProgress.offsetHeight;
					var steps = height/5;
					y = 10*(Math.floor((height-y)/steps)/2 + 1);
					self.setNewZoom(y);	
				}
				self.zoomProgressDownBool = false;
			}
			
			self.zoomCursorDownBool = false;
			self.zoomCursorX = 0;
			self.zoomCursorY = 0;
			self.zoomCursorWidth = 160;
			self.zoomCursorHeight = 120;
			self.zoomControlsWidth = 0;
			self.zoomControlsHeight = 0;
			self.zoomCursorDown = function(e){
				self.zoomCursorX = e.pageX;
				self.zoomCursorY = e.pageY;
				self.zoomCursorWidth = el_zoomPositionCursor.offsetWidth;
				self.zoomCursorHeight = el_zoomPositionCursor.offsetHeight;
				self.zoomControlsWidth = el_controls_zoom_position.offsetWidth;
				self.zoomControlsHeight = el_controls_zoom_position.offsetHeight;
				self.zoomCursorDownBool = true;
			}
			
			self.zoomCursorUp = function(e){
				console.log("zoomCursorUp");
				self.zoomCursorDownBool = false;
			}
			
			self.zoomCursorMove = function(e){
				if(self.zoomCursorDownBool == true){
					var diffX = self.zoomCursorX - e.pageX;
					var diffY = self.zoomCursorY - e.pageY;
					self.zoomCursorX = e.pageX;
					self.zoomCursorY = e.pageY;
					var newx = el_zoomPositionCursor.offsetLeft - diffX;
					var newy = el_zoomPositionCursor.offsetTop - diffY;
					var d2x = (self.zoomControlsWidth - self.zoomCursorWidth*(10/self.currentZoom));
					var d2y = (self.zoomControlsHeight - self.zoomCursorHeight*(10/self.currentZoom));
					var minX = -1*d2x/2;
					var maxX = d2x/2;
					var minY = -1*d2y/2;
					var maxY = d2y/2;
					if(newx < minX) newx = minX;
					if(newy < minY) newy = minY;
					if(newx >= maxX) newx = maxX;
					if(newy >= maxY) newy = maxY;
					el_zoomPositionCursor.style.left = newx + "px";
					el_zoomPositionCursor.style.top = newy + "px";
					var zoom = self.currentZoom/10 - 1;
					var left = Math.floor(-100*((newx/d2x)*zoom));
					var top = Math.floor(-100*((newy/d2y)*zoom));
					self.module.style.left = left + '%';
					self.module.style.top = top + '%';
				}
			}

			self.setNewZoom = function(v){
				if(v >= 30){ v = 30; }
				if(v <= 10){ v = 10; }
				
				if(self.currentZoom != v){
					self.currentZoom = v;
					self.module.style.transform = "scale(" + (self.currentZoom/10) + ")";
					el_zoomPositionCursor.style.transform = "scale(" + (10/self.currentZoom) + ")";
					el_zoomProgress.className = el_zoomProgress.className.replace(/zoom\d+x/g,'zoom' + Math.ceil(self.currentZoom) + 'x');
					el_controls_zoom_position.style.display = self.currentZoom == 10 ? "none" : "";
					self.module.style.left = '';
					self.module.style.top = '';
					el_zoomPositionCursor.style.left = '';
					el_zoomPositionCursor.style.top = '';
				}
			}
			
			self.zoomUp = function(){
				self.setNewZoom(self.currentZoom + 5)
			}
			self.zoomDown = function(){
				self.setNewZoom(self.currentZoom - 5);
			}
			self.zoomProgressDownBool = false;
			self.zoomProgressDown = function(e){
				self.zoomProgressDownBool = true;
			}
  
			self.zoomProgressMove = function(e){
				if(self.zoomProgressDownBool == true){
					var y = e.pageY - vxgplayer.getAbsolutePosition(e.currentTarget).y;
					var height = el_zoomProgress.offsetHeight;
					var steps = height/5;
					y = 10*(Math.floor((height-y)/steps)/2 + 1);
					self.setNewZoom(y);				
				}
			}
			self.zoomProgressLeave = function(e){
				self.zoomProgressDownBool = false;
			}
			self.zoomProgressUp = function(e){
				if(self.zoomProgressDownBool == true){
					var y = e.pageY - vxgplayer.getAbsolutePosition(e.currentTarget).y;
					var height = el_zoomProgress.offsetHeight;
					var steps = height/5;
					y = 10*(Math.floor((height-y)/steps)/2 + 1);
					self.setNewZoom(y);	
				}
				self.zoomProgressDownBool = false;
			}
			
			self.zoomCursorDownBool = false;
			self.zoomCursorX = 0;
			self.zoomCursorY = 0;
			self.zoomCursorWidth = 160;
			self.zoomCursorHeight = 120;
			self.zoomControlsWidth = 0;
			self.zoomControlsHeight = 0;
			self.zoomCursorDown = function(e){
				self.zoomCursorX = e.pageX;
				self.zoomCursorY = e.pageY;
				self.zoomCursorWidth = el_zoomPositionCursor.offsetWidth;
				self.zoomCursorHeight = el_zoomPositionCursor.offsetHeight;
				self.zoomControlsWidth = el_controls_zoom_position.offsetWidth;
				self.zoomControlsHeight = el_controls_zoom_position.offsetHeight;
				self.zoomCursorDownBool = true;
			}
			
			self.zoomCursorUp = function(e){
				console.log("zoomCursorUp");
				self.zoomCursorDownBool = false;
			}
			
			self.zoomCursorMove = function(e){
				if(self.zoomCursorDownBool == true){
					var diffX = self.zoomCursorX - e.pageX;
					var diffY = self.zoomCursorY - e.pageY;
					self.zoomCursorX = e.pageX;
					self.zoomCursorY = e.pageY;
					var newx = el_zoomPositionCursor.offsetLeft - diffX;
					var newy = el_zoomPositionCursor.offsetTop - diffY;
					var d2x = (self.zoomControlsWidth - self.zoomCursorWidth*(10/self.currentZoom));
					var d2y = (self.zoomControlsHeight - self.zoomCursorHeight*(10/self.currentZoom));
					var minX = -1*d2x/2;
					var maxX = d2x/2;
					var minY = -1*d2y/2;
					var maxY = d2y/2;
					if(newx < minX) newx = minX;
					if(newy < minY) newy = minY;
					if(newx >= maxX) newx = maxX;
					if(newy >= maxY) newy = maxY;
					el_zoomPositionCursor.style.left = newx + "px";
					el_zoomPositionCursor.style.top = newy + "px";
					var zoom = self.currentZoom/10 - 1;
					var left = Math.floor(-100*((newx/d2x)*zoom));
					var top = Math.floor(-100*((newy/d2y)*zoom));
					self.module.style.left = left + '%';
					self.module.style.top = top + '%';
				}
			}

			el_play.onclick = self.play;
			el_stop.onclick = self.stop;
			el_fullscreen.onclick = self.fullscreen;
			el_volumeMute.onclick = self.mute;
			el_volumeDown.onclick = self.voldown;
			el_volumeUp.onclick = self.volup;
			el_takescreenshot.onclick = self.takescreenshot;
			el_zoomUp.onclick = self.zoomUp;
			el_zoomDown.onclick = self.zoomDown;
			el_zoomPositionCursor.addEventListener('mousedown',self.zoomCursorDown,false);
			el_zoomPositionCursor.addEventListener('mousemove',self.zoomCursorMove,false);
			el_zoomPositionCursor.addEventListener('mouseleave',self.zoomCursorUp,false);
			el_zoomPositionCursor.addEventListener('mouseup',self.zoomCursorUp,false);
			el_zoomProgress.addEventListener('mousedown',self.zoomProgressDown,false);
			el_zoomProgress.addEventListener('mousemove',self.zoomProgressMove,false);
			el_zoomProgress.addEventListener('mouseleave',self.zoomProgressLeave,false);
			el_zoomProgress.addEventListener('mouseup',self.zoomProgressUp,false);

		}(id, options);
	}else{
		// console.warn(id + " -  already exists player");
	}
	return window.vxgplayer.players[id];
};

window.vxgplayer.webserverport = '8778';

window.vxgplayer.isFrame = function() {
	try { return window.self !== window.top; } catch (e) { return true; }
}

window.vxgplayer.browserSupportsPluginPnacl = function() {
	return navigator.mimeTypes['application/x-pnacl'] !== undefined &&
		navigator.mimeTypes['application/vxg_media_player'] !== undefined;
}

window.vxgplayer.showGlobalErrorMessage = function(id, html){
	var player = document.getElementById(id);
	var width=640;
	var height=480;
	width = parseInt(player.width,10) || width;
	height = parseInt(player.height,10) || height;
	player.style.width = width + 'px';
	player.style.height = height + 'px';
	player.innerHTML = html;
	return undefined;
}

window.vxgplayer.showNotInstalled = function(id){
	vxgplayer.showGlobalErrorMessage(id, ''
		+ '<div class="vxgplayer-unsupport">'
		+ '	<div class="vxgplayer-unsupport-content">'
		+ '	<a href="http://www.videoexpertsgroup.com/player_start/" ' + (vxgplayer.isFrame() ? 'target="_blank"' : '')+ '>Click here for install plugin</a>'
		+ '	<br/><br/> or visit in webstore <a href="https://chrome.google.com/webstore/detail/vxg-media-player/hncknjnnbahamgpjoafdebabmoamcnni" target="_blank">VXG Media Player</a>'
		+ '	</div>'
		+ '</div>');
}

window.vxgplayer.showAvailableInChrome = function(id){
	vxgplayer.showGlobalErrorMessage(id, ''
		+ '<div class="vxgplayer-unsupport">'
		+ '	<div class="vxgplayer-unsupport-content">'
		+ ' Available in <a href="https://www.google.com/chrome/" target="_blank">Chrome</a>'
		+ '	</div>'
		+ '</div>');
}

window.vxgplayer.showWebSocketFailed = function(id){
	vxgplayer.showGlobalErrorMessage(id, ''
		+ '<div class="vxgplayer-unsupport">'
		+ '	<div class="vxgplayer-unsupport-content">'
		+ ' Could not connect to plugin (WebSocket Error). Please try restart your browser.'
		+ '	</div> '
		+ '</div>');
}

window.vxgplayer.showNotInstalledInIncognitoMode = function(id){
	vxgplayer.showGlobalErrorMessage(id, ''
		+ '<div class="vxgplayer-unsupport">'
		+ '	<div class="vxgplayer-unsupport-content"> You have opened this page in incognito mode. Please open it in a regular tab, install the plugin and then come back.'
		+ '	<br/><br/> Also you can install <a href="https://chrome.google.com/webstore/detail/vxg-media-player/hncknjnnbahamgpjoafdebabmoamcnni" target="_blank">VXG Media Player</a> from webstore in regular tab.'
		+ '	</div>'
		+ '</div>');
}

window.vxgplayer.showNotStartedInIncognitoMode = function(id){
	vxgplayer.showGlobalErrorMessage(id, ''
		+ '<div class="vxgplayer-unsupport">'
		+ '	<div class="vxgplayer-unsupport-content"> You have opened this page in incognito mode. Please open it in a regular tab and then come back.'
		+ '	</div>'
		+ '</div>');
}

window.vxgplayer.startPlayerInNewTab = function(){
	console.log('start player');
	var params = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes"
	var win = window.open('http://www.videoexpertsgroup.com/player_start/', "_blank", params)
	setTimeout(function(){
		win.close();
		location.reload();
		/*for(var id in window.vxgplayer.players){
			console.log("Restart player: " + id);
		}*/
	},1000);
}

window.vxgplayer.showNotStartedInIFrame = function(id){
	vxgplayer.showGlobalErrorMessage(id, ''
		+ '<div class="vxgplayer-unsupport">'
		+ '	<div class="vxgplayer-unsupport-content"> You have opened this page in frame.<br>'
		+ ' Please click on <a href="javascript:void(0);" onclick="window.vxgplayer.startPlayerInNewTab();">this link</a> for start Chrome App (VXG Media Player).'
		+ '	</div>'
		+ '</div>');
}

window.vxgplayer.showInitFailed = function(id, str){
	vxgplayer.showGlobalErrorMessage(id, ''
		+ '<div class="vxgplayer-unsupport">'
		+ '	<div class="vxgplayer-unsupport-content">'
		+ ' Chrome plugin init error. Try to update Video/Audio drivers. '
		+ str
		+ '	</div> '
		+ '</div>');
}

window.vxgplayer.Promise = function(){
	var completed = false;
	
	this.done = function(callback){
		this.done_callback = callback;
		if(this.completed){
			this.done_callback(this.err);
		}
		return this;
	}
	
	this.fail = function(callback){
		this.fail_callback = callback;
		if(this.completed){
			this.fail_callback(this.err);
		}
		return this;
	}
	
	this.resolve = function(result) {
		if(!this.completed){
			this.result = result;
			this.done_callback(result);
		}
		this.completed = true;
	}
	this.reject = function(err) {
		if(!this.completed){
			this.err = err;
			this.fail_callback(err);
		}
		this.completed = true;
	}
};

window.vxgplayer.checkWebSocket = function(){
	var p = new vxgplayer.Promise();
	setTimeout(function(){
		var	testWebSocket = new WebSocket('ws://127.0.0.1:' + vxgplayer.webserverport + '/');
		testWebSocket.onerror=function(event){
			p.reject();
		}
		testWebSocket.onmessage = function(evt){
			console.log(evt);
		}
		testWebSocket.onopen=function(){
			testWebSocket.close();
			p.resolve();
		}
	},10000);
	return p;
}

// helper funxtion
window.vxgplayer.getAbsolutePosition = function(element){
	var r = { x: element.offsetLeft, y: element.offsetTop };
	if (element.offsetParent) {
	var tmp = vxgplayer.getAbsolutePosition(element.offsetParent);
		r.x += tmp.x;
		r.y += tmp.y;
	}
	return r;
};

document.addEventListener('DOMContentLoaded', function() {

	console.log("vxgplayer isFrame: " + window.vxgplayer.isFrame());
	console.log("vxgplayer browserSupportsPluginPnacl: " + window.vxgplayer.browserSupportsPluginPnacl());

	// search all vxgplayers
	var els = document.getElementsByClassName("vxgplayer");
	for (var i = 0; i < els.length; i++) {
		if(els[i].id){
			vxgplayer(els[i].id);
		}else{
			console.error("Player has not id", els[i]);
		}
	}
	
	// TODO check ws
	// TODO start Chrome App
});
