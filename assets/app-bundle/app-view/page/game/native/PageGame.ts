import { _decorator, EventTouch, instantiate, math, Node, Prefab, randomRange, UITransform, v3, Vec2, Vec3, view } from 'cc';
import BaseView from '../../../../../../extensions/app/assets/base/BaseView';
import { IMiniViewNames } from '../../../../../app-builtin/app-admin/executor';
import { ecs, MoveComponent, MoveSystem, NodeComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { MyEntity } from './expansion/ecs/entity/MyEntity';
import { ShootSystem } from './expansion/ecs/system/ShootSystem';
import { PlayerComponent } from './expansion/ecs/component/PlayerComponent';
import { GameController } from 'db://assets/app-builtin/app-controller/GameController';
import { BulletComponent } from './expansion/ecs/component/BulletComponent';
import { CollisionSystem } from './expansion/ecs/system/CollisionSystem';
import { DestroySystem } from './expansion/ecs/system/DestroySystem';
import { CollisionComponent } from './expansion/ecs/component/CollisionComponent';
import { InputSingleton } from './expansion/ecs/singleton/InputSingleton';
import { EnemySystem } from './expansion/ecs/system/EnemySystem';
import { EnemyComponent } from './expansion/ecs/component/EnemyComponent';

enum Group {
    Player = 1 << 0,
    Bullet = 1 << 1,
    Enemy = 1 << 2,
}

enum Mask {
    Player = Group.Enemy,
    Bullet = Group.Enemy,
    Enemy = Group.Player | Group.Bullet,
}

const { ccclass, property } = _decorator;
@ccclass('PageGame')
export class PageGame extends BaseView.BindController(GameController) {
    // 子界面列表，数组顺序为子界面排列顺序
    protected miniViews: IMiniViewNames = ['PaperGamePer'];

    @property(Prefab)
    private player: Prefab = null;

    @property(Prefab)
    private bullet: Prefab = null;

    @property(Prefab)
    private enemy: Prefab = null;

    private _isRuning = false;

    // 初始化的相关逻辑写在这
    onLoad() {
        ecs.addSystem(EnemySystem);
        ecs.addSystem(ShootSystem);
        ecs.addSystem(MoveSystem); //公共的move系统
        ecs.addSystem(CollisionSystem);
        ecs.addSystem(DestroySystem);

        this.controller.on(GameController.Event.Enemy, this.onEnemy, this);
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

    onEnemy() {
        const enemy = instantiate(this.enemy);
        enemy.parent = this.node;
        //TODO 怪物生成的位置是否需要根据手机屏幕进行统一适配？
        enemy.x = randomRange(0, view.getVisibleSize().width);
        enemy.y = view.getVisibleSize().height;

        const entity = ecs.createEntity(MyEntity, { node: enemy });

        const node = entity.add(NodeComponent);
        node.setPosition(enemy.x, enemy.y);
        node.setContentSize(enemy.getComponent(UITransform).width, enemy.getComponent(UITransform).height);

        const collision = entity.add(CollisionComponent);
        collision.body.setGroup(Group.Enemy);
        collision.body.setMask(Mask.Enemy);
        collision.body.setRect(node.boundingBox);

        const move = entity.add(MoveComponent);
        move.toward = -90;
        move.speed = randomRange(100, 300);

        entity.add(EnemyComponent);
    }

    onShoot(player: PlayerComponent) {
        const bullet = instantiate(this.bullet);
        bullet.parent = this.node;
        const playerPos = player.entity.node.getPosition();
        bullet.x = playerPos.x;
        bullet.y = playerPos.y;

        const entity = ecs.createEntity(MyEntity, { node: bullet });

        const node = entity.add(NodeComponent);
        node.setPosition(bullet.x, bullet.y);
        node.setContentSize(bullet.getComponent(UITransform).width, bullet.getComponent(UITransform).height);

        const collision = entity.add(CollisionComponent);
        collision.body.setGroup(Group.Bullet);
        collision.body.setMask(Mask.Bullet);
        collision.body.setRect(node.boundingBox);

        const move = entity.add(MoveComponent);
        const input = ecs.getSingleton(InputSingleton);
        const inputPos = new Vec3(input.x, input.y, bullet.z);
        inputPos.subtract(bullet.position);
        const angle = Math.atan2(inputPos.y, inputPos.x) * 180 / Math.PI;
        move.toward = angle;
        // move.toward = 90; // 垂直
        move.speed = 1000;

        entity.add(BulletComponent);
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

        const input = ecs.addSingleton(InputSingleton);
        input.x = 0;
        input.y = view.getVisibleSize().height;

        this.node.on(Node.EventType.TOUCH_START, this.onChangeShootAngle, this);
        this.node.on(Node.EventType.TOUCH_END, this.onChangeShootAngle, this);
    }

    private onChangeShootAngle(event: EventTouch) {
        const input = ecs.getSingleton(InputSingleton);
        const pos = event.getUILocation();
        const { x, y } = this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(pos.x, pos.y, 1));
        input.x = x;
        input.y = y;
    }
}
