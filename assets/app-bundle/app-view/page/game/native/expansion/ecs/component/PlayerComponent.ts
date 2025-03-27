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
}


