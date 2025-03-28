import { ecsclass, EcsComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { MyEntity } from '../entity/MyEntity';

@ecsclass('ExpComponent')
export class ExpComponent extends EcsComponent<MyEntity> {
    static allowRecycling: boolean = true;
}


