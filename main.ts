declare let window: any;
declare let Stats: any;
declare let PixiTextInput: any;
export type PIXIContainer = any;
export type PIXIRectangle = any;
declare let Playtomic: any;
declare var $: any;

const GLOBAL_MUSIC_ASSETS = [
];

const GLOBAL_SOUND_ASSETS = [
    'click.wav',
    'bottle.ogg',
    'coin.ogg',
    'damage.ogg',
    'splash.ogg',
    'creepysound1.ogg'
];

const GLOBAL_ASSETS = [
    ///////////////////////////////////////////
    // Atlases
   ///////////////////////////////////////////

    'tiles1.json',
    'smallfontx1.xml',
];

export let PIXI = window.PIXI;
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


export const SCR_WIDTH = 800;//config.Client.ScreenWidth;
export const SCR_HEIGHT = 600;//config.Client.ScreenHeight;
const SCR_SCALE = 1.0;
const FRAME_RATE = 60;
const FRAME_DELAY = 1000 / FRAME_RATE;
const DEBUG = false;

//asdasd
export class Main {
    lightLayer: any;
    bg1: any;
    bg2: any;
    startSpawn: boolean;
    // public menu: Menu = new Menu();
    // public game: Game = new Game();
    // public shop: GameShop = new GameShop();
    //
    // public charSel: CharacterSelect = new CharacterSelect();
    // public companions: LookingForCompanions = new LookingForCompanions();

    private fps: number = 0;
    private lastLoop: number = 0;
    private totalFrames: number = 0;
    private totalDelta: number = 0;
    public time: number;

    //analytics
    private country: string;
    private avgFPS: number;
    private avgPing: number;
    private loadTime: number;

    public onContext: Function;
    public __DIR: string;
    // public controls: Controls;
    public ws: WebSocket;
    public TweenMax: any = window.TweenMax;
    public PIXI: any;
    public app: any;
    public loader: any;
    // public sm: SM;
    // public lm: LM;

    public worldSpeed: number = 1;
    public debug: boolean = true;
    // public sound: Sound;
    public cursor: PIXI.Sprite;
    // public timer: PauseTimer = new PauseTimer();
    isInitialLoading: boolean = true;
    assets: Array<string>;
    assetsLoaded: number = 0;
    delta: number = 0;
    delta2: number = 0; // 1000 / delta time
    public random: number;
    public stats: any;
    public shaders: Object = {};
    // private prevPos: Vec2 = null;
    private loadingCounter: number = 0;
    private bg: PIXI.Container;

