"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GLOBAL_MUSIC_ASSETS = [];
var GLOBAL_SOUND_ASSETS = [
    'click.wav',
    'bottle.ogg',
    'coin.ogg',
    'damage.ogg',
    'splash.ogg',
    'creepysound1.ogg'
];
var GLOBAL_ASSETS = [
    ///////////////////////////////////////////
    // Atlases
    ///////////////////////////////////////////
    'tiles1.json',
];
exports.PIXI = window.PIXI;
/*
import {config} from "./config";
import {Game} from "./Stages/Game";
import {SM} from "./Stages/SM";
import {Sound} from "./Sound";
import {Menu} from "./Stages/Menu";
import {PauseTimer} from "./PauseTimer";
import {CharacterSelect} from "./Stages/CharacterSelect";
import {Controls} from "./Controls";
import {LM} from "./lm";
import {network} from "./Network";
import {LookingForCompanions} from "./Stages/LookingForCompanions";
import {GameShop} from "./Stages/GameShop";
*/
exports.SCR_WIDTH = 800; //config.Client.ScreenWidth;
exports.SCR_HEIGHT = 600; //config.Client.ScreenHeight;
var SCR_SCALE = 1.0;
var FRAME_RATE = 60;
var FRAME_DELAY = 1000 / FRAME_RATE;
var DEBUG = false;
//asdasd
var Main = (function () {
    function Main() {
        // public menu: Menu = new Menu();
        // public game: Game = new Game();
        // public shop: GameShop = new GameShop();
        //
        // public charSel: CharacterSelect = new CharacterSelect();
        // public companions: LookingForCompanions = new LookingForCompanions();
        this.fps = 0;
        this.lastLoop = 0;
        this.totalFrames = 0;
        this.totalDelta = 0;
        this.TweenMax = window.TweenMax;
        this.worldSpeed = 1;
        this.debug = true;
        // public timer: PauseTimer = new PauseTimer();
        this.isInitialLoading = true;
        this.assetsLoaded = 0;
        this.delta = 0;
        this.delta2 = 0; // 1000 / delta time
        this.shaders = {};
        // private prevPos: Vec2 = null;
        this.loadingCounter = 0;
        this.__DIR = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1);
    }
    Main.GET = function (url, cb) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                cb(xmlHttp.responseText);
            }
        };
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.send(null);
    };
    Main.prototype.start = function () {
        var _this = this;
        if (DEBUG) {
            (function () {
                // PIXI.Sprite
                exports.PIXI.Sprite.drawCount = 0;
                exports.PIXI.Sprite.prototype.__renderWebGL = exports.PIXI.Sprite.prototype._renderWebGL;
                exports.PIXI.Sprite.prototype._renderWebGL = function (renderer) {
                    exports.PIXI.Sprite.drawCount++;
                    this.__renderWebGL(renderer);
                };
                exports.PIXI.Sprite.prototype.__renderCanvas = exports.PIXI.Sprite.prototype._renderCanvas;
                exports.PIXI.Sprite.prototype._renderCanvas = function (renderer) {
                    exports.PIXI.Sprite.drawCount++;
                    this.__renderCanvas(renderer);
                };
                // PIXI.Container
                exports.PIXI.Container.drawCount = 0;
                exports.PIXI.Container.prototype.__renderWebGL = exports.PIXI.Container.prototype._renderWebGL;
                exports.PIXI.Container.prototype._renderWebGL = function (renderer) {
                    exports.PIXI.Container.drawCount++;
                    this.__renderWebGL(renderer);
                };
                exports.PIXI.Container.prototype.__renderCanvas = exports.PIXI.Container.prototype._renderCanvas;
                exports.PIXI.Container.prototype._renderCanvas = function (renderer) {
                    exports.PIXI.Container.drawCount++;
                    this.__renderCanvas(renderer);
                };
            })();
        }
        var pr = "testprivate";
        var pub = "testpublic";
        document.addEventListener('contextmenu', function (event) {
            console.log('PENIS');
            if (_this.onContext)
                _this.onContext();
            event.preventDefault();
        });
        setTimeout(function () {
            // this.saveAnalytics()
        }, 10 * 1000);
        // document.body.requestPointerLock();
        // this.controls = new Controls();
        this.PIXI = exports.PIXI;
        this.renderer = new exports.PIXI.WebGLRenderer(exports.SCR_WIDTH, exports.SCR_HEIGHT, { resolution: 1, antialias: true, backgroundColor: 0x99dddd });
        document.body.appendChild(this.renderer.view);
        this.camera = new exports.PIXI.Camera3d();
        this.camera.easyPerspective(this.renderer, 300, 10, 1000);
        this.camera.transform.x = -exports.SCR_WIDTH / 2;
        this.camera.transform.y = -exports.SCR_HEIGHT / 2;
        exports._.camera.lookPosition.x = exports.SCR_WIDTH / 2;
        exports._.camera.lookPosition.y = exports.SCR_HEIGHT / 2;
        this.camera.lookEuler.x = -Math.PI / 200;
        var debugCamera = false;
        this.app = {};
        this.app.stage = new exports.PIXI.Container();
        requestAnimationFrame(this.animate.bind(this));
    };
    ;
    Main.prototype.addSprite = function (px, py) {
        var tex = exports.PIXI.Texture.fromFrame("wall2.png");
        var s = new exports.PIXI.Sprite3d(tex);
        s.x = px;
        s.y = py;
        return s;
    };
    Main.prototype.loadComplete = function () {
        this.isInitialLoading = false;
        var bg1 = new exports.PIXI.Container3d();
        var bg2 = new exports.PIXI.Container3d();
        bg1.z = 10;
        bg2.z = 50;
        //Light layer in front of everything but has same transformations as bg2
        var lightLayer = new exports.PIXI.Container3d();
        lightLayer.z = 50;
        this.app.stage.addChild(this.camera);
        this.camera.addChild(bg2);
        this.camera.addChild(bg1);
        this.camera.addChild(lightLayer);
        for (var x = 0; x < 20; ++x) {
            for (var y = 0; y < 20; ++y) {
                if (x == 1 && y == 1)
                    continue;
                var s_1 = this.addSprite(x * 90, y * 90);
                s_1.tint = 0x778899;
                bg2.addChild(s_1);
            }
        }
        for (var x = 0; x < 20; ++x) {
            for (var y = 0; y < 20; ++y) {
                if (Math.random() > .6) {
                    var s_2 = this.addSprite(x * 90, y * 90);
                    ;
                    bg1.addChild(s_2);
                }
            }
        }
        var delta = 140;
        var l = {
            gfx: new exports.PIXI.Sprite(),
            ambient: exports.PIXI.Graphics,
            newAmbient: function (col) {
                var a = new exports.PIXI.Graphics();
                a.clear();
                a.beginFill(col, 1);
                a.drawRect(this.filterArea.x, this.filterArea.y, this.filterArea.width, this.filterArea.height);
                a.endFill();
                return a;
            },
            addLight: function (l) {
                l.blendMode = exports.PIXI.BLEND_MODES.ADD;
                this.gfx.addChild(l);
            },
            filterArea: new exports.PIXI.Rectangle(-delta, -delta, exports.SCR_WIDTH + 2 * delta, exports.SCR_HEIGHT + 2 * delta),
        };
        l.ambient = l.newAmbient(0x98dede);
        l.gfx.filters = [new exports.PIXI.filters.VoidFilter()];
        l.gfx.filters[0].blendMode = exports.PIXI.BLEND_MODES.MULTIPLY;
        l.gfx.filterArea = l.filterArea;
        lightLayer.addChild(l.gfx);
        l.gfx.addChild(l.ambient);
        //this is front smooth light it shouldnt cut
        var s = new exports.PIXI.Sprite3d(exports.PIXI.Texture.fromFrame("lightship.png"));
        s.x = 300;
        s.y = 100;
        l.addLight(s);
        //here's windows, windows should be cutted
        s = new exports.PIXI.Sprite3d(exports.PIXI.Texture.fromFrame("lightsqure.png"));
        s.x = -s.width / 2 + 100;
        s.y = -s.height / 2 + 120;
        var mask = new exports.PIXI.Sprite(exports.PIXI.Texture.fromFrame("bullettest.png"));
        this.camera.addChild(mask);
        //        s.mask = mask;
        l.addLight(s);
    };
    Main.prototype.load = function () {
        var _this = this;
        this.loader = new this.PIXI.loaders.Loader();
        this.assets = GLOBAL_ASSETS;
        this.loadingCounter = 0;
        this.loader.add(this.assets);
        var onAssetsLoaded = function () {
            _this.loadingCounter++;
            if (_this.loadingCounter == 1)
                _this.loadComplete();
        };
        this.loader.on('complete', onAssetsLoaded);
        this.loader.on('progress', function (loader, evt) {
            _this.assetsLoaded++;
            if (evt.name.indexOf('shaders') > 0) {
                var result = evt.name.substring(evt.name.lastIndexOf("/") + 1);
                _this.shaders[result] = evt.data;
            }
            if (evt.name.indexOf('/') > 0 && evt.isXml) {
                var result = evt.name.substring(evt.name.lastIndexOf("/") + 1);
                result = result.substring(0, result.length - 4);
            }
        });
        this.loader.load();
    };
    Main.prototype.animate = function () {
        this.random = Math.random();
        this.time = (new Date()).getTime();
        var pos = this.renderer.plugins.interaction.mouse.global;
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.app.stage);
    };
    return Main;
}());
exports.Main = Main;
exports._ = new Main();
exports._.start();
exports._.load();
//# sourceMappingURL=main.js.map