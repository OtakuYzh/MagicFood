import { ecsclass, EcsComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { MyEntity } from '../entity/MyEntity';

@ecsclass('EnemyComponent')
export class EnemyComponent extends EcsComponent<MyEntity> {
    static allowRecycling: boolean = true;
}


