import { SAP } from 'db://pkg/@gamex/cc-sap';
import { MyEntity } from '../entity/MyEntity';
import { EcsSystem, filter, IEntity, IFilter, NodeComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { BulletComponent } from '../component/BulletComponent';
import { CollisionComponent } from '../component/CollisionComponent';
import { DestroyComponent } from '../component/DestroyComponent';
import { view } from 'cc';

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

    protected matcher: IFilter = filter.all(CollisionComponent, NodeComponent);
    protected onEntityEnter(entity: IEntity): void {
        this.physics.insert(entity.get(CollisionComponent).body);
    }
    protected onEntityLeave(entity: IEntity): void {
        this.physics.remove(entity.get(CollisionComponent).body);
    }

    protected execute(dt?: number, ...args: any[]): void {
        const winSize = view.getVisibleSize();

        const bulletNode = this.query(this.bulletFilter, NodeComponent);
        bulletNode.forEach(node => {
            // 出界
            if (node.maxY > winSize.height) {
                node.entity.add(DestroyComponent);
            }
            node.entity.get(CollisionComponent).body.setRect(node.boundingBox);
        })
    }
}


