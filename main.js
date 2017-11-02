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
    'smallfontx1.xml',
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
        // public sm: SM;
        // public lm: LM;
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
        var pr = "testprivate";
        var pub = "testpublic";
        document.addEventListener('contextmenu', function (event) {
            if (_this.onContext)
                _this.onContext();
            event.preventDefault();
        });
        setTimeout(function () {
            // this.saveAnalytics()
        }, 10 * 1000);
        this.stats = new Stats();
        document.body.appendChild(this.stats.domElement);
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.top = "0px";
        // document.body.requestPointerLock();
        // this.controls = new Controls();
        this.PIXI = exports.PIXI;
        this.app = new exports.PIXI.Application(exports.SCR_WIDTH, exports.SCR_HEIGHT, { resolution: 1, antialias: true,
            preserveDrawingBuffer: true });
        document.body.appendChild(this.app.view);
        this.app.ticker.add(this.animate.bind(this));
        requestAnimationFrame(this.animate.bind(this));
    };
    ;
    Main.prototype.addSprite = function (px, py) {
        var tex = exports.PIXI.Texture.fromFrame("wall2.png");
        var s = new exports.PIXI.Sprite(tex);
        s.x = px;
        s.y = py;
        return s;
    };
    Main.prototype.cs = function (s, layer) {
        if (layer === void 0) { layer = null; }
        var texture = exports.PIXI.Texture.fromFrame(s);
        var gfx = new exports.PIXI.Sprite(texture);
        gfx.anchor.x = .5;
        gfx.anchor.y = .5;
        if (layer)
            layer.addChild(gfx);
        else {
            // _.sm.ol.addChild(gfx);
        }
        //this.sm.ol.addChild(gfx);
        return gfx;
    };
    Main.prototype.loadComplete = function () {
        var _this = this;
        document.addEventListener("keydown", function (e) {
            var keyCode = e.keyCode;
            switch (keyCode) {
                case 68:
                    _this.restartScene();
                    break;
            }
        });
        this.isInitialLoading = false;
        this.bg = new exports.PIXI.Container();
        this.bg1 = new exports.PIXI.Container();
        this.bg2 = new exports.PIXI.Container();
        this.bg1.z = 10;
        this.bg2.z = 50;
        //Light layer in front of everything but has same transformations as bg2
        this.lightLayer = new exports.PIXI.Container();
        this.lightLayer.z = 50;
        this.app.stage.interactive = true;
        this.app.stage.mousedown = function (e) {
            _this.startSpawn = true;
        };
        this.app.stage.mouseup = function (e) {
            _this.startSpawn = false;
        };
        this.app.stage.addChild(this.bg);
        this.bg.addChild(this.bg2);
        this.bg.addChild(this.bg1);
        this.app.stage.addChild(this.lightLayer);
    };
    Main.prototype.processSelectEffect = function () {
        var PIXINeutrinoContext = window.PIXINeutrinoContext;
        var PIXINeutrinoEffectModel = window.PIXINeutrinoEffectModel;
        var PIXINeutrinoEffect = window.PIXINeutrinoEffect;
        var neutrinoContext = new PIXINeutrinoContext(exports._.app.renderer);
        var effectModel = new PIXINeutrinoEffectModel(neutrinoContext, '../LightingDemo/effects/water_stream.js');
        var effect = new PIXINeutrinoEffect(effectModel, [200, 200, 0], // Starting position of effect
        0, // (optional) Starting rotation in degrees
        [1, 1, 1]);
        this.bg.addChild(effect);
        setInterval(function () {
            effect.update(16);
        }, 16);
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
    Main.prototype.recursiveMove = function (cont) {
        for (var _i = 0, _a = cont.children; _i < _a.length; _i++) {
            var x = _a[_i];
            if (x instanceof exports.PIXI.Container) {
                this.recursiveMove(x);
            }
            if (x instanceof exports.PIXI.Sprite) {
                var dx = exports.SCR_WIDTH / 2 - x.x;
                var dy = exports.SCR_HEIGHT / 2 - x.y;
                x.x += dx / 1000;
                x.y += dy / 1000;
            }
        }
    };
    Main.prototype.animate = function () {
        this.stats.begin();
        this.random = Math.random();
        this.time = (new Date()).getTime();
        var pos = this.app.renderer.plugins.interaction.mouse.global;
        if (this.startSpawn) {
            var spr = exports._.cs("bluebonus.png", null);
            spr.x = pos.x + 40 * (Math.random() - 0.5);
            spr.y = pos.y + 40 * (Math.random() - 0.5);
            if (this.random > 0.6) {
                this.bg1.addChild(spr);
            }
            else if (this.random > 0.3) {
                //      this.bg1.addChild(spr);
            } //else
            var tf = new exports.PIXI.extras.BitmapText("asdasd dfsdf" + Math.random().toString(), { font: "smallfontx1", alight: "center" });
            var mask = new exports.PIXI.Graphics();
            mask.clear();
            mask.beginFill(0xffffff, 1);
            var w = tf.width - 10;
            var value = Math.random();
            mask.drawRect(-w / 2, w * (1 - value) - w / 2, w, w * (value));
            mask.endFill();
            tf.mask = mask;
            tf.addChild(mask);
            tf.x = pos.x;
            tf.y = pos.y;
            tf.scale.x = Math.random() + 1;
            tf.scale.y = Math.random() + 1;
            tf.tint = Math.random() * 9999999;
            this.bg1.addChild(tf);
            this.recursiveMove(this.app.stage);
            tf.alpha = Math.random();
            if (Math.random() < 0.1)
                tf.alpha = 0;
            //   this.lightLayer.addChild(spr);
        }
        this.stats.end();
    };
    Main.prototype.restartScene = function () {
        this.resetScene();
        for (var x = 0; x < 20; ++x) {
            for (var y = 0; y < 20; ++y) {
                if (x == 1 && y == 1)
                    continue;
                var s_1 = this.addSprite(x * 90, y * 90);
                s_1.scale.x = 50;
                s_1.scale.y = 50;
                s_1.tint = 0x778899;
                this.bg2.addChild(s_1);
            }
        }
        for (var x = 0; x < 20; ++x) {
            for (var y = 0; y < 20; ++y) {
                if (Math.random() > .6) {
                    var s_2 = this.addSprite(x * 90, y * 90);
                    s_2.tint = 0xff000000;
                    this.bg1.addChild(s_2);
                }
            }
        }
        var delta = 140;
        var resetAmbient = function (a, obj) {
            a.clear();
            a.beginFill(91000000 + (0.5 + 0.5 * Math.sin((new Date()).getSeconds() / 100)) * 255, 1);
            a.drawRect(obj.x, obj.y, obj.width, obj.height);
            a.endFill();
        };
        var l = {
            gfx: new exports.PIXI.Sprite(),
            ambient: exports.PIXI.Graphics,
            newAmbient: function (col) {
                var a = new exports.PIXI.Graphics();
                return a;
            },
            addLight: function (l) {
                l.blendMode = exports.PIXI.BLEND_MODES.ADD;
                l.tint = 0xff000000;
                this.gfx.addChild(l);
            },
            filterArea: new exports.PIXI.Rectangle(-delta, -delta, exports.SCR_WIDTH + 2 * delta, exports.SCR_HEIGHT + 2 * delta),
        };
        setInterval(function () {
            resetAmbient(l.ambient, l.filterArea);
        }, 30);
        l.ambient = l.newAmbient(0x556677);
        l.gfx.filters = [new exports.PIXI.filters.VoidFilter()];
        l.gfx.filters[0].blendMode = exports.PIXI.BLEND_MODES.MULTIPLY;
        l.gfx.filterArea = l.filterArea;
        this.lightLayer.addChild(l.gfx);
        l.gfx.addChild(l.ambient);
        //this is front smooth light it shouldnt cut
        var s = new exports.PIXI.Sprite(exports.PIXI.Texture.fromFrame("lightship.png"));
        s.x = 300;
        s.y = 100;
        l.addLight(s);
        //here's windows, windows should be cutted
        s = new exports.PIXI.Sprite(exports.PIXI.Texture.fromFrame("lightsqure.png"));
        s.x = -s.width / 2 + 100;
        s.y = -s.height / 2 + 120;
        var brt = new exports.PIXI.BaseRenderTexture(s.width, s.height, exports.PIXI.SCALE_MODES.LINEAR, 1);
        var rt = new exports.PIXI.RenderTexture(brt);
        var mask = new exports.PIXI.Sprite(rt);
        mask.x = 0;
        mask.y = 0;
        //bg1.x = - 100;
        // bg1.y = - 100;
        // bg1.tint = 0x000000;
        /* let clr = new PIXI.Graphics();
         clr.clear();

         clr.beginFill(0x000000, 1);
         clr.drawRect(0, 0, 2000, 2000);
         clr.endFill();*/
        setTimeout(1000, function () {
            //           this.app.stage.addChild(clr);
            //            this.renderer.render(clr, rt);
            mask.x += 200;
            mask.y += 200;
        });
        this.bg1.x = 12;
        this.bg1.y = -20;
        //   this.app.stage.addChild(mask);
        //s.addChild(mask);
        //s.mask = mask;
        //this.app.stage.addChild(mask);
        l.addLight(s);
        if (!this.check) {
            this.check = true;
            this.processSelectEffect();
        }
    };
    Main.prototype.resetScene = function () {
        for (var x = this.bg1.children.length - 1; x > 0; x--) {
            this.bg1.removeChildAt(0);
        }
        for (var x = this.bg2.children.length - 1; x > 0; x--) {
            this.bg2.removeChildAt(0);
        }
        for (var x = this.lightLayer.children.length - 1; x > 0; x--) {
            this.lightLayer.removeChildAt(0);
        }
    };
    return Main;
}());
exports.Main = Main;
exports._ = new Main();
exports._.start();
exports._.load();
//# sourceMappingURL=main.js.map