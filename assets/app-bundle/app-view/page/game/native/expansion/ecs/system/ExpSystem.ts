import { EcsSystem, filter, MoveComponent, NodeComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { ExpComponent } from '../component/ExpComponent';

export class ExpSystem extends EcsSystem {

    private expFilter = filter.all(ExpComponent, NodeComponent, MoveComponent);

}


