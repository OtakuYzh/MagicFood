import { SAP } from 'db://pkg/@gamex/cc-sap';
import { MyEntity } from '../entity/MyEntity';
import { EcsSystem, filter, IEntity, IFilter, NodeComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { BulletComponent } from '../component/BulletComponent';
import { CollisionComponent } from '../component/CollisionComponent';
import { DestroyComponent } from '../component/DestroyComponent';
import { view } from 'cc';
import { EnemyComponent } from '../component/EnemyComponent';

export class CollisionSystem extends EcsSystem {

    private physics: SAP<MyEntity>; // SAP碰撞检测

    protected onAdd(): void {
        this.physics = new SAP<MyEntity>();
    }

    protected onRemove(): void {
        this.physics.clear();
        this.physics = null;
    }

    private bulletFilter = filter.all(BulletComponent, CollisionComponent, NodeComponent).exclude(DestroyComponent);
    private enemyFilter = filter.all(EnemyComponent, CollisionComponent, NodeComponent).exclude(DestroyComponent);

    protected matcher: IFilter = filter.all(CollisionComponent, NodeComponent);
    protected onEntityEnter(entity: IEntity): void {
        this.physics.insert(entity.get(CollisionComponent).body);
    }
    protected onEntityLeave(entity: IEntity): void {
        this.physics.remove(entity.get(CollisionComponent).body);
    }

    protected execute(dt?: number, ...args: any[]): void {
        const winSize = view.getVisibleSize();

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

        // 单位间碰撞
        this.physics.trigger((a, b) => {
            if (a.data.has(BulletComponent)) {
                if (b.data.has(EnemyComponent)) {
                    this.bulletAndEnemy(a.data, b.data);
                }
            } else if (a.data.has(EnemyComponent)) {
                if (b.data.has(BulletComponent)) {
                    this.bulletAndEnemy(b.data, a.data);
                }
            }
        })
    }

    private bulletAndEnemy(bulletE: MyEntity, enemyE: MyEntity) {
        if (!bulletE.has(DestroyComponent)) bulletE.add(DestroyComponent);
        if (!enemyE.has(DestroyComponent)) enemyE.add(DestroyComponent);
    }
}


