import { SAP } from 'db://pkg/@gamex/cc-sap';
import { MyEntity } from '../entity/MyEntity';
import { EcsSystem, filter, IEntity, IFilter, NodeComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { BulletComponent } from '../component/BulletComponent';
import { CollisionComponent } from '../component/CollisionComponent';
import { DestroyComponent } from '../component/DestroyComponent';
import { view } from 'cc';
import { EnemyComponent } from '../component/EnemyComponent';
import { ExpComponent } from '../component/ExpComponent';
import { PlayerComponent } from '../component/PlayerComponent';
import { app } from 'db://assets/app/app';
import { RangeComponent } from '../component/RangeComponent';
import { Vec2 } from 'cc';

export class CollisionSystem extends EcsSystem {

    private physics: SAP<MyEntity>; // SAP碰撞检测
    private _rangeEnemyUIDs = new Set<number>();

    protected onAdd(): void {
        this.physics = new SAP<MyEntity>();
    }

    protected onRemove(): void {
        this.physics.clear();
        this.physics = null;
    }

    private playerFilter = filter.all(PlayerComponent, CollisionComponent, NodeComponent).exclude(DestroyComponent);
    private bulletFilter = filter.all(BulletComponent, CollisionComponent, NodeComponent).exclude(DestroyComponent);
    private enemyFilter = filter.all(EnemyComponent, CollisionComponent, NodeComponent).exclude(DestroyComponent);
    private expFilter = filter.all(ExpComponent, CollisionComponent, NodeComponent).exclude(DestroyComponent);
    private rangeFilter = filter.all(RangeComponent, CollisionComponent, NodeComponent).exclude(DestroyComponent);

    protected matcher: IFilter = filter.all(CollisionComponent, NodeComponent);
    protected onEntityEnter(entity: IEntity): void {
        this.physics.insert(entity.get(CollisionComponent).body);
    }
    protected onEntityLeave(entity: IEntity): void {
        this.physics.remove(entity.get(CollisionComponent).body);
    }

    protected execute(dt?: number, ...args: any[]): void {
        const winSize = view.getVisibleSize();

        const playerNode = this.find(this.playerFilter, NodeComponent);
        if (playerNode) playerNode.entity.get(CollisionComponent).body.setRect(playerNode.boundingBox);

        const enemyNode = this.query(this.enemyFilter, NodeComponent);
        enemyNode.forEach(node => {
            // 出界
            if (node.maxY < 0) {
                node.entity.add(DestroyComponent);
            }
            node.entity.get(CollisionComponent).body.setRect(node.boundingBox);
        })

        const bulletNode = this.query(this.bulletFilter, NodeComponent);
        bulletNode.forEach(node => {
            // 出界
            if (node.maxY > winSize.height) {
                node.entity.add(DestroyComponent);
            }
            node.entity.get(CollisionComponent).body.setRect(node.boundingBox);
        })

        const expNode = this.query(this.expFilter, NodeComponent);
        expNode.forEach(node => {
            node.entity.get(CollisionComponent).body.setRect(node.boundingBox);
        })

        const rangeNode = this.query(this.rangeFilter, NodeComponent);
        rangeNode.forEach(node => {
            node.entity.get(CollisionComponent).body.setRect(node.boundingBox);
        })

        // 单位间碰撞
        this.physics.trigger((a, b) => {
            if (a.data.has(PlayerComponent)) {
                if (b.data.has(EnemyComponent)) {
                    this.playerAndEnemy(a.data, b.data);
                } else if (b.data.has(ExpComponent)) {
                    this.playerAndExp(a.data, b.data);
                }
            } else if (a.data.has(BulletComponent)) {
                if (b.data.has(EnemyComponent)) {
                    this.bulletAndEnemy(a.data, b.data);
                }
            } else if (a.data.has(EnemyComponent)) {
                if (b.data.has(BulletComponent)) {
                    this.bulletAndEnemy(b.data, a.data);
                } else if (b.data.has(PlayerComponent)) {
                    this.playerAndEnemy(b.data, a.data);
                } else if (b.data.has(RangeComponent)) {
                    this.enemyAndRange(a.data, b.data);
                }
            } else if (a.data.has(ExpComponent)) {
                if (b.data.has(PlayerComponent)) {
                    this.playerAndExp(b.data, a.data);
                }
            } else if (a.data.has(RangeComponent)) {
                if (b.data.has(EnemyComponent)) {
                    this.enemyAndRange(b.data, a.data);
                }
            }
        })
    }

    private playerAndEnemy(playerE: MyEntity, enemyE: MyEntity) {
    }

    private playerAndExp(playerE: MyEntity, expE: MyEntity) {
        const player = playerE.get(PlayerComponent);
        player.exp += 1;
        expE.add(DestroyComponent);
        app.controller.game.expVal(player.exp);
        if (player.exp % 2 == 0) {
            app.controller.game.levelUp();
        }
    }

    private bulletAndEnemy(bulletE: MyEntity, enemyE: MyEntity) {
        if (!bulletE.has(DestroyComponent)) bulletE.add(DestroyComponent);
        if (!enemyE.has(DestroyComponent)) enemyE.add(DestroyComponent);
        app.controller.game.exp(enemyE.get(NodeComponent));
        const player = this.find(this.playerFilter, PlayerComponent);
        if (player) {
            player.deleteRangeUUID(enemyE.uuid);
            player.targetId = 0;
        }
    }

    private enemyAndRange(enemyE: MyEntity, rangeE: MyEntity) {
        const player = this.find(this.playerFilter, PlayerComponent);
        if (player) {
            player.addRangeUUID(enemyE.uuid);
            if (player.targetId == 0) {
                const playerPos = new Vec2(player.entity.get(NodeComponent).position.x, player.entity.get(NodeComponent).position.y);
                let targetPos = new Vec2();
                let minRange = 0;
                for (const targetUUID of player.rangeUUIDs) {
                    const target = this.ecs.findByUuid(targetUUID);
                    targetPos.x = target.get(NodeComponent).position.x;
                    targetPos.y = target.get(NodeComponent).position.y;
                    const distance = Vec2.distance(playerPos, targetPos);
                    if (distance < minRange || minRange == 0) {
                        minRange = distance;
                        player.targetId = targetUUID;
                    }
                }
            }
        }
    }
}


