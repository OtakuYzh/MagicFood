import { ecsclass, EcsComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { MyEntity } from '../entity/MyEntity';

@ecsclass('PlayerComponent')
export class PlayerComponent extends EcsComponent<MyEntity> {
    static allowRecycling: boolean = true;

    protected onRemove(): void { }

    /** 攻速 */
    private _aspd = 1;
    public get aspd(): number {
        return this._aspd;
    }
    public set aspd(v: number) {
        if (v > 10) v = 10;
        this._aspd = v;
    }
    get attackInterval() {
        return 1 / this.aspd;
    };

    /** 分裂 */
    private _spilt = 1;
    public get split(): number {
        return this._spilt;
    }
    public set split(v: number) {
        this._spilt = v;
    }

    /** 攻击力 */
    private _attack = 1;
    public get attack(): number {
        return this._attack;
    }
    public set attack(v: number) {
        this._attack = v;
    }

    /** 经验值 */
    private _exp = 0;
    public get exp(): number {
        return this._exp;
    }
    public set exp(v: number) {
        this._exp = v;
    }

    /** 攻击范围 */
    private _arng = 400;
    public get arng(): number {
        return this._arng;
    }

    /** 攻击角度 */
    private _aoa = 90;
    public get aoa(): number {
        return this._aoa;
    }
    public set aoa(v: number) {
        this._aoa = v;
    }
}