    constructor() {
        this.__DIR = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1);
    }
    static GET(url: string, cb: Function) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                cb(xmlHttp.responseText);
            }
        };
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.send(null);
    }

    start() {
        let pr = "testprivate";
        let pub = "testpublic";

        document.addEventListener('contextmenu', (event) => {
            if (this.onContext) this.onContext();
            event.preventDefault()
        });

        setTimeout(() => {
            // this.saveAnalytics()
        }, 10 * 1000);

        this.stats = new Stats();

        document.body.appendChild(this.stats.domElement);
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.top = "0px";

        // document.body.requestPointerLock();
        // this.controls = new Controls();
        this.PIXI = PIXI;

        this.app = new PIXI.Application(SCR_WIDTH, SCR_HEIGHT, {resolution: 1, antialias: true,
            preserveDrawingBuffer: true });
        document.body.appendChild(this.app.view);
        this.app.ticker.add(this.animate.bind(this));


        requestAnimationFrame(this.animate.bind(this));
    };


    addSprite(px: number, py: number): PIXI.Sprite {
        let tex = PIXI.Texture.fromFrame("wall2.png");
        let s = new PIXI.Sprite(tex);
        s.x = px;
        s.y = py;
        return s
    }

    cs(s: string, layer: PIXIContainer = null): PIXI.Sprite { //create sprite from frame and add to default layer
        let texture = PIXI.Texture.fromFrame(s);
        let gfx = new PIXI.Sprite(texture);
        gfx.anchor.x = .5;
        gfx.anchor.y = .5;
        if (layer)
            layer.addChild(gfx); else {
            // _.sm.ol.addChild(gfx);
        }

        //this.sm.ol.addChild(gfx);
        return gfx
    }

    loadComplete(): void {

        document.addEventListener("keydown", (e) => {
            let keyCode = e.keyCode;
            switch (keyCode) {
                case 68: //d
                    this.restartScene();
                    break;
            }
        });


        this.isInitialLoading = false;
        this.bg = new PIXI.Container();
        this.bg1 = new PIXI.Container();
        this.bg2 = new PIXI.Container();
        this.bg1.z = 10;
        this.bg2.z = 50;

        //Light layer in front of everything but has same transformations as bg2
        this.lightLayer= new PIXI.Container();
        this.lightLayer.z = 50;

        this.app.stage.interactive = true;
        this.app.stage.mousedown = (e)=>{
            this.startSpawn = true;
        };
        this.app.stage.mouseup = (e)=>{
            this.startSpawn = false;
        };

        this.app.stage.addChild(this.bg);
        this.bg.addChild(this.bg2);
        this.bg.addChild(this.bg1);
        this.app.stage.addChild(this.lightLayer);
    }


    processSelectEffect() {
        let PIXINeutrinoContext = window.PIXINeutrinoContext;
        let PIXINeutrinoEffectModel = window.PIXINeutrinoEffectModel;
        let PIXINeutrinoEffect = window.PIXINeutrinoEffect;
        let neutrinoContext = new PIXINeutrinoContext(_.app.renderer);

        let effectModel = new PIXINeutrinoEffectModel(
            neutrinoContext,
            '../LightingDemo/effects/water_stream.js'
        );

        let effect = new PIXINeutrinoEffect(
            effectModel,
            [200, 200, 0],	// Starting position of effect
            0,			// (optional) Starting rotation in degrees
            [1, 1, 1],	// (optional) Starting scale for X, Y and Z axes
        );
        this.bg.addChild(effect);
        setInterval(() => {
            effect.update(16)
        }, 16);
    }

    load(): void {
        this.loader = new this.PIXI.loaders.Loader();

        this.assets = GLOBAL_ASSETS;

        this.loadingCounter = 0;
        this.loader.add(this.assets);

        let onAssetsLoaded = () => {
            this.loadingCounter++;
            if (this.loadingCounter == 1) this.loadComplete()
        };

        this.loader.on('complete', onAssetsLoaded);


        this.loader.on('progress', (loader: any, evt: any) => {
            this.assetsLoaded++;

            if (evt.name.indexOf('shaders') > 0) {
                var result = evt.name.substring(evt.name.lastIndexOf("/") + 1);
                this.shaders[result] = evt.data
            }

            if (evt.name.indexOf('/') > 0 && evt.isXml) {
                var result = evt.name.substring(evt.name.lastIndexOf("/") + 1);
                result = result.substring(0, result.length - 4);
            }
        });
        this.loader.load();
    }

    recursiveMove(cont: PIXI.Container): void {
        for (let x of cont.children) {
            if (x instanceof PIXI.Container) {
                this.recursiveMove(x)
            }

            if (x instanceof PIXI.Sprite) {
                let dx = SCR_WIDTH / 2 - x.x ;
                let dy = SCR_HEIGHT / 2 - x.y ;
                x.x += dx / 1000;
                x.y += dy / 1000;
            }
        }
    }
    animate(): void {
        this.stats.begin();

        this.random = Math.random();
        this.time = (new Date()).getTime();
        let pos = this.app.renderer.plugins.interaction.mouse.global;

        if (this.startSpawn) {
            let spr = _.cs("bluebonus.png", null);
            spr.x = pos.x + 40*(Math.random() - 0.5);
            spr.y = pos.y + 40*(Math.random() - 0.5);
            if (this.random > 0.6)
            {
                this.bg1.addChild(spr);
            } else
            if (this.random > 0.3) {
          //      this.bg1.addChild(spr);
            } //else

            let tf = new PIXI.extras.BitmapText("asdasd dfsdf" + Math.random().toString(), {font: "smallfontx1", alight: "center"});
            let mask = new PIXI.Graphics();
            mask.clear();
            mask.beginFill(0xffffff, 1);
            let w = tf.width - 10;
            let value = Math.random();
            mask.drawRect(-w / 2, w * (1 - value) - w / 2, w, w * (value));
            mask.endFill();
            tf.mask = mask;
            tf.addChild(mask);
            tf.x = pos.x;
            tf.y = pos.y;
            tf.scale.x = Math.random() + 1;
            tf.scale.y = Math.random() + 1;
            tf.tint = Math.random()*9999999;
            this.bg1.addChild(tf);
            this.recursiveMove(this.app.stage);

            tf.alpha = Math.random();

            if (Math.random() < 0.1)
                tf.alpha = 0;


         //   this.lightLayer.addChild(spr);
        }
        this.stats.end();

    }

    private restartScene() {
        this.resetScene();
        for (let x = 0; x < 20; ++x) {
            for (let y = 0; y < 20; ++y) {
                if (x == 1 && y == 1) continue;
                let s = this.addSprite(x*90, y*90);
                s.scale.x = 50;
                s.scale.y= 50;
                s.tint = 0x778899;
                this.bg2.addChild(s)
            }
        }


        for (let x = 0; x < 20; ++x) {
            for (let y = 0; y < 20; ++y) {
                if (Math.random() > .6) {
                    let s = this.addSprite(x*90, y*90);
                    s.tint = 0xff000000;
                    this.bg1.addChild(s)
                }
            }
        }

        let delta = 140;
        let resetAmbient = (a: PIXI.Graphics, obj: any) => {
            a.clear();


            a.beginFill(91000000 + (0.5 + 0.5 * Math.sin((new Date()).getSeconds() / 100))*255, 1);
            a.drawRect(obj.x, obj.y, obj.width, obj.height);
            a.endFill();
        }

        let l = {
            gfx: new PIXI.Sprite(),
            ambient: PIXI.Graphics,


            newAmbient: function (col) {
                let a = new PIXI.Graphics();
                return a;
            },

            addLight(l: PIXI.Sprite): void{
                l.blendMode = PIXI.BLEND_MODES.ADD;
                l.tint = 0xff000000;
                this.gfx.addChild(l);
            },
            filterArea: new PIXI.Rectangle(-delta, -delta, SCR_WIDTH + 2*delta, SCR_HEIGHT + 2*delta),
        };


        setInterval(() => {
            resetAmbient(l.ambient, l.filterArea)
        }, 30);

        l.ambient = l.newAmbient(0x556677);
        l.gfx.filters = [new PIXI.filters.VoidFilter()];
        l.gfx.filters[0].blendMode = PIXI.BLEND_MODES.MULTIPLY;
        l.gfx.filterArea = l.filterArea;
        this.lightLayer.addChild(l.gfx);
        l.gfx.addChild(l.ambient);

        //this is front smooth light it shouldnt cut
        let s = new PIXI.Sprite(PIXI.Texture.fromFrame("lightship.png"));
        s.x = 300;
        s.y = 100;
        l.addLight(s);

        //here's windows, windows should be cutted
        s = new PIXI.Sprite(PIXI.Texture.fromFrame("lightsqure.png"));
        s.x = -s.width/2 + 100;
        s.y = -s.height/2+ 120;
        let brt = new PIXI.BaseRenderTexture(s.width, s.height, PIXI.SCALE_MODES.LINEAR, 1);
        let rt = new PIXI.RenderTexture(brt);
        let mask = new PIXI.Sprite(rt);
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
        setTimeout(1000, () => {

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
    }

    private resetScene() {
        for (let x = this.bg1.children.length - 1; x > 0; x--) {
           this.bg1.removeChildAt(0)
        }

        for (let x = this.bg2.children.length - 1; x > 0; x--) {
            this.bg2.removeChildAt(0)
        }

        for (let x = this.lightLayer.children.length - 1; x > 0; x--) {
            this.lightLayer.removeChildAt(0)
        }
    }
}

export let _: Main = new Main();
_.start();
_.load();