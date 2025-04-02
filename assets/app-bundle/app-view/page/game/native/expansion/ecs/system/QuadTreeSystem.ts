import { EcsSystem, filter, IEntity, NodeComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { QuadTreeSingleton } from '../singleton/QuadTreeSingleton';
import { QuadTreeBodyComponent } from '../component/QuadTreeBodyComponent';
import { DestroyComponent } from '../component/DestroyComponent';

export class QuadTreeSystem extends EcsSystem {

    private quadTreeFilter = filter.all(QuadTreeBodyComponent, NodeComponent).exclude(DestroyComponent);

    protected onAdd(): void {
        this.ecs.getSingleton(QuadTreeSingleton).init();
    }

    protected onRemove(): void {
        this.ecs.getSingleton(QuadTreeSingleton).clear();
    }

    protected onEntityEnter(entity: IEntity): void {
        this.ecs.getSingleton(QuadTreeSingleton).insert(entity);
    }
    protected onEntityLeave(entity: IEntity): void {
        this.ecs.getSingleton(QuadTreeSingleton).remove(entity);
    }

    protected execute(dt?: number, ...args: any[]): void {
        const quadTreeNode = this.query(this.quadTreeFilter, NodeComponent);
        quadTreeNode.forEach(node => {
            node.entity.get(QuadTreeBodyComponent).body.setRect(node.boundingBox);
        })
    }
}


