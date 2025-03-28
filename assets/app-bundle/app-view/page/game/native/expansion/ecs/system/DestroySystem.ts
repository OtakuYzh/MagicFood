import { EcsSystem, filter } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { DestroyComponent } from '../component/DestroyComponent';

export class DestroySystem extends EcsSystem {

    private destroyFilter = filter.all(DestroyComponent);

    protected afterExecute(dt?: number, ...args: any[]): void {
        this.query(this.destroyFilter).forEach(entity => {
            entity.node.destroy();

            entity.destroy();
        })
    }
}


