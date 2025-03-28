import { _decorator, instantiate, math, Prefab, UITransform } from 'cc';
import BaseView from '../../../../../../extensions/app/assets/base/BaseView';
import { IMiniViewNames } from '../../../../../app-builtin/app-admin/executor';
import { ecs, MoveComponent, MoveSystem, NodeComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { MyEntity } from './expansion/ecs/entity/MyEntity';
import { ShootSystem } from './expansion/ecs/system/ShootSystem';
import { PlayerComponent } from './expansion/ecs/component/PlayerComponent';
import { GameController } from 'db://assets/app-builtin/app-controller/GameController';
const { ccclass, property } = _decorator;
@ccclass('PageGame')
export class PageGame extends BaseView.BindController(GameController) {
    // 子界面列表，数组顺序为子界面排列顺序
    protected miniViews: IMiniViewNames = ['PaperGamePer'];

    @property(Prefab)
    private player: Prefab = null;

    @property(Prefab)
    private bullet: Prefab = null;

    private _isRuning = false;

    // 初始化的相关逻辑写在这
    onLoad() {
        ecs.addSystem(ShootSystem);
        ecs.addSystem(MoveSystem); //公共的move系统

        this.controller.on(GameController.Event.Shoot, this.onShoot, this);

        this.initPlayer();
    }

    protected onFocus() {
        this._isRuning = true;
    }

    protected onLostFocus() {
        this._isRuning = false;
    }

    protected update(dt: number): void {
        if (!this._isRuning) return;
        ecs.execute(dt)
    }

    // 界面打开时的相关逻辑写在这(onShow可被多次调用-它与onHide不成对)
    onShow(params: any) { this.showMiniViews({ views: this.miniViews }); }

    // 界面关闭时的相关逻辑写在这(已经关闭的界面不会触发onHide)
    onHide(result: undefined) {
        // app.manager.ui.show<PageGame>({name: 'PageGame', onHide:(result) => { 接收到return的数据，并且有类型提示 }})
        ecs.clear();
        this.controller.targetOff(this);
        return result;
    }

    onShoot(player: PlayerComponent) {
        const bullet = instantiate(this.bullet);
        bullet.parent = this.node;
        bullet.setPosition(player.entity.node.getPosition());

        const entity = ecs.createEntity(MyEntity, { node: bullet });

        const node = entity.add(NodeComponent);
        node.setPosition(player.entity.node.position.x, player.entity.node.position.y);
        node.setContentSize(bullet.getComponent(UITransform).width, bullet.getComponent(UITransform).height);

        const move = entity.add(MoveComponent);
        move.toward = 90; // 垂直
        move.speed = 1000;
    }

    private initPlayer() {
        // 实例化预制体
        const player = instantiate(this.player);
        player.parent = this.node;
        // TODO 缺少位置信息相关的组件
        // player.setPosition(math.v3(0, -200, 0)); //TODO

        // 创建实体
        const entity = ecs.createEntity(MyEntity, { node: player });

        // 添加玩家组件
        entity.add(PlayerComponent);
    }
}
