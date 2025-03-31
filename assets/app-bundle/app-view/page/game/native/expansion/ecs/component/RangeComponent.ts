import { ecsclass, EcsComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { MyEntity } from '../entity/MyEntity';

@ecsclass('RangeComponent')
export class RangeComponent extends EcsComponent<MyEntity> {
    static allowRecycling: boolean = true;
}


