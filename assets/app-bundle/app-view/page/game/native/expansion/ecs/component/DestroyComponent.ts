import { ecsclass, EcsComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { MyEntity } from '../entity/MyEntity';

@ecsclass('DestroyComponent')
export class DestroyComponent extends EcsComponent<MyEntity> {
    static allowRecycling: boolean = true;
}


