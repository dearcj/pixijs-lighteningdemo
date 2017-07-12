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
    public renderer: any;
    public camera: any;

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

        if (DEBUG) {
            (function () {

                // PIXI.Sprite

                PIXI.Sprite.drawCount = 0;

                PIXI.Sprite.prototype.__renderWebGL = PIXI.Sprite.prototype._renderWebGL;
                PIXI.Sprite.prototype._renderWebGL = function (renderer) {
                    PIXI.Sprite.drawCount++;
                    this.__renderWebGL(renderer);
                };


                PIXI.Sprite.prototype.__renderCanvas = PIXI.Sprite.prototype._renderCanvas;
                PIXI.Sprite.prototype._renderCanvas = function (renderer) {
                    PIXI.Sprite.drawCount++;
                    this.__renderCanvas(renderer);
                };


                // PIXI.Container

                PIXI.Container.drawCount = 0;

                PIXI.Container.prototype.__renderWebGL = PIXI.Container.prototype._renderWebGL;
                PIXI.Container.prototype._renderWebGL = function (renderer) {
                    PIXI.Container.drawCount++;
                    this.__renderWebGL(renderer);
                };


                PIXI.Container.prototype.__renderCanvas = PIXI.Container.prototype._renderCanvas;
                PIXI.Container.prototype._renderCanvas = function (renderer) {
                    PIXI.Container.drawCount++;
                    this.__renderCanvas(renderer);
                };


            })();

        }
        let pr = "testprivate";
        let pub = "testpublic";

        document.addEventListener('contextmenu', (event) => {
            console.log('PENIS');
            if (this.onContext) this.onContext();
            event.preventDefault()
        });

        setTimeout(() => {
            // this.saveAnalytics()
        }, 10 * 1000);


        // document.body.requestPointerLock();

        // this.controls = new Controls();
        this.PIXI = PIXI;
        this.renderer = new PIXI.WebGLRenderer(SCR_WIDTH, SCR_HEIGHT, {resolution: 1, antialias: true, backgroundColor: 0x99dddd});
        document.body.appendChild(this.renderer.view);
        this.camera = new PIXI.Camera3d();
        this.camera.easyPerspective(this.renderer, 300, 10, 1000);
        this.camera.transform.x = -SCR_WIDTH / 2;
        this.camera.transform.y = -SCR_HEIGHT/ 2;
        _.camera.lookPosition.x = SCR_WIDTH / 2;
        _.camera.lookPosition.y = SCR_HEIGHT / 2;

        this.camera.lookEuler.x = -Math.PI / 200;

        let debugCamera = false;



        this.app = {};
        this.app.stage = new PIXI.Container();



        requestAnimationFrame(this.animate.bind(this));
    };




    addSprite(px: number, py: number): PIXI.Sprite {
        let tex = PIXI.Texture.fromFrame("wall2.png");
        let s = new PIXI.Sprite3d(tex);
        s.x = px;
        s.y = py;
        return s
    }

    loadComplete(): void {
        this.isInitialLoading = false;
        let bg1 = new PIXI.Container3d();
        let bg2 = new PIXI.Container3d();
        bg1.z = 10;
        bg2.z = 50;

        //Light layer in front of everything but has same transformations as bg2
        let lightLayer= new PIXI.Container3d();
        lightLayer.z = 50;

        this.app.stage.addChild(this.camera);
        this.camera.addChild(bg2);
        this.camera.addChild(bg1);
        this.camera.addChild(lightLayer);


        for (let x = 0; x < 20; ++x) {
            for (let y = 0; y < 20; ++y) {
                if (x == 1 && y == 1) continue;
                let s = this.addSprite(x*90, y*90);
                s.tint = 0x778899;
                bg2.addChild(s)
            }
        }


        for (let x = 0; x < 20; ++x) {
            for (let y = 0; y < 20; ++y) {
                if (Math.random() > .6) {
                    let s = this.addSprite(x*90, y*90);;
                    bg1.addChild(s)
                }
            }
        }

        let delta = 140;

        let l = {
            gfx: new PIXI.Sprite(),
            ambient: PIXI.Graphics,
            newAmbient: function (col) {
                    let a = new PIXI.Graphics();
                    a.clear();

                    a.beginFill(col, 1);
                    a.drawRect(this.filterArea.x, this.filterArea.y, this.filterArea.width, this.filterArea.height);
                    a.endFill();
                    return a;
                },

            addLight(l: PIXI.Sprite): void{
                l.blendMode = PIXI.BLEND_MODES.ADD;
                this.gfx.addChild(l);
            },
            filterArea: new PIXI.Rectangle(-delta, -delta, SCR_WIDTH + 2*delta, SCR_HEIGHT + 2*delta),
        };
        l.ambient = l.newAmbient(0x98dede);
        l.gfx.filters = [new PIXI.filters.VoidFilter()];
        l.gfx.filters[0].blendMode = PIXI.BLEND_MODES.MULTIPLY;
        l.gfx.filterArea = l.filterArea;
        lightLayer.addChild(l.gfx);
        l.gfx.addChild(l.ambient);

        //this is front smooth light it shouldnt cut
        let s = new PIXI.Sprite3d(PIXI.Texture.fromFrame("lightship.png"));
        s.x = 300;
        s.y = 100;
        l.addLight(s);

        //here's windows, windows should be cutted
        s = new PIXI.Sprite3d(PIXI.Texture.fromFrame("lightsqure.png"));
        s.x = -s.width/2 + 100;
        s.y = -s.height/2+ 120;


        let mask = new PIXI.Sprite(PIXI.Texture.fromFrame("bullettest.png"));
        this.camera.addChild(mask);
//        s.mask = mask;

        l.addLight(s)

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

    animate(): void {
        this.random = Math.random();
        this.time = (new Date()).getTime();
        let pos = this.renderer.plugins.interaction.mouse.global;


        requestAnimationFrame(this.animate.bind(this));

        this.renderer.render(this.app.stage);
    }
}

export let _: Main = new Main();
_.start();
_.load();