import { _decorator, EventTouch, instantiate, math, Node, Prefab, randomRange, UITransform, v3, Vec2, Vec3, view } from 'cc';
import BaseView from '../../../../../../extensions/app/assets/base/BaseView';
import { IMiniViewNames } from '../../../../../app-builtin/app-admin/executor';
import { ecs, filter, MoveComponent, MoveSystem, NodeComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
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
import { ExpComponent } from './expansion/ecs/component/ExpComponent';
import { app } from 'db://assets/app/app';
import { RangeComponent } from './expansion/ecs/component/RangeComponent';
import { QuadTreeSingleton } from './expansion/ecs/singleton/QuadTreeSingleton';
import { QuadTreeBodyComponent } from './expansion/ecs/component/QuadTreeBodyComponent';
import { QuadTreeSystem } from './expansion/ecs/system/QuadTreeSystem';

enum Group {
    Player = 1 << 0,
    Bullet = 1 << 1,
    Enemy = 1 << 2,
    Exp = 1 << 3,
    Range = 1 << 4,
}

enum Mask {
    Player = Group.Enemy | Group.Exp,
    Bullet = Group.Enemy,
    Enemy = Group.Player | Group.Bullet | Group.Range,
    Exp = Group.Player,
    Range = Group.Enemy,
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

    @property(Prefab)
    private exp: Prefab = null;

    @property(Prefab)
    private range: Prefab = null;

    private _isRuning = false;

    // 初始化的相关逻辑写在这
    onLoad() {
        ecs.addSingleton(QuadTreeSingleton);

        ecs.addSystem(EnemySystem);
        ecs.addSystem(ShootSystem);
        ecs.addSystem(MoveSystem);
        ecs.addSystem(QuadTreeSystem);
        ecs.addSystem(CollisionSystem);
        ecs.addSystem(DestroySystem);

        this.controller.on(GameController.Event.Enemy, this.onEnemy, this);
        this.controller.on(GameController.Event.Shoot, this.onShoot, this);
        this.controller.on(GameController.Event.Exp, this.onExp, this);
        this.controller.on(GameController.Event.LevelUp, this.onLevelUp, this);

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

    private onEnemy() {
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

        const quadtreeNode = entity.add(QuadTreeBodyComponent);
        quadtreeNode.body.setGroup(Group.Enemy);
        quadtreeNode.body.setMask(Mask.Enemy);
        quadtreeNode.body.setRect(node.boundingBox);

        const move = entity.add(MoveComponent);
        move.toward = -90;
        move.speed = 100;

        entity.add(EnemyComponent);
    }

    private onShoot(player: PlayerComponent, x?: number, y?: number) {
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
        const inputPos = new Vec3(x, y, bullet.z);
        inputPos.subtract(bullet.position);
        const angle = Math.atan2(inputPos.y, inputPos.x) * 180 / Math.PI;
        move.toward = angle;
        move.speed = 1000;
        move.options = {
            rotate: false,
            minSpeed: -Infinity,
            maxSpeed: Infinity,
            acceleratedVelocity: 100,
            angleVelocity: 0
        }

        entity.add(BulletComponent);
    }

    private onExp(enemyN: NodeComponent) {
        const exp = instantiate(this.exp);
        exp.parent = this.node;
        exp.x = enemyN.x;
        exp.y = enemyN.y;

        const entity = ecs.createEntity(MyEntity, { node: exp });

        const node = entity.add(NodeComponent);
        node.setPosition(exp.x, exp.y);
        node.setContentSize(exp.getComponent(UITransform).width, exp.getComponent(UITransform).height);

        const collision = entity.add(CollisionComponent);
        collision.body.setGroup(Group.Exp);
        collision.body.setMask(Mask.Exp);
        collision.body.setRect(node.boundingBox);

        const move = entity.add(MoveComponent);
        const playerPos = ecs.find(filter.all(PlayerComponent, NodeComponent)).get(NodeComponent).position;
        move.toward = Math.atan2(playerPos.y - exp.y, playerPos.x - exp.x) * 180 / Math.PI;
        move.speed = 1000;

        entity.add(ExpComponent);
    }

    private onLevelUp() {
        app.manager.ui.show({
            name: 'PopGameLevelUp'
        })
    }

    private initPlayer() {
        const winSize = view.getVisibleSize();
        // 实例化预制体
        const player = instantiate(this.player);
        player.parent = this.node;
        player.x = winSize.width / 2;
        player.y = 0;
        // TODO 缺少位置信息相关的组件
        // player.setPosition(math.v3(0, -200, 0)); //TODO

        // 创建实体
        const entity = ecs.createEntity(MyEntity, { node: player });

        const node = entity.add(NodeComponent);
        node.setPosition(player.x, player.y);
        node.setContentSize(player.getComponent(UITransform).width, player.getComponent(UITransform).height);

        const collision = entity.addComponent(CollisionComponent);
        collision.body.setGroup(Group.Player);
        collision.body.setMask(Mask.Player);
        collision.body.setRect(node.boundingBox);

        // 添加玩家组件
        entity.add(PlayerComponent);

        const range = instantiate(this.range);
        range.parent = this.node;
        range.x = 0;
        range.y = 0;
        const rangeE = ecs.createEntity(MyEntity, { node: range });
        const rangeN = rangeE.add(NodeComponent);
        rangeN.setAnchorPoints(0.5, 0);
        rangeN.setPosition(range.x, range.y);
        rangeN.setContentSize(range.getComponent(UITransform).width, range.getComponent(UITransform).height);
        const rangeC = rangeE.add(CollisionComponent);
        rangeC.body.setGroup(Group.Range);
        rangeC.body.setMask(Mask.Range);
        rangeC.body.setRect(rangeN.boundingBox);
        const rangQ = rangeE.add(QuadTreeBodyComponent);
        rangQ.body.setGroup(Group.Range);
        rangQ.body.setMask(Mask.Range);
        rangQ.body.setRect(rangeN.boundingBox);
        rangeE.add(RangeComponent);
    }
}
